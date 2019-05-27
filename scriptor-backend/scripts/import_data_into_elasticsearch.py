import datetime
import json
import os

from tqdm import tqdm

from backend.app import init_db
from backend.podcasts.models import Podcast
from backend.search.models import PodcastTranscriptionBlob

UCSD_DISCLAIMER_OFFSET_SECS = 6

podcast_fixtures_folder = "./fixtures/podcasts"


def extract_lecture_num(filename):
    start_index = filename.index("lecture_") + len("lecture_")
    return int(filename.split(".")[0][start_index:])


def extract_podcast_metadata_by_lecture_num(metadata, lecture_num):
    for course_podcast_metadata in metadata["course_podcasts"]:
        if course_podcast_metadata["lecture_num"] == lecture_num:
            return course_podcast_metadata
    raise ValueError(f"Could not extract podcast metadata for lecture #{lecture_num}.")


def import_podcast_transcription_file(podcast_metadata, transcription_data, video_silence_offset_secs=0):
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
                                                              starting_timestamp_second=start_time - UCSD_DISCLAIMER_OFFSET_SECS + video_silence_offset_secs,
                                                              ending_timestamp_second=end_time - UCSD_DISCLAIMER_OFFSET_SECS + video_silence_offset_secs,
                                                              blob_index=blurb_index,
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

        transcriptions_folder = os.path.join(podcast_fixtures_folder, course_podcast_folder, "transcriptions")

        for transcription_file in tqdm(
                sorted(os.listdir(transcriptions_folder))):

            if "offset_lecture_" in transcription_file:
                continue

            transcription_data = json.load(open(
                os.path.join(transcriptions_folder, transcription_file)))

            lecture_num = extract_lecture_num(transcription_data["File Name"])

            try:
                with open(os.path.join(transcriptions_folder, f"offset_lecture_{lecture_num}.txt")) as f:
                    video_silence_offset_secs = int(f.read().replace("\n", "").strip())
            except:
                print(f"no offset for: {course_podcast_folder}, # {lecture_num}")
                video_silence_offset_secs = 0

            podcast_metadata = extract_podcast_metadata_by_lecture_num(metadata=metadata, lecture_num=lecture_num)
            import_podcast_transcription_file(
                podcast_metadata=podcast_metadata, transcription_data=transcription_data,
                video_silence_offset_secs=video_silence_offset_secs)

        print("Done.\n")