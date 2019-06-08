# Load 2 test users into the database
# one with history/favorites, and one without.
# Make sure to have some courses already pre-imported before running this script
import time

from backend.users.models import User, HistoryItem
from backend.podcasts.models import Podcast
from backend.search.models import PodcastTranscriptionBlob

# Fresh test user
test_user1_email = "testEmail@gmail.com"
test_user1_pass = "testEmail"

# Populated test user
test_user2_email = "scriptorTestCase@gmail.com"
test_user2_pass = "1234"

# Delete any existing test users
print ("Deleting any existing test users...")
User.delete_by_email(test_user1_email)
User.delete_by_email(test_user2_email)

time.sleep(2)

# Register these 2 test users
print ("Registering 2 test users...")
test_user1 = User.register_new_user(email=test_user1_email, password=test_user1_pass)
test_user2 = User.register_new_user(email=test_user2_email, password=test_user2_pass)

random_transcription_blobs = [transcription_blob for transcription_blob in
                              PodcastTranscriptionBlob.search().query("match_all")[:20]]

# Add history for test user 2
print ("Adding history for test user 2...")
test_history_search_queries = [
    HistoryItem(type=HistoryItem.TYPE_SEARCH_QUERY, search_query="valence electrons", search_filters={}),
    HistoryItem(type=HistoryItem.TYPE_SEARCH_QUERY, search_query="contrapositive",
                search_filters={"dept": "CSE", "course_num": "20"}),
    HistoryItem(type=HistoryItem.TYPE_SEARCH_QUERY, search_query="machine learning", search_filters={"dept": "CSE"}),
]

history_podcast_blobs = random_transcription_blobs[:2]
test_history_podcast_blob_views = [
    HistoryItem(type=HistoryItem.TYPE_PODCAST_PAGE, podcast_page_transcription_blob_id=transcription_blob.meta.id)
    for transcription_blob in history_podcast_blobs
]

test_user_history = test_history_search_queries + test_history_podcast_blob_views
test_user2.history = test_user_history

# Add favorites for test user 2
print ("Adding favorites for test user 2...")
favorite_podcast_blobs = random_transcription_blobs[:3]
test_favorite_podcasts = [
    {"podcast_id" : transcription_blob.podcast_id, "blob_id" : transcription_blob.meta.id}
    for transcription_blob in favorite_podcast_blobs
]
test_user2.favorite_podcast_ids = test_favorite_podcasts

# Save this test user 2
print ("Saving test user 2...")
test_user2.save()