import dask
import json
import requests
from bs4 import BeautifulSoup
from dask import delayed
from dask.diagnostics import ProgressBar
from slugify import slugify

ProgressBar().register()

podcasts_website_url = "https://podcast.ucsd.edu"

# Get a list of all podcast webpages for all current & past quarters
result = requests.get(podcasts_website_url)
content = result.content

soup = BeautifulSoup(content, features="html.parser")
quarter_soups = soup.find_all("div", "quarter")


def get_all_course_podcast_video_urls(course_video_podcast_webpage):
    if not course_video_podcast_webpage:
        return {}

    current_lecture = 1

    lecture_videos = {}

    while True:
        try:
            course_lecture_podcast_url = course_video_podcast_webpage + "&l=" + str(current_lecture)
            lecture_podcast_content = requests.get(course_lecture_podcast_url).content

            course_lecture_podcast_soup = BeautifulSoup(lecture_podcast_content, features="html.parser")

            if "No recordings found" in course_lecture_podcast_soup.get_text():
                # No more lectures, so stop here
                break

            video_url = course_lecture_podcast_soup.noscript.div.video.get("src")

            lecture_videos[current_lecture] = video_url
            current_lecture += 1
        except:
            # This course probably doesn't have video podcasts
            break

    return lecture_videos


def get_all_course_podcast_audio_urls(course_audio_podcast_webpage):
    if not course_audio_podcast_webpage:
        return {}

    current_lecture = 1

    lecture_audios = {}

    while True:
        try:
            course_lecture_podcast_url = course_audio_podcast_webpage + "&l=" + str(current_lecture)
            lecture_podcast_content = requests.get(course_lecture_podcast_url).content

            course_lecture_podcast_soup = BeautifulSoup(lecture_podcast_content, features="html.parser")

            if "No recordings found" in course_lecture_podcast_soup.get_text():
                # No more lectures, so stop here
                break

            audio_url = course_lecture_podcast_soup.noscript.div.audio.get("src")

            lecture_audios[current_lecture] = audio_url
            current_lecture += 1
        except:
            # This course probably doesn't have audio podcasts
            break

    return lecture_audios


def extract_section_id_from_course_name(course_name):
    if "[" in course_name.split(" ")[-1]:
        return course_name.split(" ")[-1].replace("[", "").replace("]", "").strip()
    return None


def extract_department_from_course_name(course_name):
    return course_name.split(" ")[0]


def extract_course_number_from_course_name(course_name):
    return course_name.split(" ")[1]


def extract_short_course_name_from_full_course_name(course_name):
    try:
        return course_name.split(" - ")[1]
    except:
        return course_name


podcast_records = []


def process_quarter_course_soup(quarter_course_soup, podcast_id):
    global podcast_records

    title_section = quarter_course_soup.find('td', "title")

    if title_section.find("div", "restriction"):
        # This class is restricted to either only students enrolled in the course or students on campus
        # So we ignore it.
        return

    course_name = title_section.a.text.strip()

    prof_section = quarter_course_soup.find("td", "prof")
    professor = prof_section.text.strip()

    # Some podcasts may only have audio and some may only have video
    podcast_links = {"video": None, "audio": None}

    links_section = quarter_course_soup.find("td", "links")
    for link_block in links_section.find_all('a'):
        if link_block.get("title") == "Audio":
            podcast_links["audio"] = link_block.get("href")
        else:
            podcast_links["video"] = link_block.get("href")

    podcast_record = {
        "quarter": quarter,
        "full_course_name": course_name,
        # Note that the full course name includes the department, section id, course num, etc.
        "section_id": extract_section_id_from_course_name(course_name),
        "department": extract_department_from_course_name(course_name),
        "course_number": extract_course_number_from_course_name(course_name),
        "professor": professor,
        "short_course_name": extract_short_course_name_from_full_course_name(course_name),
        "podcast_urls": {
            "video": get_all_course_podcast_video_urls(podcast_links["video"]),
            "audio": get_all_course_podcast_audio_urls(podcast_links['audio'])
        }
    }

    # Save podcast record
    with open(f"./fixtures/podcasts/{podcast_id}_{slugify(course_name)}.json", "w+") as f:
        f.write(json.dumps(podcast_record))


podcast_scraping_jobs = []

podcast_id = 0
for quarter_soup in quarter_soups:
    quarter = quarter_soup.h2.span.text.strip()

    quarter_content_soup = quarter_soup.div

    for quarter_course_soup in quarter_content_soup.table.find_all("tr"):
        podcast_scraping_jobs.append(delayed(process_quarter_course_soup)(quarter_course_soup, podcast_id))
        podcast_id += 1

# Scrape everything in batch
print("Starting batch web-scraping...")
_ = dask.compute(*podcast_scraping_jobs, scheduler="threads")
print("Done.")
