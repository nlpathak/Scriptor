from backend.podcasts.models import Podcast


def search_departments(department):
    department = department.strip()
    results = Podcast.search().query("match", department=department).extra(
        collapse={"field": "exact_value_department"}).source(["department"]).execute()
    return [result.department for result in results]


def search_professors(professor):
    professor = professor.strip()
    results = Podcast.search().query("match", professor=professor).extra(
        collapse={"field": "exact_value_professor"}).source(
        ["professor"]).execute()
    return [result.professor for result in results]


def search_quarters(quarter):
    quarter = quarter.strip()
    results = Podcast.search().query("match", quarter=quarter).extra(collapse={"field": "exact_value_quarter"}).source(
        ["quarter"]).execute()
    return [result.quarter for result in results]
