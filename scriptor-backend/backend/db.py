# Define a default Elasticsearch client
from elasticsearch_dsl.connections import connections

import settings


def connect_to_es():
    connections.create_connection(hosts=settings.ELASTICSEARCH['hosts'])
