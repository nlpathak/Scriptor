from elasticsearch_dsl import Document, Text, Date, Integer, Keyword


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
    department = Text()
    course_num = Text()
    quarter = Text()
    professor = Text()
    section_id = Text()

    # Some of the same fields as above, but indexed for searching through them
    # These will not be set directly, and will only be used when searching through the filters themselves
    exact_value_department = Keyword()
    exact_value_quarter = Keyword()
    exact_value_professor = Keyword()

    # Elasticsearch index settings
    class Index:
        name = "podcasts"

    def save(self, **kwargs):
        self.exact_value_department = self.department
        self.exact_value_quarter = self.quarter
        self.exact_value_professor = self.professor
        return super().save(**kwargs)
