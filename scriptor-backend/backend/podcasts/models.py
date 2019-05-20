from elasticsearch_dsl import Document, Text, Date


class Podcast(Document):
    """
    This defines a Podcast model
    """
    title = Text()

    # Some metadata
    department = Text()
    course_num = Text()
    quarter = Text()
    professor = Text()
    section_id = Text()

    date = Date()

    ucsd_podcast_video_url = Text()
    ucsd_podcast_audio_url = Text()

    full_transcript = Text()

    # Elasticsearch index settings
    class Index:
        name = "podcasts"
