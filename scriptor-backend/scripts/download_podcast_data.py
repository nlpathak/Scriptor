import datetime
import json
import os
import urllib.request

import furl
import requests
from bs4 import BeautifulSoup
from tqdm import tqdm

PODCAST_AUDIO_VERSION = 0
PODCAST_VIDEO_VERSION = 1


class InvalidPodcastError(Exception):
    pass


class NoPodcastAudioError(Exception):
    pass


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
        video_url = ""

    return {
        "lecture_num": lecture_num,
        "date": date.strftime('%m/%d/%Y'),
        "audio_url": audio_url,
        "video_url": video_url,
        "professor": professor,
        "quarter": quarter
    }


def download_podcast_data(course_podcast_website_url, course_name, department, course_num, section_id):
    f = furl.furl(course_podcast_website_url)
    f.remove(['l', 'v'])
    course_podcast_website_url = f.url

    podcast_course_metadata = {
        "course_name": course_name,
        "department": department,
        "course_num": course_num,
        "section_id": section_id
    }

    course_podcasts = []

    current_podcast_num = 0

    print("Scraping podcast metadata...")

    while True:
        current_podcast_num += 1
        try:
            podcast_data = extract_podcast_data(current_podcast_num, course_podcast_website_url)
            podcast_data.update(podcast_course_metadata)
            course_podcasts.append(podcast_data)
        except NoPodcastAudioError:
            # This podcast has no audio, so skip to the next one
            continue
        except InvalidPodcastError:
            # We've reached the end of the list of podcasts for this course
            break

    if not course_podcasts:
        print("No podcasts found.")
        return

    professor = course_podcasts[0]['professor']
    quarter = course_podcasts[0]['quarter']

    # Download audio files for this list of course podcasts
    course_podcast_dir = os.path.join("./fixtures", "podcasts",
                                      f"{course_name} - {section_id} - {professor} - {quarter}")
    os.makedirs(course_podcast_dir)

    course_podcast_audio_dir = os.path.join(course_podcast_dir, "audios")
    os.makedirs(course_podcast_audio_dir)

    print(f"Downloading podcast audio files to {course_podcast_audio_dir}...")
    for course_podcast in tqdm(course_podcasts):
        audio_file_url = course_podcast["audio_url"]
        lecture_num = course_podcast["lecture_num"]

        audio_filepath = os.path.join(course_podcast_dir, "audios", f"lecture_{lecture_num}.mp3")
        urllib.request.urlretrieve(audio_file_url, audio_filepath)

    # Compile the list of course podcast metadata into a json file
    course_podcast_metadata_json_filepath = os.path.join(course_podcast_dir, "metadata.json")
    course_podcast_metadata = {
        "course_podcasts": course_podcasts,
        "num_podcasts": len(course_podcasts)
    }

    json.dump(course_podcast_metadata, open(course_podcast_metadata_json_filepath, "w+"), indent=4)
    print(f"Saved metadata file to {course_podcast_metadata_json_filepath}.")


if __name__ == "__main__":
    while True:
        course_podcast_website_url = input("course podcast website URL: ").strip()
        course_name = input("course name: ").strip()
        department = input("department (e.g. CSE, MAE, etc.): ").strip()
        course_num = int(input("course num: ").strip())
        section_id = input("section id: ").strip()

        print("\n")

        download_podcast_data(course_podcast_website_url, course_name, department, course_num, section_id)

        print("\n\n")
