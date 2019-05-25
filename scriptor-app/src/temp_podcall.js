import React from 'react';
import { Link } from 'react-router-dom';
import APIClient from './api/APIClient.js';

function temp_podcall() {
  var state = {
    department: 'CSE',
    course_num: '101',
    title: "Design and Analysis of Algorithm",
    section_id: 'A00',
    professor: 'Miles Jones',
    lecture_num: '24',
    podcast_id: 'EZaX52oBQfPwwEpzHeN9',
    ucsd_podcast_video_url: 'http://podcast-media.ucsd.edu/Podcasts/wi19/cse101_a00_eoacc2krxy/cse101_a00-03062019-1500.mp4',
    starting_timestamp_second:'429',
    transcription_blob:"recurrence makes sense and that's what I want you to do already. So that's kind of like took it out. Okay. So today the dynamic programming problems were going to look at today. I'll ha...",
    ucsd_podcast_audio_url:'http://podcast-media.ucsd.edu/Podcasts/wi19/cse101_a00_eoacc2krxy/cse101_a00-03062019-1500.mp3',
  };

    /*
    Requires state:
        department
        course_num
        title
        section_id
        professor
        lecture_num

        ucsd_podcast_video_url
        starting_timestamp_second
        transcription_blob
        ucsd_podcast_audio_url
    */
  return (
    <button>
      <Link
        to={{
          pathname: "/podcast",
          search: "?department=" + state.department 
          + "&course_num=" + state.course_num
          + "&title=" + state.title
          + "&section_id=" + state.section_id
          + "&professor=" + state.professor
          + "&lecture_num=" + state.lecture_num
          + "&ucsd_podcast_video_url=" + state.ucsd_podcast_video_url
          + "&starting_timestamp_second=" + state.starting_timestamp_second
          + "&transcription_blob=" + state.transcription_blob
          + "&ucsd_podcast_audio_url=" + state.ucsd_podcast_audio_url
          + "&podcast_id=" + state.podcast_id
        }}
      >Testpage</Link>
    </button>
    
  );
}

export default temp_podcall;
