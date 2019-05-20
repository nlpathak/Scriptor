import json
import os

# Replace this path with the folder containing the old transcription files
transcriptions_folder = "./fixtures/podcasts/Linear Algebra - B00 - Kemp, Todd Aahron - Winter 2018/transcriptions"

for idx, transcription_file in enumerate(sorted(os.listdir(transcriptions_folder))):

    lecture_num = idx + 1
    filename = f"lecture_{lecture_num}.flac"

    record = json.load(open(os.path.join(transcriptions_folder, transcription_file)))
    record['File Name'] = filename

    full_transcript = record["Full Transcript"]
    full_transcript_modified = full_transcript.replace("  ", " ")

    blurb_x_idx = {}

    for blurb in record["Blurbs"]:
        substr = blurb.strip()
        blurb_x_idx[blurb] = full_transcript_modified.index(substr)

    blurbs_ordered = sorted(blurb_x_idx.items(), key=lambda item: item[1])

    i = 0
    for blurb, idx in blurbs_ordered:
        record["Blurbs"][blurb] += [i, ]
        i += 1

    json.dump(record, open(os.path.join(transcriptions_folder, transcription_file), "w+"), indent=4)
