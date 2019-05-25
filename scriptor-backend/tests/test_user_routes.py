import time

import pytest

from backend.app import app
from backend.podcasts.models import Podcast
from backend.search.models import PodcastTranscriptionBlob
from backend.users.models import User, HistoryItem

TEST_VALID_EMAIL = "test@test.com"


@pytest.fixture
def client():
    app.config['TESTING'] = True
    client = app.test_client()
    yield client


@pytest.fixture
def test_user():
    test_user_email = "test_" + str(int(time.time())) + "@test.com"
    test_user_pass = "test"

    test_user = User.register_new_user(email=test_user_email, password=test_user_pass)
    time.sleep(1)

    yield (test_user_email, test_user_pass, test_user.generate_auth_token())

    # After this test user has been used, delete him
    test_user.delete()


@pytest.fixture
def test_podcasts():
    # Generate and return n sample podcasts.
    test_podcasts = [Podcast(title="podcast 1", full_transcript="Lorem ipsum"),
                     Podcast(title="podcast 2", full_transcript="Lorem ipsum"),
                     Podcast(title="podcast 3", full_transcript="Lorem ipsum")]

    test_podcast_transcription_blobs = []

    for podcast in test_podcasts:
        podcast.save()

        test_blobs = [
            PodcastTranscriptionBlob(podcast_id=podcast.meta.id, transcription_blob="lorem ipsum " + str(time.time())),
            PodcastTranscriptionBlob(podcast_id=podcast.meta.id,
                                     transcription_blob="lorem ipsum " + str(time.time() + 10)),
            PodcastTranscriptionBlob(podcast_id=podcast.meta.id,
                                     transcription_blob="lorem ipsum " + str(time.time() + 100))
        ]

        for blob in test_blobs:
            blob.save()

        test_podcast_transcription_blobs.extend(test_blobs)

    time.sleep(1)

    yield test_podcasts

    # After the test podcasts have been used, delete them
    for podcast in test_podcasts:
        podcast.delete()

    for blob in test_podcast_transcription_blobs:
        blob.delete()


def test_invalid_registration(client):
    invalid_email = "ASda"
    password = "test"

    response = client.post("/api/user/register/", json={
        "email": invalid_email,
        "password": password
    })
    res = response.get_json()

    assert 400 == response.status_code
    assert not res['success']
    assert "Invalid email." == res['error']


def test_valid_registration(client):
    email = "test@test.com"
    password = "test"

    response = client.post("/api/user/register/", json={"email": email, "password": password})
    res = response.get_json()

    assert 200 == response.status_code
    assert res['success']
    assert res['auth_token']

    time.sleep(1)

    User.delete_by_email(email=email)


def test_login(test_user, client):
    (test_user_email, test_user_password, _) = test_user

    # Test if we can fail to login with invalid credentials
    response = client.post("/api/user/login/",
                           json={"email": test_user_email, "password": test_user_password + "Sdfg"})
    res = response.get_json()

    assert 400 == response.status_code
    assert not res['success']
    assert "Incorrect password." == res['error']

    # Test if we can login with this newly created user
    response = client.post("/api/user/login/", json={"email": test_user_email, "password": test_user_password})
    res = response.get_json()

    assert 200 == response.status_code
    assert res['success']
    assert res['auth_token']


def test_authorization(test_user, client):
    (test_user_email, _, auth_token) = test_user

    # Test if authentication works
    response = client.get("/api/user/me/", headers={"Authorization": f"Bearer {auth_token}"})
    res = response.get_json()

    assert 200 == response.status_code
    assert res['success']
    assert res['current_user']['email'] == test_user_email


def test_change_password(test_user, client):
    (test_user_email, test_user_password, auth_token) = test_user

    existing_password = test_user_password
    invalid_existing_password = existing_password + "1"
    new_password = test_user_password + "123"

    # Request should fail without authorization
    response = client.post("/api/user/change_password/", json={"existing_password": existing_password,
                                                               "new_password": new_password})
    res = response.get_json()
    assert 401 == response.status_code
    assert not res['success']
    assert "Unauthorized access." == res["error"]

    # Change password should fail if existing password is incorrect
    response = client.post("/api/user/change_password/", json={"existing_password": invalid_existing_password,
                                                               "new_password": new_password},
                           headers={"Authorization": f"Bearer {auth_token}"})
    res = response.get_json()
    assert 400 == response.status_code
    assert not res['success']
    assert "Incorrect existing password." == res['error']

    # Change password should work for valid existing & new passwords
    response = client.post("/api/user/change_password/", json={"existing_password": existing_password,
                                                               "new_password": new_password},
                           headers={"Authorization": f"Bearer {auth_token}"})
    res = response.get_json()
    assert 200 == response.status_code
    assert res['success']

    time.sleep(1)

    # Make sure we can login with new credentials
    response = client.post("/api/user/login/", json={"email": test_user_email,
                                                     "password": new_password})
    res = response.get_json()
    assert 200 == response.status_code
    assert res['success']
    assert res["auth_token"]

    # Make sure we can't login with old credentials
    response = client.post("/api/user/login/", json={"email": test_user_email,
                                                     "password": existing_password})
    res = response.get_json()
    assert 400 == response.status_code
    assert not res['success']
    assert "Incorrect password." == res["error"]


