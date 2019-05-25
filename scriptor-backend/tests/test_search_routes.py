import time

import pytest

from backend.app import app
from backend.podcasts.models import Podcast
from backend.search.models import PodcastTranscriptionBlob


@pytest.fixture
def client():
    app.config['TESTING'] = True
    client = app.test_client()
    yield client


@pytest.fixture
def test_podcasts():
    # Generate and return n sample podcasts.
    test_podcasts = [Podcast(title="podcast 1", full_transcript="Lorem ipsum", department="CSE", quarter="Winter 2019",
                             professor="Professor A"),
                     Podcast(title="podcast 2", full_transcript="Lorem ipsum", department="CSE", quarter="Winter 2019",
                             professor="Professor A"),
                     Podcast(title="podcast 3", full_transcript="Lorem ipsum", department="ECE", quarter="Winter 2000",
                             professor="Professor B")]

    test_podcast_transcription_blobs = []

    for podcast in test_podcasts:
        podcast.save()

        test_blobs = [
            PodcastTranscriptionBlob(podcast_id=podcast.meta.id, transcription_blob="lorem ipsum " + str(time.time()),
                                     department=podcast.department),
            PodcastTranscriptionBlob(podcast_id=podcast.meta.id,
                                     transcription_blob="lorem ipsum " + str(time.time() + 10),
                                     department=podcast.department),
            PodcastTranscriptionBlob(podcast_id=podcast.meta.id,
                                     transcription_blob="lorem ipsum " + str(time.time() + 100),
                                     department=podcast.department)
        ]

        for blob in test_blobs:
            blob.save()

        test_podcast_transcription_blobs.extend(test_blobs)

    time.sleep(1)

    yield test_podcasts, test_podcast_transcription_blobs

    # After the test podcasts have been used, delete them
    for podcast in test_podcasts:
        podcast.delete()

    for blob in test_podcast_transcription_blobs:
        blob.delete()


def test_aux_search_departments(client, test_podcasts):
    response = client.get(f"/api/search/departments/", query_string={"q": "CSE"})
    res = response.get_json()

    assert 200 == response.status_code
    assert res['success']
    assert len(res['results']) > 0

    response = client.get(f"/api/search/departments/", query_string={"q": "ECE"})
    res = response.get_json()

    assert 200 == response.status_code
    assert res['success']
    assert len(res['results']) > 0

    response = client.get(f"/api/search/departments/", query_string={"q": "asdfa"})
    res = response.get_json()

    assert 200 == response.status_code
    assert res['success']
    assert res['results'] == []


def test_aux_search_professors(client, test_podcasts):
    response = client.get(f"/api/search/professors/", query_string={"q": "Professor A"})
    res = response.get_json()

    assert 200 == response.status_code
    assert res['success']
    assert len(res['results']) > 0

    response = client.get(f"/api/search/professors/", query_string={"q": "Professor B"})
    res = response.get_json()

    assert 200 == response.status_code
    assert res['success']
    assert len(res['results']) > 0

    response = client.get(f"/api/search/professors/", query_string={"q": "dsfdasd"})
    res = response.get_json()

    assert 200 == response.status_code
    assert res['success']
    assert res['results'] == []


def test_aux_search_quarters(client, test_podcasts):
    response = client.get(f"/api/search/quarters/", query_string={"q": "Winter 2019"})
    res = response.get_json()

    assert 200 == response.status_code
    assert res['success']
    assert len(res['results']) > 0

    response = client.get(f"/api/search/quarters/", query_string={"q": "Winter 2000"})
    res = response.get_json()

    assert 200 == response.status_code
    assert res['success']
    assert len(res['results']) > 0

    response = client.get(f"/api/search/quarters/", query_string={"q": "Winter 20"})
    res = response.get_json()

    assert 200 == response.status_code
    assert res['success']
    assert len(res['results']) > 0

    response = client.get(f"/api/search/quarters/", query_string={"q": "asdkfjhej"})
    res = response.get_json()

    assert 200 == response.status_code
    assert res['success']
    assert res['results'] == []


def test_general_search_podcasts(client, test_podcasts):
    # Try some relevant queries
    response = client.get(f"/api/search/podcasts/", query_string={"q": "lorem ipsum"})
    res = response.get_json()

    assert 200 == response.status_code
    assert res['success']
    assert len(res['results']) > 0

    # Try some irrelevant queries
    response = client.get(f"/api/search/podcasts/", query_string={"q": "sdasfdwsawds"})
    res = response.get_json()

    assert 200 == response.status_code
    assert res['success']
    assert 0 == len(res['results'])
