from elasticsearch_dsl import Document, Text, Integer, Q, Date

from backend.podcasts.models import Podcast


class PodcastTranscriptionBlob(Document):
    """
    This defines a PodcastTranscriptionBlob model.

    This represents the groups of 3-5 sentences for each podcast's full transcription text,
    that we use to search through podcasts
    """
    podcast_id = Text()
    transcription_blob = Text()
    starting_timestamp_second = Integer()  # The starting timestamp for this blob (in seconds since the start of the podcast's video)
    ending_timestamp_second = Integer()
    blob_index = Integer()
    lecture_num = Integer()

    # Filters that the user can search against
    department = Text()
    course_num = Integer()
    quarter = Text()
    professor = Text()
    section_id = Text()

    date = Date()

    # Elasticsearch index settings
    class Index:
        name = "podcast_transription_blobs"

    @property
    def podcast(self):
        return Podcast.get(id=self.podcast_id)

    @staticmethod
    def search_podcasts(text_query, department=None, course_number=None, professor=None, quarter=None, section_id=None,
                        page=1, count=10):
        search_criteria = [Q('match', transcription_blob=text_query), ]

        if department:
            search_criteria.append(Q('match', department=department))

        if course_number:
            search_criteria.append(Q('match', course_number=course_number))

        if professor:
            search_criteria.append(Q('match', professor=professor))

        if quarter:
            search_criteria.append(Q('match', quarter=quarter))

        if section_id:
            search_criteria.append(Q('match', section_id=section_id))

        search_query = Q('bool', must=search_criteria)

        # TODO: Should we automatically sort the results by the date & starting_timestamp_second fields?
        # Because the professor might first introduce a topic in 1 lecture, and then refer to it in subsequent lectures.
        podcast_transcription_query = PodcastTranscriptionBlob.search().highlight("transcription_blob").query(
            search_query)

        # Slice the search query for the requested page & count
        podcast_transcription_query = podcast_transcription_query[(page - 1) * count: ((page - 1) * count) + count]

        relevant_transcription_blobs = podcast_transcription_query.execute()

        return relevant_transcription_blobs[:count]
