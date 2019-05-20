from flask import Blueprint, request, jsonify, g

from backend.search.models import PodcastTranscriptionBlob
from backend.users.models import HistoryItem

search_blueprint = Blueprint('search', __name__, url_prefix="/api/search")


@search_blueprint.route("/departments/", methods=['GET'])
def search_departments():
    # TODO:
    pass


@search_blueprint.route("/courses/", methods=['GET'])
def search_courses():
    # TODO:
    pass


@search_blueprint.route("/professor/", methods=['GET'])
def search_professors():
    # TODO:
    pass


@search_blueprint.route("/podcasts/", methods=['GET'])
def search_podcasts():
    text_query = request.args.get("q")
    page = int(request.args.get("page", 1))
    num_results = int(request.args.get("count", 10))

    if not text_query:
        return jsonify(success=False, error="Please provide a search query."), 400

    text_query = text_query.strip()

    # Extract any filters that were supplied
    department = request.args.get("dept")
    course_number = request.args.get("course_num")
    professor = request.args.get("professor")
    quarter = request.args.get("quarter")
    section_id = request.args.get("section_id")

    relevant_transcription_blobs = PodcastTranscriptionBlob.search_podcasts(text_query=text_query,
                                                                            department=department,
                                                                            course_number=course_number,
                                                                            professor=professor, quarter=quarter,
                                                                            section_id=section_id, page=page,
                                                                            count=num_results)
    if g.current_user:
        # Add this search query to the user's history
        search_filters = {}

        if department:
            search_filters["dept"] = department
        if course_number:
            search_filters["course_num"] = course_number
        if professor:
            search_filters["professor"] = professor
        if quarter:
            search_filters["quarter"] = quarter
        if section_id:
            search_filters["section_id"] = section_id

        history_item = HistoryItem(type=HistoryItem.TYPE_SEARCH_QUERY, search_filters=search_filters,
                                   search_query=text_query)
        g.current_user.add_history_item(history_item)

    relevant_transcription_blobs = [blob.to_dict() for blob in relevant_transcription_blobs]
    return jsonify(success=True, results=relevant_transcription_blobs)