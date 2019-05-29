##
# Takes in directory of .mp3 files and produces a JSONS directory in the given directory which contains all the necessary
# information such as podcast metadata, textblurb-to-time mapping, and full transcript for each mp3 file
#
# Remember to set "GOOGLE_APPLICATION_CREDENTIALS" in current session. 
# <export GOOGLE_APPLICATION_CREDENTIALS="/home/nikhilpathak/CSE110/Scriptor-c224a4acbb7a.json">
# <export GOOGLE_APPLICATION_CREDENTIALS="/Users/Pranav/CSE110/Scriptor/GoogleSpeechAPI/Scriptor/*.json">
# Requires sox ("sudo apt-get install sox" + "sudo apt-get install libsox-fmt-all")
#
# Citation: This code is heavily reliant upon https://towardsdatascience.com/how-to-use-google-speech-to-text-api-to-transcribe-long-audio-files-1c886f4eb3e9 and Google Tutorials
##

import json
import os
import sys
from os.path import dirname, abspath

from google.cloud import speech
from google.cloud import storage
from google.cloud.speech import enums
from google.cloud.speech import types

# Change BUCKETNAME to fit Google Cloud Platform bucketname
PATHTOAUDIOFILE = sys.argv[1]
GENERALPATH = PATHTOAUDIOFILE.split("audios")[0] 
#BUCKETNAME = "audiofilesscriptor"
# BUCKETNAME = "scriptor-audio"
BUCKETNAME = os.environ["GCS_BUCKET"]

NUMBEROFWORDSPERBLURB = 70

def upload_blob(bucket_name, source_file_name, destination_blob_name):
    """Uploads a file to the bucket."""
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    blob.upload_from_filename(source_file_name)

def delete_blob(bucket_name, blob_name):
    """Deletes a blob from the bucket."""
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)
    blob = bucket.blob(blob_name)

    blob.delete()

def queryGoogleSpeech(audio_file_output):
    gcs_uri = 'gs://' + bucket_name + '/' + audio_file_output
    transcript = ''
    
    client = speech.SpeechClient()
    audio = types.RecognitionAudio(uri=gcs_uri)

    config = types.RecognitionConfig(
             encoding=enums.RecognitionConfig.AudioEncoding.FLAC,
             sample_rate_hertz=16000,
             language_code='en-US',
             enable_word_time_offsets=True, 
             enable_automatic_punctuation=True)

    operation = client.long_running_recognize(config, audio)
    response = operation.result(timeout=10000)

    return response

def processGoogleResponse(response):
    blurbMap = dict()
    fullTranscript = ''
    currBlurb = ''
    currStartTime = None
    currEndTime = None
    numWordsInCurrBlurb = 0
    blurbIndex = 0

    for result in response.results:
         alternative = result.alternatives[0]
         textBlurb = alternative.transcript

         fullTranscript += textBlurb + " "

         for wordInfo in alternative.words:
              word = wordInfo.word
              if numWordsInCurrBlurb == 0:
                   currStartTime = wordInfo.start_time.seconds + wordInfo.start_time.nanos * 1e-9
                   if currStartTime is None: #first word of video
                        currStartTime = 0.0
       
              currBlurb += word + " "
              numWordsInCurrBlurb += 1

              currEndTime = wordInfo.end_time.seconds + wordInfo.end_time.nanos * 1e-9
              if numWordsInCurrBlurb == NUMBEROFWORDSPERBLURB:
                   blurbMap[currBlurb] = (currStartTime, currEndTime, blurbIndex)

                   currBlurb = ''
                   numWordsInCurrBlurb = 0
                   blurbIndex += 1

    if numWordsInCurrBlurb != 0:
         blurbMap[currBlurb] = (currStartTime, currEndTime, blurbIndex)

    return blurbMap, fullTranscript
      

def exportToJSON(original_file_name, audio_file_output, blurbMap, fullTranscript):
    json_out = {}

    # Creating json file name
    file_prefix = original_file_name.split(".")
    json_file = file_prefix[0] + ".json"

    json_out["Full Transcript"] = fullTranscript
    json_out["Blurbs"] = blurbMap
    json_out["File Name"] = audio_file_output

    # Convert from Python Dict to JSON object
    json_data = json.dumps(json_out, indent=4, sort_keys=True)

    # Write to .json file
    with open(GENERALPATH + "transcriptions/" + json_file, 'w') as f:
        f.write(json_data)



bucket_name = BUCKETNAME

if not os.path.isdir(GENERALPATH + "transcriptions"):
    os.mkdir(GENERALPATH + "transcriptions")

for fileName in os.listdir(PATHTOAUDIOFILE):
     if not fileName.endswith(".mp3"):
          continue

     if os.path.exists(os.path.join(GENERALPATH + "transcriptions", fileName.replace(".mp3", ".json"))):
         # We've already transcribed this file.
         continue

     print()

     fullDir = dirname(abspath(PATHTOAUDIOFILE))
     className = fullDir.split("/")[-1]

     print("Working on " + fileName + "...")
     audio_file_name = fileName
     audio_file_output = className + "-" + fileName.split(".mp3")[0] + ".flac"

     file_name = PATHTOAUDIOFILE + audio_file_output

     source_file_name = PATHTOAUDIOFILE + audio_file_name
     output_file_name = PATHTOAUDIOFILE + audio_file_output


     destination_blob_name = audio_file_output

     print("Turning MP3 file into FLAC file...")
     os.system("sox " + "\"" + source_file_name + "\"" + " --rate 16k --bits 16 --channels 1 " + "\"" + output_file_name + "\"")
    
     print("Uploading to Google Cloud Storage bucket...")
     upload_blob(bucket_name, output_file_name, destination_blob_name)
    
     print("Running Google Speech-To-Text API...")
     response = queryGoogleSpeech(audio_file_output)

     print("Processing Google Speech-To-Text Response...")
     blurbMap, fullTranscript = processGoogleResponse(response)

     print("Exporting to JSON file...")
     exportToJSON(fileName, audio_file_output, blurbMap, fullTranscript)
     
     print("Deleting from Google Storage Bucket...")
     delete_blob(bucket_name, destination_blob_name)

     print()
