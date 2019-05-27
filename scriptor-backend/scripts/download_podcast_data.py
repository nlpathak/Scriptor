import datetime
import json
import os
import urllib.request

import dask
import ffmpeg
import furl
import requests
from bs4 import BeautifulSoup
from dask import delayed
from dask.diagnostics import ProgressBar
from tqdm import tqdm

from scripts.utils import make_directory_safe_foldername

PODCAST_AUDIO_VERSION = 0
PODCAST_VIDEO_VERSION = 1

ProgressBar().register()

class InvalidPodcastError(Exception):
    pass

class NoPodcastAudioError(Exception):
    pass


class NoPodcastVideoError(Exception):
    pass

def get_lecture_numbers(course_podcast_website):
    lecture_nums = []

    result = requests.get(course_podcast_website, params={"v": PODCAST_AUDIO_VERSION})
    content = result.content

    soup = BeautifulSoup(content, features="html.parser")
    for lecture_div in soup.find_all("div", class_="lecture"):
        lecture_num = furl.furl(lecture_div.a.get("href")).args.get("l", None)
        if lecture_num is not None:
            lecture_nums.append(int(lecture_num))

    return lecture_nums


def convert_video_to_audio(video_filepath, video_audio_filepath):
    stream = ffmpeg.input(video_filepath)
    stream = ffmpeg.output(stream, video_audio_filepath)
    ffmpeg.run(stream, quiet=True)

def extract_podcast_data(podcast_num, course_podcast_url):
    result = requests.get(course_podcast_url, params={"l": podcast_num, "v": PODCAST_AUDIO_VERSION})
    content = result.content

    soup = BeautifulSoup(content, features="html.parser")

    if "No recordings found" in soup.text:
        raise InvalidPodcastError()

    professor = soup.find("span", id="author_Label").text.strip()
    quarter = soup.find("span", id="quarter_Label").text.strip()

    lecture_header = soup.find("div", id="LectureHeader").h2.text.strip()

    lecture_num = podcast_num  # int(lecture_header[len("Lecture "):lecture_header.index(",")].strip())
    date = lecture_header[lecture_header.index(",") + 1:].strip()

    date = datetime.datetime.strptime(date, '%m/%d/%Y')

    try:
        audio_url = soup.noscript.div.audio.get("src")
        if not audio_url:
            raise NoPodcastAudioError()
    except:
        raise NoPodcastAudioError()

    # Extract the video URL
    result = requests.get(course_podcast_url, params={"l": podcast_num, "v": PODCAST_VIDEO_VERSION})
    content = result.content
    soup = BeautifulSoup(content, features="html.parser")

    try:
        video_url = soup.noscript.div.video.get("src") or ""
    except:
        raise NoPodcastVideoError()

    return {
        "lecture_num": lecture_num,
        "date": date.strftime('%m/%d/%Y'),
        "audio_url": audio_url,
        "video_url": video_url,
        "professor": professor,
        "quarter": quarter
    }


