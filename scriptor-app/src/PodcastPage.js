import React, {Component} from 'react';
import { toast } from 'react-toastify';
import './PodcastPage.css';
import APIClient from './api/APIClient.js';
import queryString from 'query-string';

class PodcastPage extends Component {
    values = queryString.parse(this.props.location.search);

    /*
    Requires querystring with:
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
    
    formatTitle() {
        // Add department and coursenum
        let fulltitle = this.values.department + ' ' + this.values.course_num;

        // Add truncated coursename
        var coursename = this.values.title;
        if(coursename.length > 25) {
            coursename = coursename.substring(0,25) + '...';
        }
        fulltitle += ' - ' + coursename;

        // Add section id
        fulltitle += ' [' + this.values.section_id + ']';

        // Add truncated professor
        var professor = this.values.professor;
        if(professor.length > 12) {
            professor = professor.substring(0,12) + '...';
        }
        fulltitle += ' | ' + professor;

        // Add lecturenum
        fulltitle += ' | Lecture ' + this.values.lecture_num;

        return fulltitle;
    }

    formatVideoLink() {
        return (this.values.ucsd_podcast_video_url + '#t=' + this.values.starting_timestamp_second);
    }

    formatRelevantText() {
        if(this.values.transcription_blob.length > 950) {
            return this.values.transcription_blob.substring(0, 950) + '...';
        }
        return this.values.transcription_blob;
    }

    onSubmit(e) {
        e.preventDefault();
        if(APIClient.isCurrentUserLoggedIn()) {
            toast("Favorited", {className: 'popup'});
        } else {
            toast("Log In to Favorite", {className: 'popup error'});
        }
    }

    render(){
        return(
            <div className='podpage'>
                <h1 className='title'><a className='link' href={this.values.ucsd_podcast_video_url}>{this.formatTitle()}</a></h1>
                <div className='toplayer'>
                    <video className='vid' controls>
                        <source src={this.formatVideoLink()}/>
                    </video>
                    <div className='text'>
                        <p >{this.formatRelevantText()}</p>
                        <a href='#' className='link'>See Highlights</a>
                    </div>

                </div>
                <div className="btn-group pagewide fullgroup">
                    <div className="btn-group pagewide">
                        <button type="button" className="btn" onClick={e => this.onSubmit(e)}>FAVORITE</button>
                    </div>
                    <div className="btn-group pagewide">
                        <button type="button" className="btn">GO TO PODCAST</button>
                    </div>
                    <div className="btn-group pagewide">
                        <button type="button" className="btn">VIEW TRANSCRIPT</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default PodcastPage;