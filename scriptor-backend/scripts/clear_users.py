from backend.users.models import User

print("Clearing all users...")
User.search().query("match_all").delete()
print("Done.")
