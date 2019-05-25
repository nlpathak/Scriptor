import datetime
import json
import os

from tqdm import tqdm

from backend.app import init_db
from backend.podcasts.models import Podcast
from backend.search.models import PodcastTranscriptionBlob

podcast_fixtures_folder = "./fixtures/podcasts"

def extract_lecture_num(filename):
    start_index = filename.index("lecture_") + len("lecture_")
    return int(filename.split(".")[0][start_index:])


def extract_podcast_metadata_by_lecture_num(metadata, lecture_num):
    for course_podcast_metadata in metadata["course_podcasts"]:
        if course_podcast_metadata["lecture_num"] == lecture_num:
            return course_podcast_metadata
    raise ValueError(f"Could not extract podcast metadata for lecture #{lecture_num}.")


def import_podcast_transcription_file(podcast_metadata, transcription_data):
    full_transcript = transcription_data['Full Transcript']
    lecture_num = extract_lecture_num(transcription_data['File Name'])
    blurbs = transcription_data['Blurbs']

    podcast_video_url = podcast_metadata.get("video_url")
    podcast_audio_url = podcast_metadata.get("audio_url")
    date = datetime.datetime.strptime(podcast_metadata.get("date"), '%m/%d/%Y')

    podcast = Podcast(title=podcast_metadata['course_name'], lecture_num=lecture_num, date=date,
                      department=podcast_metadata['department'],
                      course_num=str(podcast_metadata['course_num']),
                      quarter=podcast_metadata['quarter'],
                      ucsd_podcast_video_url=podcast_video_url, ucsd_podcast_audio_url=podcast_audio_url,
                      professor=podcast_metadata['professor'], section_id=podcast_metadata['section_id'],
                      full_transcript=full_transcript)
    podcast.save()

    for blurb, (start_time, end_time, blurb_index) in blurbs.items():
        start_time = int(start_time)
        end_time = int(end_time)

        podcast_transcription_blob = PodcastTranscriptionBlob(podcast_id=podcast.meta.id, transcription_blob=blurb,
                                                              starting_timestamp_second=start_time,
                                                              ending_timestamp_second=end_time, blob_index=blurb_index,
                                                              lecture_num=lecture_num,
                                                              department=podcast_metadata['department'],
                                                              course_num=str(podcast_metadata['course_num']),
                                                              quarter=podcast_metadata['quarter'],
                                                              professor=podcast_metadata['professor'],
                                                              section_id=podcast_metadata['section_id'], date=date)
        podcast_transcription_blob.save()


if __name__ == "__main__":

    init_db()

    print("Clearing all existing podcast data...")
    Podcast.search().query("match_all").delete()
    PodcastTranscriptionBlob.search().query("match_all").delete()
    print("Done.\n")

    for course_podcast_folder in os.listdir(podcast_fixtures_folder):
        print(f"Importing podcasts for {course_podcast_folder}...")
        metadata = json.load(open(os.path.join(podcast_fixtures_folder, course_podcast_folder, "metadata.json")))

        for transcription_file in tqdm(
                sorted(os.listdir(os.path.join(podcast_fixtures_folder, course_podcast_folder, "transcriptions")))):
            transcription_data = json.load(open(
                os.path.join(podcast_fixtures_folder, course_podcast_folder, "transcriptions", transcription_file)))
            lecture_num = extract_lecture_num(transcription_data["File Name"])
            podcast_metadata = extract_podcast_metadata_by_lecture_num(metadata=metadata, lecture_num=lecture_num)

            import_podcast_transcription_file(podcast_metadata=podcast_metadata, transcription_data=transcription_data)

        print("Done.\n")
