# Scriptor

## Introduction
TODO - SABEEL

## Login Credentials
TODO - ?

## Requirements
CHROME + TODO - SUBHASH


## Installation Instructions
Enter the following commands to locally install and build the program:
```shell
git clone https://github.com/nlpathak/Scriptor
cd Scriptor
docker-compose build --no-cache
```

## How to Run
Enter the following commands to locally run the program:
```shell
docker-compose up
# Wait 20-30 seconds for the backend database to initialize before running the next command in a new terminal.
docker-compose exec backend python3 scripts/import_data_into_elasticsearch.py
```

The app will be accessible at [http://localhost:3000](http://localhost:3000). The backend database will be accessible at [http://localhost:5000](http://localhost:5000).

## Known Bugs
* The Forgot Password verification email is sent to the user's spam folder.
