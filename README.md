<img src="https://github.com/nlpathak/Scriptor/blob/master/scriptor-app/src/assets/Logo.png" alt="Scriptor" width=300px>

## Introduction
Scriptor is a solution for streamlining studying and reviewing at the University of California, San Diego. No longer do students have to manually search for specific information in the vast collection of knowledge that is the UC San Diego Podcast System. 

Scriptor allows students to search for keywords and instantly be presented with the exact material they want. Scriptor returns precise timestamps in podcasts that match the information users seek, efficiently parsing through UCSD's vast database so students don't have to. Scriptor wraps this functionality with a personalized interface, allowing users to favorite, save their history, and more. Happy podcasting!

## Login Credentials
TODO - ?

## Requirements
CHROME + TODO - SUBHASH


## Installation Instructions
Scriptor is available online! Visit: `URL`

If you want to install and build Scriptor locally, enter the following commands:
```shell
git clone https://github.com/nlpathak/Scriptor
cd Scriptor
docker-compose build --no-cache
```

## How to Run
Scriptor is available online! Visit: `URL`

If you want to run Scriptor locally, enter the following commands:
```shell
docker-compose up
# Wait 20-30 seconds for the backend database to initialize before running the next command in a new terminal.
docker-compose exec backend python3 scripts/import_data_into_elasticsearch.py
```

The app will be accessible at [http://localhost:3000](http://localhost:3000). The backend database will be accessible at [http://localhost:5000](http://localhost:5000).

## Known Bugs
* The Forgot Password verification email is sent to the user's spam folder.
