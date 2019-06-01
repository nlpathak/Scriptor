from flask import Blueprint, jsonify, g, request

from backend.podcasts.models import Podcast
from backend.search.models import PodcastTranscriptionBlob
from backend.users.models import HistoryItem

podcasts_blueprint = Blueprint('podcasts', __name__, url_prefix="/api/podcasts")


@podcasts_blueprint.route("/blobs/<string:blob_id>/")
def get_podcast_blob(blob_id):
    podcast_blob = PodcastTranscriptionBlob.get(id=blob_id)
    podcast = podcast_blob.podcast.convert_to_dict()

    if g.current_user:
        # There's a logged-in user, so add this view to their history.
        history_item = HistoryItem(type=HistoryItem.TYPE_PODCAST_PAGE,
                                   podcast_page_transcription_blob_id=podcast_blob.meta.id)
        g.current_user.add_history_item(history_item)

    return jsonify(success=True, podcast=podcast, podcast_blob=podcast_blob.convert_to_dict())


@podcasts_blueprint.route("/<string:podcast_id>/transcript/")
def get_podcast_transcript(podcast_id):
    sentence_split = int(request.args.get("sentence_split", 5))
    podcast = Podcast.get(id=podcast_id)
    full_transcript = podcast.full_transcript
    transcript_sections = podcast.get_transcript_sections(sentence_split=sentence_split)
    return jsonify(success=True, full_transcript=full_transcript, transcript_sections=transcript_sections)

@podcasts_blueprint.route("/<string:podcast_id>/")
def get_podcast(podcast_id):
    podcast = Podcast.get(id=podcast_id).convert_to_dict()
    return jsonify(success=True, podcast=podcast)