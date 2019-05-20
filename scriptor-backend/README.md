# Backend API quickstart

## Installation
1. Ensure that you have `pipenv` installed. If not, install it with `pip install pipenv`.
2. `cd scriptor-backend`
3. `pipenv install`
4. `pipenv shell`
5. `PYTHONPATH=. python scripts/import_data_into_elasticsearch.py` (only run this the first time, or if you cleared the database data the last time you stopped the backend)

## Starting the backend API server
1. `docker-compose up` (in a separate terminal tab, since this will start **Elasticsearch**)
2. `PYTHONPATH=. python app.py` (this will start the backend API server)

The backend API server can be reached at <a href="http://localhost:5000" target="_blank">http://localhost:5000</a>

## Stopping the backend API server
1. To stop **Elasticsearch**, run `docker-compose down` if you'd like to keep the database data (so that all the data will remain when you restart the backend server later), or run `docker-compose down -v` if you'd like to clear the database data.
    - ***Note:** If you clear the database data, you need to re-run the database import script before restarting the backend server.*
2. `Ctrl+C` the terminal tab where you ran `PYTHONPATH=. python app.py`
    
## API Routes
TODO: Still need to fill in this documentation, but mostly all API routes have been implemented already.

## TODO
- Write tests
- Write docs