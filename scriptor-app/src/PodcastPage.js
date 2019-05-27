import React, {Component} from 'react';
import {toast} from 'react-toastify';
import './PodcastPage.css';
import APIClient from './api/APIClient.js';
import queryString from 'query-string';
import {Link} from 'react-router-dom';

class PodcastPage extends Component {
    values = queryString.parse(this.props.location.search);
    state = {
        isFavorited: null
    };
    
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

    formatVideoLink(mainurl) {
        return (mainurl + '#t=' + this.values.starting_timestamp_second);
    }

    formatRelevantText() {
        if(this.values.transcription_blob.length > 950) {
            return this.values.transcription_blob.substring(0, 950) + '...';
        }
        return this.values.transcription_blob;
    }

    onSubmit(e) {
        e.preventDefault();
        if(!APIClient.isCurrentUserLoggedIn()) {
            toast("Log In to Favorite", {className: 'popup error'});
            return;
        } 
        
        APIClient.checkFavoritePodcast(this.values.podcast_id).then(response => {
            if(response) {
                APIClient.removeFavoritePodcastById(this.values.podcast_id).then(response => {
                    toast("Removed from Favorites", {className: 'popup'});
                });
                this.setState({isFavorited: false});
                document.getElementById('togglebutton').style.color = "rgba(255,255,255,1)";
                document.getElementById('togglebutton').style.border = "none";
                document.getElementById('togglebutton').style.backgroundColor = "rgba(72,136,163,.93)";
                document.getElementById('togglebutton').innerHTML = "Favorite";
            } else {
                APIClient.addFavoritePodcastById(this.values.podcast_id).then(response => {
                    toast("Added to Favorites", {className: 'popup'});
                });
                this.setState({isFavorited: true});
                document.getElementById('togglebutton').style.color = "rgba(72,136,163,.93)";
                document.getElementById('togglebutton').style.border = "1px solid rgba(72,136,163,.93)";
                document.getElementById('togglebutton').style.backgroundColor = "rgba(255,255,255,1)";
                document.getElementById('togglebutton').innerHTML = "Unfavorite";
            }   
        });

    }
    
    relocate(e) {
        e.preventDefault();
        window.location.assign(this.values.ucsd_podcast_video_url);
    }

    componentDidMount() {
        APIClient.checkFavoritePodcast(this.values.podcast_id).then(response => {
            if(response) {
                this.setState({isFavorited: true});
                document.getElementById('togglebutton').style.color = "rgba(72,136,163,.93)";
                document.getElementById('togglebutton').style.border = "1px solid rgba(72,136,163,.93)";
                document.getElementById('togglebutton').style.backgroundColor = "rgba(255,255,255,1)";
                document.getElementById('togglebutton').innerHTML = "Unfavorite";
            } else {
                this.setState({isFavorited: false});
            }   
        });
        APIClient.getPodcastSnippet(this.values.blob_id).then(response => {
           console.log(response);
        });
    }

    render(){
        let mainurl;
        this.values.ucsd_podcast_video_url === '' ? mainurl = this.values.ucsd_podcast_audio_url : mainurl = this.values.ucsd_podcast_video_url;
        return(
            <div className='podpage'>
                <h1 className='title'><a className='link' href={mainurl}>{this.formatTitle()}</a></h1>
                <div className='toplayer'>
                    <video className='vid' controls autoplay>
                        <source src={this.formatVideoLink(mainurl)}/>
                    </video>
                    <div className='text'>
                        <h3>Speech-to-Text</h3>
                        <p style={{marginTop: '22px'}}>{this.formatRelevantText()}</p>
                        <Link
                        className='link'
                        to={{
                        pathname: "/transcript",
                        search: "?podcast_id=" + this.values.podcast_id 
                        }}
                        ><u>View Full Transcript</u></Link>
                    </div>
                </div>
                <div className="btn-group pagewide fullgroup">
                    <div className="btn-group pagewide">
                        <button type="button" className="btn" id='togglebutton' onClick={e => this.onSubmit(e)}>FAVORITE</button>
                    </div>
                    <div className="btn-group pagewide">
                        <button type="button" className="btn" onClick={e => this.relocate(e)}>GO TO PODCAST</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default PodcastPage;