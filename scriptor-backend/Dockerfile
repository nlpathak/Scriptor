FROM kennethreitz/pipenv

ADD . /app
WORKDIR /app

RUN chmod u+x ./wait-for-it.sh

ENV PYTHONPATH=.
EXPOSE 5000

RUN python3 -c "import nltk; nltk.download('punkt')"

ENTRYPOINT ./wait-for-it.sh elasticsearch:9200 -t 60 -- gunicorn backend.app:app --log-level debug -b 0.0.0.0:5000 -k gthread --reload