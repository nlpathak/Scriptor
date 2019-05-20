from elasticsearch_dsl import Document, Text, Date, Integer


class Podcast(Document):
    """
    This defines a Podcast model
    """

    # Podcast metadata
    title = Text()
    lecture_num = Integer()
    date = Date()
    ucsd_podcast_video_url = Text()
    ucsd_podcast_audio_url = Text()
    full_transcript = Text()

    # Some course metadata
    course_num = Text()
    department = Text()
    quarter = Text()
    professor = Text()
    section_id = Text()

    # Elasticsearch index settings
    class Index:
        name = "podcasts"