from flask import Blueprint, request, jsonify, g

from backend.search import utils
from backend.search.models import PodcastTranscriptionBlob
from backend.users.models import HistoryItem

search_blueprint = Blueprint('search', __name__, url_prefix="/api/search")

@search_blueprint.route("/departments/", methods=['GET'])
def search_departments():
    q = request.args.get("q")
    departments = utils.search_departments(department=q)
    return jsonify(success=True, results=departments)


@search_blueprint.route("/professors/", methods=['GET'])
def search_professors():
    q = request.args.get("q")
    professors = utils.search_professors(professor=q)
    return jsonify(success=True, results=professors)


@search_blueprint.route("/quarters/", methods=['GET'])
def search_quarters():
    q = request.args.get("q")
    quarters = utils.search_quarters(quarter=q)
    return jsonify(success=True, results=quarters)


@search_blueprint.route("/get_all_course_codes/", methods=['GET'])
def get_course_codes():
    course_codes = utils.get_all_course_codes()
    return jsonify(success=True, results=course_codes)

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
    course_num = request.args.get("course_num")
    professor = request.args.get("professor")
    quarter = request.args.get("quarter")
    section_id = request.args.get("section_id")

    relevant_transcription_blobs = PodcastTranscriptionBlob.search_podcasts(text_query=text_query,
                                                                            department=department,
                                                                            course_num=course_num,
                                                                            professor=professor, quarter=quarter,
                                                                            section_id=section_id, page=page,
                                                                            count=num_results)
    if g.current_user:
        # Add this search query to the user's history
        search_filters = {}

        if department:
            search_filters["dept"] = department
        if course_num:
            search_filters["course_num"] = course_num
        if professor:
            search_filters["professor"] = professor
        if quarter:
            search_filters["quarter"] = quarter
        if section_id:
            search_filters["section_id"] = section_id

        history_item = HistoryItem(type=HistoryItem.TYPE_SEARCH_QUERY, search_filters=search_filters,
                                   search_query=text_query)
        g.current_user.add_history_item(history_item)

    relevant_transcription_blobs = [blob.convert_to_dict() for blob in relevant_transcription_blobs]
    return jsonify(success=True, results=relevant_transcription_blobs)