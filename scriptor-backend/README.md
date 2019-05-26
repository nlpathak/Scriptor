# Backend API quickstart

## Installation
1. `docker-compose build --no-cache`

## Tests
To test the backend, run `docker-compose exec backend pytest` (ensure that you've already run `docker-compose up`).

## Starting the backend API server
1. `docker-compose build --no-cache` (if you just pulled a new copy of the code from the repo)
2. `docker-compose up`
3. Wait for ~10-15 seconds, for Elasticsearch to boot up
4. `docker-compose exec backend python3 scripts/import_data_into_elasticsearch.py` (if you want to import all the podcast transcriptions into Elasticsearch)

The backend API server can be reached at <a href="http://localhost:5000" target="_blank">http://localhost:5000</a>

## Stopping the backend API server
1. Run `docker-compose down` if you'd like to keep the database data (so that all the data will remain when you restart the backend server later), or run `docker-compose down -v` if you'd like to clear the database data.
    - ***Note:** If you clear the database data, you need to re-run the database import script before restarting the backend server.*
    
## API Overview
Warning: This documentation is a work-in-progress, so please message **#backend** on Slack if you have any questions! :)
### Terminology
- **Auth token**: When the API returns an ***auth token***, typically after calling its registration or login endpoints, the client should use include this token in all subsequent HTTP requests (with the `Authorization` HTTP header, like `Authorization: Bearer <auth token goes here>`), in order to authenticate the user in the backend. Once the user logs out of the application, delete this locally saved auth token from the client-side and don't include it in subsequent API requests (in order to indicate to the backend that there is no longer an authenticated user). 

### Endpoints
#### Users

-   ##### Register a new user 
    `POST` /api/user/register/
    
    **Payload**
    ```json
    {
        "email" : "...",
        "password" : "..."
    }
    ```
    
    **Sample responses**
    ```json
    {
        "success" : true,
        "auth_token" : "..."
    }
    ```
    ```json
    {
        "success" : false,
        "error" : "..."
    }
    ```
    
-   ##### Login 
    `POST` /api/user/login/
    
    **Payload**
    ```json
    {
        "email" : "...",
        "password" : "..."
    }
    ```
    
    **Sample responses**
    ```json
    {
        "success" : true,
        "auth_token" : "..."
    }
    ```
    ```json
    {
        "success" : false,
        "error" : "..."
    }
    ```
    
-   ##### Change password *(auth token required)*
    `POST` /api/user/change_password/
    
    **Payload**
    ```json
    {
        "existing_password" : "...",
        "new_password" : "..."
    }
    ```
    
    **Sample responses**
    ```json
    {
        "success" : true
    }
    ```
    ```json
    {
        "success" : false,
        "error" : "..."
    }
    ```
    
-   ##### Add favorite podcast *(auth token required)*
    `POST` /api/user/favorite_podcasts/(the podcast_id)/add/
    
    **Sample responses**
    ```json
    {
        "success" : true
    }
    ```
        
-   ##### Remove favorite podcast *(auth token required)*
    `DELETE` /api/user/favorite_podcasts/(the podcast_id)/remove/
    
    **Sample responses**
    ```json
    {
        "success" : true
    }
    ```
        
-   ##### Get favorite podcasts *(auth token required)*
    `GET` /api/user/favorite_podcasts/
    
    **Sample responses**
    ```json
    {
        "success" : true,
        "favorite_podcasts" : [
            // ... 
        ]
    }
    ```        
    
-   ##### Get history *(auth token required)*
    `GET` /api/user/history/
    
    **Sample responses**
    ```json
    {
        "success" : true,
        "history" : [
            // ... 
        ]
    }
    ```
        
-   ##### Clear history *(auth token required)*
    `DELETE` /api/user/history/clear/
    
    **Sample responses**
    ```json
    {
        "success" : true,
    }
    ```

#### Search
        
-   ##### Podcasts
    `GET` /api/search/podcasts/
    
    **URL query parameters**
    - **q**: The text query (required)
    - **dept**: The department to filter by
    - **course_number**: The course number to filter by
    - **professor**: The professor to filter by
    - **quarter**: The quarter to filter by
    - **section_id**: The section id to filter by
    
    **Sample responses**
    ```json
    {
        "success" : true,
        "results" : [
          // ...
        ]
    }

#### Podcasts

-   ##### Get podcast page data
    `GET` /api/podcasts/blobs/(The transcription blob id goes here)/
    
    **Sample responses**
    ```json
    {
        "success" : true,
        "podcast" : {
          // ...
        },
        "podcast_blob" : {
          // ...
        }
    }

-   ##### Get podcast metadata
    `GET` /api/podcasts/(The podcast id)/
    
    **Sample responses**
    ```json
    {
        "success" : true,
        "podcast" : {
          // ...
        }
    }

-   ##### Get a podcast's full transcript
    `GET` /api/podcasts/(The podcast id)/transcript/
    
    **Sample responses**
    ```json
    {
        "success" : true,
        "full_transcript" : "..."
    }
    

## TODO
- Write (more) tests for the searching API, especially its filtering capability
- Write docs