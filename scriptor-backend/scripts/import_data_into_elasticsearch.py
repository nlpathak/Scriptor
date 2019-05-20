import json
import os

from backend.podcasts.models import Podcast
from backend.search.models import PodcastTranscriptionBlob

podcast_fixtures_folder = "./fixtures/podcasts"
transcriptions_folder = "./fixtures/transcriptions"


def import_podcast_transcription(course_name, course_number, quarter, section_id, department, professor,
                                 json_filepath):
    with open(json_filepath) as f:
        transcription_data = json.load(f)
        full_transcript = transcription_data['Full Transcript']
        blurbs = transcription_data['Blurbs']

        podcast_video_url = transcription_data.get("Video URL")
        podcast_audio_url = transcription_data.get("Audio URL")

    podcast = Podcast(title=course_name, department=department, course_num=course_number, quarter=quarter,
                      podcast_video_url=podcast_video_url, podcast_audio_url=podcast_audio_url,
                      professor=professor, section_id=section_id, full_transcript=full_transcript)

    podcast.save()

    for blurb, (start_time, end_time) in blurbs.items():
        start_time = int(start_time)
        end_time = int(end_time)

        podcast_transcription_blob = PodcastTranscriptionBlob(podcast_id=podcast.meta.id, transcription_blob=blurb,
                                                              starting_timestamp_second=start_time,
                                                              ending_timestamp_second=end_time, department=department,
                                                              course_number=course_number, quarter=quarter,
                                                              professor=professor, section_id=section_id)

        podcast_transcription_blob.save()


if __name__ == "__main__":

    # Import Miles Jones - CSE 101 - Winter 2019
    print("Importing CSE 101 - Miles Jones - Winter 2019...")

    for cse101_filepath in os.listdir(os.path.join(transcriptions_folder, "CSE 101 - Miles Jones - Winter 2019")):
        cse101_filepath = os.path.join(transcriptions_folder, "CSE 101 - Miles Jones - Winter 2019", cse101_filepath)
        import_podcast_transcription(course_name="Design & Analysis of Algorithm", course_number=101,
                                     quarter="Winter 2019", section_id="A00", department="CSE",
                                     professor="Jones, Miles E", json_filepath=cse101_filepath)

    print("Done.")
