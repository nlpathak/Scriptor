import os

ENV = os.environ.get("ENV", "DEV")
if ENV == "DEV":
    # Only load the .env file in the development environment
    from dotenv import load_dotenv

    load_dotenv()

# Elasticsearch-related settings
ELASTICSEARCH = {
    "hosts": os.environ.get("ES_HOSTS", "localhost").split(",")
}

JWT_SECRET = "dfhudgruwij3o0u@#$@#!ED"

SENDGRID_APIKEY = os.environ.get("SENDGRID_APIKEY", None)

FROM_EMAIL = "support@getscriptorapp.com"