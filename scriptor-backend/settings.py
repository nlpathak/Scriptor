import os

# Elasticsearch-related settings
ELASTICSEARCH = {
    "hosts": os.environ.get("ES_HOSTS", "localhost").split(",")
}

JWT_SECRET = "dfhudgruwij3o0u@#$@#!ED"

SENDGRID_APIKEY = "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"

FROM_EMAIL = "support@getscriptorapp.com"
