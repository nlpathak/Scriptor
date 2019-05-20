# Define a default Elasticsearch client
from elasticsearch_dsl.connections import connections

import settings

connections.create_connection(hosts=settings.ELASTICSEARCH['hosts'])