def download_podcast_data(course_podcast_website_url, course_name, department, course_num, section_id,
                          download_file_type="va"):
    f = furl.furl(course_podcast_website_url)
    f.remove(['l', 'v'])

    course_podcast_website_url = f.url
    lecture_nums = get_lecture_numbers(course_podcast_website_url)

    podcast_course_metadata = {
        "course_name": course_name,
        "department": department,
        "course_num": course_num,
        "section_id": section_id
    }

    print("Scraping podcast metadata...")

    def get_podcast_data_by_lecture_num(podcast_lecture_num, podcast_course_metadata):
        try:
            podcast_data = extract_podcast_data(podcast_lecture_num, course_podcast_website_url)
            podcast_data.update(podcast_course_metadata)
            return podcast_data
        except NoPodcastAudioError:
            # This podcast has no audio, so skip to the next one
            return None
        except NoPodcastVideoError:
            # This podcast has no video, so skip to the next one
            return None

    course_podcasts = dask.compute(
        *[delayed(get_podcast_data_by_lecture_num)(lecture_num, podcast_course_metadata) for lecture_num in
          lecture_nums], scheduler="threads")
    course_podcasts = [cp for cp in course_podcasts if cp != None]

    # for podcast_lecture_num in lecture_nums:
    #     try:
    #         podcast_data = extract_podcast_data(podcast_lecture_num, course_podcast_website_url)
    #         podcast_data.update(podcast_course_metadata)
    #         course_podcasts.append(podcast_data)
    #     except NoPodcastAudioError:
    #         # This podcast has no audio, so skip to the next one
    #         continue
    #     except NoPodcastVideoError:
    #         # This podcast has no video, so skip to the next one
    #         continue

    if not course_podcasts:
        print("No podcasts found.")
        return

    professor = course_podcasts[0]['professor']
    quarter = course_podcasts[0]['quarter']

    # Download audio files for this list of course podcasts
    course_podcast_dir = os.path.join("./fixtures", "podcasts",
                                      make_directory_safe_foldername(
                                          f"{course_name} - {section_id} - {professor} - {quarter}"))

    if not os.path.exists(course_podcast_dir):
        print("Creating course directory...")
        os.makedirs(course_podcast_dir)
    else:
        print("Course directory already exists.")

    if download_file_type.lower() == "a":
        course_podcast_audio_dir = os.path.join(course_podcast_dir, "audios")
        if not os.path.exists(course_podcast_audio_dir):
            print("Creating audios subdirectory...")
            os.makedirs(course_podcast_audio_dir)

        print(f"Downloading podcast audio files to {course_podcast_audio_dir}...")
        for course_podcast in tqdm(course_podcasts):
            audio_file_url = course_podcast["audio_url"]
            lecture_num = course_podcast["lecture_num"]

            audio_filepath = os.path.join(course_podcast_dir, "audios", f"lecture_{lecture_num}.mp3")
            urllib.request.urlretrieve(audio_file_url, audio_filepath)

    elif download_file_type.lower() == "v":
        course_podcast_vids_dir = os.path.join(course_podcast_dir, "videos")
        if not os.path.exists(course_podcast_vids_dir):
            print("Creating vids subdirectory...")
            os.makedirs(course_podcast_vids_dir)

        print(f"Downloading podcast video files to {course_podcast_vids_dir}...")
        for course_podcast in tqdm(course_podcasts):
            if course_podcast["video_url"]:
                video_file_url = course_podcast["video_url"]
                lecture_num = course_podcast["lecture_num"]

                video_filepath = os.path.join(course_podcast_dir, "videos", f"lecture_{lecture_num}.mp4")
                urllib.request.urlretrieve(video_file_url, video_filepath)
    else:
        course_podcast_video_audios_dir = os.path.join(course_podcast_dir, "video_audios")
        if not os.path.exists(course_podcast_video_audios_dir):
            print("Creating video_audios subdirectory...")
            os.makedirs(course_podcast_video_audios_dir)

        print(f"Downloading & converting podcast video-audio files to {course_podcast_video_audios_dir}...")

        def download_job(course_podcast):
            video_file_url = course_podcast["video_url"]
            lecture_num = course_podcast["lecture_num"]

            video_filepath = os.path.join(course_podcast_video_audios_dir, f"lecture_{lecture_num}.mp4")
            urllib.request.urlretrieve(video_file_url, video_filepath)

            video_audio_filepath = video_filepath.replace(".mp4", ".mp3")

            # Now, convert the videos to audio
            convert_video_to_audio(video_filepath=video_filepath, video_audio_filepath=video_audio_filepath)

            # Delete the video file
            os.remove(video_filepath)

        _ = dask.compute(*[delayed(download_job)(course_podcast) for course_podcast in course_podcasts],
                         scheduler="processes")

    # Compile the list of course podcast metadata into a json file
    course_podcast_metadata_json_filepath = os.path.join(course_podcast_dir, "metadata.json")
    course_podcast_metadata = {
        "course_podcasts": course_podcasts,
        "num_podcasts": len(course_podcasts),
        "podcast_course_metadata": podcast_course_metadata
    }

    if not os.path.exists(course_podcast_metadata_json_filepath):
        json.dump(course_podcast_metadata, open(course_podcast_metadata_json_filepath, "w+"), indent=4)
        print(f"Saved metadata file to {course_podcast_metadata_json_filepath}.")
    else:
        print("Metadata file already exists.")


if __name__ == "__main__":
    while True:
        course_podcast_website_url = input("course podcast website URL: ").strip()
        course_name = input("course name: ").strip()
        department = input("department (e.g. CSE, MAE, etc.): ").strip()
        course_num = input("course num: ").strip()
        section_id = input("section id: ").strip()
        download_file_type = input("download audio (a), video (v), or video-audio (va) - (default)? ")

        print("\n")

        download_podcast_data(course_podcast_website_url, course_name, department, course_num, section_id,
                              download_file_type)

        print("\n\n")