def test_user_favorite_podcasts(test_user, test_podcasts, client):
    (test_user_email, test_user_password, auth_token) = test_user

    # Add a favorite podcast for the user
    for test_podcast in test_podcasts:
        response = client.post(f"/api/user/favorite_podcasts/{test_podcast.meta.id}/add/",
                               headers={"Authorization": f"Bearer {auth_token}"})
        res = response.get_json()
        assert 200 == response.status_code
        assert res["success"]

    time.sleep(1)

    # Check that the user's list of favorite podcasts have been saved
    response = client.get("/api/user/favorite_podcasts/", headers={"Authorization": f"Bearer {auth_token}"})
    res = response.get_json()

    assert 200 == response.status_code
    assert res["success"]
    assert len(test_podcasts) == len(res["favorite_podcasts"])

    # Check that the "user_check_favorite_podcast" API endpoint works
    for test_podcast in test_podcasts:
        response = client.get(f"/api/user/favorite_podcasts/{test_podcast.meta.id}/check/",
                              headers={"Authorization": f"Bearer {auth_token}"})
        res = response.get_json()
        assert 200 == response.status_code
        assert res["success"]
        assert res["has_favorited_podcast"]

    # Delete some favorite podcasts
    fav_podcasts_to_delete = test_podcasts[:1]
    for podcast in fav_podcasts_to_delete:
        response = client.delete(f"/api/user/favorite_podcasts/{podcast.meta.id}/remove/",
                                 headers={"Authorization": f"Bearer {auth_token}"})
        res = response.get_json()
        assert 200 == response.status_code
        assert res["success"]

    time.sleep(1)

    # Check that the "user_check_favorite_podcast" API endpoint works
    for test_podcast in test_podcasts:
        response = client.get(f"/api/user/favorite_podcasts/{test_podcast.meta.id}/check/",
                              headers={"Authorization": f"Bearer {auth_token}"})
        res = response.get_json()
        assert 200 == response.status_code
        assert res["success"]
        assert (test_podcast in fav_podcasts_to_delete) != res["has_favorited_podcast"]

    # Check that the user's list of favorite podcasts has now been updated
    response = client.get("/api/user/favorite_podcasts/", headers={"Authorization": f"Bearer {auth_token}"})
    res = response.get_json()

    assert 200 == response.status_code
    assert res["success"]
    assert len(test_podcasts) - len(fav_podcasts_to_delete) == len(res["favorite_podcasts"])


def test_user_history(test_user, test_podcasts, client):
    (test_user_email, test_user_password, auth_token) = test_user

    # Ensure that the starting user history is empty.
    response = client.get("/api/user/history/", headers={"Authorization": f"Bearer {auth_token}"})
    res = response.get_json()

    assert 200 == response.status_code
    assert res["success"]
    assert 0 == len(res["history"])

    # Let's add some stuff to the user's history
    response = client.get("/api/search/podcasts/", query_string={"q": "lorem"},
                          headers={"Authorization": f"Bearer {auth_token}"})
    res = response.get_json()

    assert 200 == response.status_code
    assert res['success']
    some_search_result = res['results'][0]

    response = client.get(some_search_result['href'], headers={"Authorization": f"Bearer {auth_token}"})
    res = response.get_json()

    assert 200 == response.status_code
    assert res['success']

    # Now, the user's history should have this search query and this podcast page view.
    response = client.get("/api/user/history/", headers={"Authorization": f"Bearer {auth_token}"})
    res = response.get_json()

    assert 200 == response.status_code
    assert res["success"]
    assert HistoryItem.TYPE_SEARCH_QUERY == res['history'][0]['type']
    assert HistoryItem.TYPE_PODCAST_PAGE == res['history'][1]['type']
    assert 2 == len(res['history'])

    # Clear the history
    response = client.delete("/api/user/history/clear/", headers={"Authorization": f"Bearer {auth_token}"})
    res = response.get_json()

    assert 200 == response.status_code
    assert res['success']

    # Finally, check that the user's history is indeed empty
    response = client.get("/api/user/history/", headers={"Authorization": f"Bearer {auth_token}"})
    res = response.get_json()

    assert 200 == response.status_code
    assert res["success"]
    assert 0 == len(res['history'])
