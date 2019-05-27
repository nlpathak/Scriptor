import os

import ffmpeg
import librosa
from tqdm import tqdm


def extract_lecture_num(filename):
    start_index = filename.index("lecture_") + len("lecture_")
    return int(filename.split(".")[0][start_index:])


UCSD_DISCLAIMER_OFFSET_SECS = 6


def get_starting_video_offset_secs(filename, threshold=10):
    y, sr = librosa.load(filename, duration=2 * 60)
    _, index = librosa.effects.trim(y, top_db=threshold)
    return index[0] // sr


def convert_to_mp3(filepath):
    _, ext = os.path.splitext(filepath)
    new_filepath = filepath.replace(ext, ".mp3")
    stream = ffmpeg.input(filepath)
    stream = ffmpeg.output(stream, new_filepath)
    ffmpeg.run(stream, quiet=True)
    return new_filepath


course_dirs = os.listdir("./fixtures/podcasts/")
for course_dir in tqdm(course_dirs):
    print("Processing: ", course_dir)
    course_dir = os.path.join("./fixtures", "podcasts", course_dir)
    for video_file in os.listdir(os.path.join(course_dir, "videos")):
        video_filepath = os.path.join(course_dir, "videos", video_file)
        lecture_num = extract_lecture_num(video_file)

        new_filepath = convert_to_mp3(video_filepath)
        offset = get_starting_video_offset_secs(new_filepath)

        os.remove(new_filepath)

        with open(os.path.join(course_dir, "transcriptions", "offset_lecture_%d.txt" % lecture_num), "w+") as f:
            f.write(str(offset))
