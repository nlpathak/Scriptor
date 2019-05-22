from flask import Blueprint, jsonify, g

from backend.podcasts.models import Podcast
from backend.search.models import PodcastTranscriptionBlob
from backend.users.models import HistoryItem

podcasts_blueprint = Blueprint('podcasts', __name__, url_prefix="/api/podcasts")


@podcasts_blueprint.route("/snippets/<string:transcription_blob_id>/")
def get_podcast_snippet(transcription_blob_id):
    transcription_blob = PodcastTranscriptionBlob.get(id=transcription_blob_id)
    podcast = transcription_blob.podcast.to_dict()

    if g.current_user:
        # There's a logged-in user, so add this view to their history.
        history_item = HistoryItem(type=HistoryItem.TYPE_PODCAST_PAGE,
                                   podcast_page_transcription_blob_id=transcription_blob.meta.id)
        g.current_user.add_history_item(history_item)

    return jsonify(success=True, podcast=podcast, transcription_blob=transcription_blob.to_dict())


@podcasts_blueprint.route("/<string:podcast_id>/")
def get_podcast(podcast_id):
    podcast = Podcast.get(id=podcast_id).to_dict()
    return jsonify(success=True, podcast=podcast)


@podcasts_blueprint.route("/<string:podcast_id>/transcript/")
def get_podcast_transcript(podcast_id):
    full_transcript = Podcast.get(id=podcast_id).full_transcript
    return jsonify(success=True, full_transcript=full_transcript)
