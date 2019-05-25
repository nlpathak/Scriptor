import React from 'react';
import { Link } from 'react-router-dom';

function temp_podcall() {
  var state = {
    department: 'CSE',
    course_num: '101',
    title: "Design and Analysis of Algorithm",
    section_id: 'A00',
    professor: 'Miles Jones',
    lecture_num: '12',

    ucsd_podcast_video_url: 'http://techslides.com/demos/sample-videos/small.mp4',
    starting_timestamp_second:'2',
    transcription_blob:'To do dynamic programming, there are, umm, 7 steps needed. Step 1 is defining the, umm, subproblems. Nine out of ten times you restate the problem within a subset of the original input. For example, if your dynamic programming algorithm was, umm, finding the maximum event scheduling from last class, your step 1 would just be the maximum number of events you can To do dynamic programming, there are, umm, 7 steps needed. Step 1 is defining the, umm, subproblems. Nine out of ten times you restate the problem within a subset of the original input. For example, if your dynamic programming algorithm was, umm, finding the maximum event scheduling from last class, your step 1 would just be the maximum number of events you can To do dynamic programming, there are, umm, 7 steps needed. Step 1 is defining the, umm, subproblems. Nine out of ten times you restate the problem within a subset of the original input. For example, if your dynamic programming algorithm was, umm, finding the maximum event scheduling from last class, your step 1 would just be the maximum number of events you can To do dynamic programming, there are, umm, 7 steps needed. Step 1 is defining the, umm, subproblems. Nine out of ten times you restate the problem within a subset of the original input. For example, if your dynamic programming algorithm was, umm, finding the maximum event scheduling from last class, your step 1 would just be the maximum number of events you can',
    ucsd_podcast_audio_url:'#'
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
          ,
        }}
      >Testpage</Link>
    </button>
    
  );
}

export default temp_podcall;
