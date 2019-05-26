FROM kennethreitz/pipenv

ADD . /app
WORKDIR /app

ENV PYTHONPATH=.
EXPOSE 5000

RUN python3 -c "import nltk; nltk.download('punkt')"

ENTRYPOINT gunicorn backend.app:app -b 0.0.0.0:5000 -k gthread