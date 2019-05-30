from elasticsearch_dsl import A

from backend.podcasts.models import Podcast


def search_departments(department=None):
    if department:
        department = department.strip()
        results = Podcast.search().query("match", department=department).extra(
            collapse={"field": "exact_value_department"}).source(["department"]).execute()
        return [result.department for result in results]
    else:
        search = Podcast.search()
        agg = A('terms', field="exact_value_department")
        search.aggs.bucket("all_departments", agg)
        results = search.execute()
        return [result.key for result in results.aggregations.all_departments.buckets]


def search_professors(professor=None):
    if professor:
        professor = professor.strip()
        results = Podcast.search().query("match", professor=professor).extra(
            collapse={"field": "exact_value_professor"}).source(
            ["professor"]).execute()
        return [result.professor for result in results]
    else:
        search = Podcast.search()
        agg = A('terms', field="exact_value_professor")
        search.aggs.bucket("all_professors", agg)
        results = search.source(["professor"]).execute()
        return [result.key for result in results.aggregations.all_professors.buckets]


def search_quarters(quarter=None):
    if quarter:
        quarter = quarter.strip()
        results = Podcast.search().query("match", quarter=quarter).extra(
            collapse={"field": "exact_value_quarter"}).source(
            ["quarter"]).execute()
        return [result.quarter for result in results]
    else:
        search = Podcast.search()
        agg = A('terms', field="exact_value_quarter")
        search.aggs.bucket("all_quarters", agg)
        results = search.source(["quarter"]).execute()
        return [result.key for result in results.aggregations.all_quarters.buckets]
