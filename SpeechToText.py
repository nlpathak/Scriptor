##
# Remember to set "GOOGLE_APPLICATION_CREDENTIALS" in current session. 
# <export GOOGLE_APPLICATION_CREDENTIALS="/home/nikhilpathak/CSE110/Scriptor-c224a4acbb7a.json">
# <export GOOGLE_APPLICATION_CREDENTIALS="/Users/Pranav/CSE110/Scriptor/GoogleSpeechAPI/Scriptor/*.json">
# Requires sox ("sudo apt-get install sox" + "sudo apt-get install libsox-fmt-all")
#
# Citation: This code is heavily reliant upon https://towardsdatascience.com/how-to-use-google-speech-to-text-api-to-transcribe-long-audio-files-1c886f4eb3e9 and Google Tutorials
##


# Change environment variables depending on whoever is using the API on their local machine
AUDIOFILENAME = "WhatisQ.mp3"
AUDIOFILEOUTPUT = "WhatisQ.flac"
PATHTOAUDIOFILE = "/home/nikhilpathak/CSE110/Scriptor/PodcastAudios/" 
BUCKETNAME = "audiofilesscriptor"
NUMBEROFWORDSPERBLURB = 70

#AUDIOFILENAME = "speech.mp3"
#AUDIOFILEOUTPUT = "speech.flac"
#PATHTOAUDIOFILE = "/Users/Pranav/CSE110/Scriptor/GoogleSpeechAPI/Scriptor/resources/" 
#BUCKETNAME = "scriptor"


# Import libraries
from pydub import AudioSegment
import io
import os
from google.cloud import speech
from google.cloud.speech import enums
from google.cloud.speech import types
import wave
from google.cloud import storage

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

audio_file_name = AUDIOFILENAME
audio_file_output = AUDIOFILEOUTPUT

file_name = PATHTOAUDIOFILE + audio_file_output

    
bucket_name = BUCKETNAME
source_file_name = PATHTOAUDIOFILE + audio_file_name
output_file_name = PATHTOAUDIOFILE + audio_file_output
destination_blob_name = audio_file_output

os.system("sox " + source_file_name + " --rate 16k --bits 16 --channels 1 " + output_file_name)
    
upload_blob(bucket_name, output_file_name, destination_blob_name)
   
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

blurbMap = dict()
fullTranscript = ''
currBlurb = ''
currStartTime = None
currEndTime = None
numWordsInCurrBlurb = 0
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
             blurbMap[currBlurb] = (currStartTime, currEndTime)
        #      print("Blurb:", currBlurb)
        #      print("Start Time:", currStartTime)
        #      print("End Time:", currEndTime)

             currBlurb = ''
             numWordsInCurrBlurb = 0

if numWordsInCurrBlurb != 0:
     blurbMap[currBlurb] = (currStartTime, currEndTime)
#      print("Blurb:", currBlurb)
#      print("Start Time:", currStartTime)
#      print("End Time:", currEndTime)
             

#HERE WE HAVE ACCESS TO FULL TRANSCRIPT (fullTranscript) AND DICT (blurbMap) FOR BLURBS OF 70 WORDS TO TUPLE OF (STARTTIME, ENDTIME)
#EXPORT JSON HERE

delete_blob(bucket_name, destination_blob_name)
