from . import models
from .routes import podcasts_blueprint


models.Podcast.init()
