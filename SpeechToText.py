##
# Remember to set "GOOGLE_APPLICATION_CREDENTIALS" in current session. 
# <export GOOGLE_APPLICATION_CREDENTIALS="/home/nikhilpathak/CSE110/*.json">
# <export GOOGLE_APPLICATION_CREDENTIALS="/Users/Pranav/CSE110/Scriptor/GoogleSpeechAPI/Scriptor/*.json">
# This code is heavily based on https://towardsdatascience.com/how-to-use-google-speech-to-text-api-to-transcribe-long-audio-files-1c886f4eb3e9 and Google Tutorials
# Requires sox audio converter
##


# Change environment variables depending on whoever is using the API on their local machine

#AUDIOFILENAME = "DeepLearning.wav"
#PATHTOAUDIOFILE = "/home/nikhilpathak/CSE110/Scriptor/PodcastAudios/" 
#BUCKETNAME = "audiofilesscriptor"

AUDIOFILENAME = "speech.mp3"
AUDIOFILEOUTPUT = "speech.flac"
PATHTOAUDIOFILE = "/Users/Pranav/CSE110/Scriptor/GoogleSpeechAPI/Scriptor/resources/" 
BUCKETNAME = "scriptor"


# Import libraries
from pydub import AudioSegment
import io
import os
from google.cloud import speech
from google.cloud.speech import enums
from google.cloud.speech import types
import wave
from google.cloud import storage

######### currently not using these three functions ###########
def mp3_to_wav(audio_file_name):
    if audio_file_name.split('.')[1] == 'mp3':    
        sound = AudioSegment.from_mp3(audio_file_name)
        audio_file_name = audio_file_name.split('.')[0] + '.wav'
        sound.export(audio_file_name, format="wav")

def stereo_to_mono(audio_file_name):
    sound = AudioSegment.from_wav(audio_file_name)
    sound = sound.set_channels(1)
    sound.export(audio_file_name, format="wav")

def frame_rate_channel(audio_file_name):
    with wave.open(audio_file_name, "rb") as wave_file:
        frame_rate = wave_file.getframerate()
        channels = wave_file.getnchannels()
        return frame_rate,channels

###############################################################

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
enable_word_time_offsets=True)

operation = client.long_running_recognize(config, audio)
response = operation.result(timeout=10000)

blurbMap = dict()
print("Start of Transcription")
fullTranscript = ''
for result in response.results:
    alternative = result.alternatives[0]
    textBlurb = alternative.transcript
    textBlurbConfidence = alternative.confidence

    fullTranscript += textBlurb
    print(u'TextBlurb:', textBlurb)

    blurb_info = alternative.words[0]
    start_time = blurb_info.start_time
    print("Start Time:", start_time)

    blurbMap[textBlurb] = start_time
    print()
    
print(blurbMap)
print()
print(fullTranscript)


delete_blob(bucket_name, destination_blob_name)
