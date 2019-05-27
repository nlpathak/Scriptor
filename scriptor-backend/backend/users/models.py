import uuid

import jwt
from elasticsearch_dsl import Document, Text, Nested, InnerDoc, Q, Keyword, Object
from flask import url_for
from passlib.hash import bcrypt
from sendgrid import Mail, SendGridAPIClient

from backend.db import *
from backend.podcasts.models import Podcast
from backend.search.models import PodcastTranscriptionBlob
from backend.users.validation import is_password_valid


class HistoryItem(InnerDoc):
    """
    This defines a HistoryItem model, which will be the items in a user's history.

    Note that this is an inner, nested doc (it will be used inside a user's history field),
    so a separate index won't be created for this model.
    """
    TYPE_SEARCH_QUERY = "SEARCH_QUERY"
    TYPE_PODCAST_PAGE = "PODCAST_PAGE"

    type = Keyword(required=True)  # either a search query or a podcast page
    search_query = Text(required=False)  # Only applies if this HistoryItem is of the type "search_query"
    search_filters = Object(dynamic=True, required=False)  # Any search filters that the user had used.
    podcast_page_transcription_blob_id = Text(
        required=False)  # Only applies if this HistoryItem is of the type "podcast_page"

    @property
    def url(self):
        if self.type == HistoryItem.TYPE_SEARCH_QUERY:
            params = self.search_filters.to_dict()
            params.update({"q": self.search_query})
            return url_for("search.search_podcasts", **params)
        else:
            return url_for("podcasts.get_podcast_blob",
                           blob_id=self.podcast_page_transcription_blob_id)

    @property
    def title(self):
        if self.type == HistoryItem.TYPE_SEARCH_QUERY:
            return self.search_query
        else:
            return PodcastTranscriptionBlob.get(id=self.podcast_page_transcription_blob_id).podcast.title

    def convert_to_dict(self):
        return {"type": self.type, "url": self.url, "title": self.title}


class User(Document):
    """
    This defines a user model.

    Note: the id field is automatically provided by elasticsearch, so we don't define it here.
    """
    # These are Keyword types, so that they are only searchable by their exact value.
    email = Keyword()
    password_hash = Keyword()

    favorite_podcast_ids = Text(multi=True)  # A list of podcast ids for the user's favorites
    history = Nested(HistoryItem)  # A list of HistoryItems, representing the user's history

    password_recovery_token = Text(required=False)

    # Elasticsearch index settings for this model
    class Index:
        name = "users"

    def generate_password_recovery_token(self):
        self.password_recovery_token = str(uuid.uuid4())
        self.save()
        return self.password_recovery_token

    def verify_password_token(self, token):
        return self.password_recovery_token == token

    def send_forgot_password_email(self):
        password_recovery_token = self.generate_password_recovery_token()

        message = Mail(
            from_email=settings.FROM_EMAIL,
            to_emails=self.email,
            subject='Your Password Recovery Token',
            html_content=f"""
            Hey there!
            <br>
            <br>
            Forgot your password? No worries!
            <br>
            <br>
            Here's your recovery token: <b>{password_recovery_token}</b>
            <br>
            <br>
            Cheers,
            <br>
            The Scriptor Team
            """)

        sg = SendGridAPIClient(settings.SENDGRID_APIKEY)
        sg.send(message)

    @property
    def favorite_podcasts(self):
        try:
            return Podcast.mget(docs=self.favorite_podcast_ids)
        except:
            return []

    def has_favorited_podcast(self, podcast_id):
        return podcast_id in self.favorite_podcast_ids

    @classmethod
    def register_new_user(cls, email, password):
        """
        This will create a new User object with the given email, password & save it to the DB.

        :param email:       The user's email
        :param password:    The user's password
        :return:            A saved User object
        """
        # Check if email is already registered, and if so, raise an error.
        user_search = User.search()
        email_query = Q("term", email=email)

        if user_search.query(email_query).execute():
            raise ValueError("Email address already exists.")

        password_hash = bcrypt.hash(password)
        new_user = cls(email=email, password_hash=password_hash)
        new_user.save()
        return new_user

    @staticmethod
    def get_by_login_credentials(email, password):
        """
        This will attempt to fetch a user based on the given user credentials.

        If the email/password combo is invalid, this will raise a ValueError.
        :param email:       The user's email
        :param password:    The user's password
        :return:            The corresponding User object
        """
        email = email.strip()
        password = password.strip()

        user_search = User.search()

        login_query = Q("term", email=email)

        # For the login query, the email & password hash must match
        matching_users = user_search.query(login_query).execute()

        if not matching_users:
            raise ValueError("Invalid email.")

        user = matching_users[0]
        if not bcrypt.verify(password, user.password_hash):
            raise ValueError("Incorrect password.")

        return user

    def generate_auth_token(self):
        auth_token = jwt.encode({'user_id': self.meta.id}, settings.JWT_SECRET, algorithm='HS256')
        return auth_token.decode('utf-8')

    @classmethod
    def get_user_by_authtoken(cls, auth_token):
        """
        Given an auth token, this will return the corresponding User object from the DB.

        On failure, a ValueError will be raised.
        :param auth_token:      The user's auth token
        :return:                The corresponding User object
        """
        if not auth_token:
            raise ValueError("Invalid auth token.")
        try:
            user_dict = jwt.decode(auth_token, settings.JWT_SECRET, algorithms=['HS256'])
            user_id = user_dict['user_id']
            return User.get(id=user_id)
        except Exception as e:
            raise ValueError("User for auth token '%s' could not be fetched." % auth_token)

    def set_password(self, password):
        if not is_password_valid(password):
            raise ValueError("Invalid password.")

        password_hash = bcrypt.hash(password)
        self.password_hash = password_hash
        self.save()

    def change_password(self, existing_password, new_password):
        """
        This changes the user's password to the new, given password.

        This will raise a ValueError if either the existing password or new password is invalid.

        :param existing_password:   The user's existing password
        :param new_password:        The new password for the user
        :raises ValueError          if the existing/new password is invalid
        """
        if not bcrypt.verify(existing_password, self.password_hash):
            raise ValueError("Incorrect existing password.")

        self.set_password(new_password)


    def remove_favorite_podcast(self, podcast_id_to_remove):
        """
        This removes a podcast's id from the user's favorite list, if it exists.
        :param podcast_id:  The podcast id to remove from the user's favorite
        """
        self.favorite_podcast_ids = [podcast_id for podcast_id in self.favorite_podcast_ids if
                                     podcast_id != podcast_id_to_remove]
        self.save()

    def add_favorite_podcast(self, podcast_id):
        """
        This adds a podcast's id to the user's favorites list, if it hasn't already been added.
        :param podcast_id:      The podcast's id
        """
        favorite_podcast_ids = self.favorite_podcast_ids

        if podcast_id not in favorite_podcast_ids:
            # The user hasn't favorited this podcast yet, so add it to the list
            self.favorite_podcast_ids.append(podcast_id)

            # Save the updated user
            self.save()

    def add_history_item(self, history_item):
        """
        Add a history item to the user's history.

        :param history_item:    The HistoryItem object to add
        """
        self.history.append(history_item)
        self.save()

    def clear_history(self):
        self.history = []
        self.save()

    @staticmethod
    def delete_by_email(email):
        return User.search().query("term", email=email).delete()

    @staticmethod
    def find_by_email(email):
        try:
            return User.search().query("term", email=email).execute()[0]
        except:
            raise ValueError("Invalid email.")
