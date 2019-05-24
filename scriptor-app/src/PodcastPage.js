import React, {Component} from 'react';
import { toast } from 'react-toastify';
import './PodcastPage.css';
import APIClient from './api/APIClient.js';

class PodcastPage extends Component {
    /*
    Requires props:
        department
        coursenum
        coursename
        section
        professor
        lecturenum

        videolink
        startime
        relevanttext
        podlink
    */

    formatTitle() {
        // Add department and coursenum
        let fulltitle = this.props.department + ' ' + this.props.coursenum;

        // Add truncated coursename
        var coursename = this.props.coursename;
        if(coursename.length > 25) {
            coursename = coursename.substring(0,25) + '...';
        }
        fulltitle += ' - ' + coursename;

        // Add section id
        fulltitle += ' [' + this.props.section + ']';

        // Add truncated professor
        var professor = this.props.professor;
        if(professor.length > 12) {
            professor = professor.substring(0,12) + '...';
        }
        fulltitle += ' | ' + professor;

        // Add lecturenum
        fulltitle += ' | Lecture ' + this.props.lecturenum;

        return fulltitle;
    }

    formatVideoLink() {
        return (this.props.videolink + '#t=' + this.props.starttime);
    }

    formatRelevantText() {
        if(this.props.relevanttext.length > 950) {
            return this.props.relevanttext.substring(0, 950) + '...';
        }
        return this.props.relevanttext;
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
                <h1 className='title'><a className='link' href={this.props.podlink}>{this.formatTitle()}</a></h1>
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