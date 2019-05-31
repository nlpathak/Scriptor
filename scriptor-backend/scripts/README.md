# Scripts quickstart

## Pre-requisites
1. `pip install pipenv` (to install pipenv)
2. `cd scriptor-backend && pipenv install`
3. `pipenv shell` (to enter the virtualenv for the backend)


### import_data_into_elasticsearch.py
Run this script when running the backend for the very first time. It will import the transcription data for the podcast transcription files generated in the `fixtures` folder.
1. `cd scriptor-backend`
2. `docker-compose up`
3. `pipenv shell`
4. `PYTHONPATH=. python scripts/import_data_into_elasticsearch.py`
5. `python app.py`

And when you're done, run `docker-compose down` if you want to save the database data. 
If you want to clear the saved database, run `docker-compose down -v` instead.

### download_podcast_data.py
This interactive script downloads the audio files & metadata of the podcasts for any given course.

1. `cd scriptor-backend`
2. `PYTHONPATH=. python scripts/download_podcast_data.py`

Now, to select the course to download podcasts for:
1. Go to <a href="https://podcast.ucsd.edu/" target="_blank">https://podcast.ucsd.edu</a>
2. Search/filter for the course you want
3. Click on the course podcast website link
4. Copy the URL on the browser and use it as input when the script prompts for the `course podcast website URL: `

Since the course name, section id, department, and course number formatting vary across different courses, the script will prompt you to enter these details.
Once you've entered this info, the script will compile the metadata for the podcasts and download all of the podcast audio files to the `fixtures/podcasts/<the selected course goes here>/audios/` folder.
The script will also generate a `metadata.json` file at `fixtures/podcasts/<the selected course goes here>/metadata.json` to save the various metadata associated with each podcast recording.

After the files have been downloaded, the script will re-prompt you for any additional courses that you'd like to also download audio files for.

Once done, press `Ctrl+C` to exit.

Next, you can run SpeechToText.py on the downloaded files (doing any necessary audio conversions, etc.), and include the analyzed file name (e.g. `lecture_1.mp3`) in the resulting transcription JSON files.
Make sure to save the resulting transcription files to the `fixtures/podcasts/<the selected course goes here>/transcripts` folder.

After the transcription files have been generated, delete the `fixtures/podcasts/<the selected course goes here>/audios/` directory, but do NOT delete the `fixtures/podcasts/<the selected course goes here>/transcripts` directory & the `fixtures/podcasts/<the selected course goes here>/metadata.json` file.

Finally, add & commit to GitHub! 🎉

### SpeechToText.py
This script takes in a directory of .mp3 files and produces transcription JSONs for each audio file.

1. [Install and initialize Google Cloud SDK](https://cloud.google.com/sdk/docs/)
2. `export GOOGLE_APPLICATION_CREDENTIALS="/PATH/TO/JSON/CREDENTIALS"` in your current session
3. `sudo apt-get install sox` or whatever is applicable for your system 
4. `sudo apt-get libsox-fmt-all` or whatever is applicable for your system 
5. `cd scriptor-backend/scripts`
6. `python SpeechToText.py ./PATH/TO/AUDIO/FILES`
