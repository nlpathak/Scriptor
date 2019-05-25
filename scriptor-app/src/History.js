import React from 'react';
import APIClient from './api/APIClient.js';
import './History.css';
import { course_podcasts } from "./components/favData.json"

let searchHistory = [
    {
      "search": "Dynamic Programming"
    },
    {
      "search": "Dynamic Programming"
    },
    {
      "search": "Dynamic Programming"
    },
    {
      "search": "Daily sugar intake"
    },
    {
      "search": "Daily sugar intake"
    }
]
function formatTitle(item) {
    // Add department and coursenum
    let fulltitle = item.department + ' ' + item.course_num;

    // Add truncated coursename
    var coursename = item.course_name;
    if(coursename.length > 25) {
        coursename = coursename.substring(0,25) + '...';
    }
    fulltitle += ' - ' + coursename;

    // Add section id
    var quarter = item.quarter;
    quarter = quarter.substring(0, 2).toUpperCase() + quarter.substring(quarter.length - 2, quarter.length);
    fulltitle += ' [' + item.section_id + '-' + quarter + ']';

    // Add truncated professor
    var professor = item.professor;
    if(professor.length > 25) {
        professor = professor.substring(0,25) + '...';
    }
    // Swaps first and last name
    professor = professor.substring(professor.indexOf(',') + 1, professor.length) + " " +
                professor.substring(0, professor.indexOf(','))
    fulltitle += ' | ' + professor;

      // Add lecturenum
    fulltitle += ' | Lecture ' + item.lecture_num;
    return fulltitle;
}
function returnURL(item){
    if(item.video_url.length < 1){
        item.video_url = item.audio_url
    }
    return item.video_url
}

function History() {
  const loggedin = 1;
  if(loggedin) {
    return (
      <div className = "history">
        <div className='header'>
          <h1>HISTORY</h1>
        </div>
        <div className = "search" >
          <h1> Search
            <div>
              <ul>
              {searchHistory.map((item, index)  => (
                <li className = 'searches' key={index}>
                  <div>
                    {item.search}
                  </div>
                </li>
              ))}
              </ul>
            </div>
          </h1>
          <h2>Result
              <div>
                <ul>
                {course_podcasts.map((item, index)  => (
                  <li className = 'results' key={index}>
                      <a href={returnURL(item)}>
                          <div>{formatTitle(item)}
                          </div>
                      </a>
                  </li>
                ))}
              </ul>
              </div>
            </h2>
        </div>
      </div>
    );
  } else {
    window.location.assign('/');
  }
}

export default History;
