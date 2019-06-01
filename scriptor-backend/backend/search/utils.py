from elasticsearch_dsl import A

from backend.podcasts.models import Podcast


def search_departments(department=None):
    if department:
        # Return autcomplete results
        department = department.strip()
        results = set()
        suggestions = Podcast.search().suggest("department_suggestions", department, completion={
            "field": "completion_field_department"}).execute().suggest.department_suggestions[0].options

        for suggestion in suggestions:
            results.add(suggestion._source.department)

        results = list(results)
        return results
    else:
        search = Podcast.search()
        agg = A('terms', field="exact_value_department")
        search.aggs.bucket("all_departments", agg)
        results = search.execute()
        return [result.key for result in results.aggregations.all_departments.buckets]


def get_all_course_codes():
    course_codes = []
    course_num_agg = A('terms', field="course_num")
    dept_agg = A('terms', field="exact_value_department")
    search = Podcast.search()
    search.aggs.bucket("all_departments", dept_agg).bucket("all_course_nums", course_num_agg)
    results = search.source(["department", "course_num"]).execute()
    for dept_bucket in results.aggregations.all_departments.buckets:
        dept = dept_bucket.key
        for course_num_bucket in dept_bucket.all_course_nums.buckets:
            course_num = course_num_bucket.key
            course_codes.append(f"{dept} {course_num}")
    return course_codes


def search_professors(professor=None):
    if professor:
        # Return autcomplete results
        professor = professor.strip()
        results = set()
        suggestions = Podcast.search().suggest("professor_suggestions", professor, completion={
            "field": "completion_field_professor"}).execute().suggest.professor_suggestions[0].options

        for suggestion in suggestions:
            results.add(suggestion._source.professor)

        results = list(results)
        return results
    else:
        search = Podcast.search()
        agg = A('terms', field="exact_value_professor")
        search.aggs.bucket("all_professors", agg)
        results = search.source(["professor"]).execute()
        return [result.key for result in results.aggregations.all_professors.buckets]


def search_quarters(quarter=None):
    if quarter:
        # Return autcomplete results
        quarter = quarter.strip()
        results = set()
        suggestions = Podcast.search().suggest("quarter_suggestions", quarter, completion={
            "field": "completion_field_quarter"}).execute().suggest.quarter_suggestions[0].options

        for suggestion in suggestions:
            results.add(suggestion._source.quarter)

        results = list(results)
        return results
    else:
        search = Podcast.search()
        agg = A('terms', field="exact_value_quarter")
        search.aggs.bucket("all_quarters", agg)
        results = search.source(["quarter"]).execute()
        return [result.key for result in results.aggregations.all_quarters.buckets]
