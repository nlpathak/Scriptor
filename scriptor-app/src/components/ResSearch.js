import React, {Component} from 'react';
import {Redirect} from 'react-router'
import './_Components.css';
import { toast } from 'react-toastify';
import APIClient from '../api/APIClient.js';
import { withRouter } from 'react-router-dom';


class ResSearch extends Component {
    query = "";
    state = {
        query: '',
        department: '',
        course: '',
        professor: '',
        quarter: '',
        showFilters: false,
        results: [],
    };

    change = e => {
        this.setState({[e.target.name]: e.target.value}, this.updateFilters);
    }

    
    
    updateFilters() {
        if(this.state.query.length > 0 || (this.state.department.length > 0 || this.state.course.length > 0
        || this.state.professor.length > 0 || this.state.quarter.length > 0)) {
            this.setState({showFilters: true});
        } else {
            this.setState({showFilters: false});
        }
    }


    onSubmit(e) {
       this.query = this.state.query;
       e.preventDefault();
        if(this.state.query.length === 0) {
        }
        APIClient.searchPodcasts(this.state.query, {dept: this.state.department, course: this.state.couse, professor: this.state.professor, quarter: this.state.quarter}).then(response => {
            var counter = 0;
            if(response.length === 0){
                document.getElementById('noResults').style.color = "rgba(207, 70, 70, 0.93)";
                document.getElementById('noResults').innerHTML = "No results found";
            this.setState({showFilters: false});

            }
            response.forEach((element) => {
                APIClient.getPodcastMetadata(element.podcast_id).then(back => {
                    const quarter = back.quarter.split(' ');
                    const qString = quarter[0].substr(0,1) + quarter[1].substr(2,3);
                    var minutes = Math.floor(element.starting_timestamp_second / 60);
                    var seconds = element.starting_timestamp_second % 60;    
                    var updatedSeconds = ('0' + seconds).slice(-2);
                    const timeStamp = minutes + ":" + updatedSeconds;
                    const vidUrl = back.ucsd_podcast_video_url;
                    var prof = back.professor;
                    prof = prof.substring(prof.indexOf(',') + 1, prof.length) + " " +
                        prof.substring(0, prof.indexOf(','))
                    var result = {description: back.department + ' ' + back.course_num + " - " + back.title + " [" + back.section_id + " - " + qString + "] | " + prof + " | Lecture " + back.lecture_num, 
                        blurb: element.transcription_blob, 
                        timestamp: timeStamp, 
                        url: vidUrl,
                        podcast_id: element.podcast_id,
                        podcastPage: {
                            department: back.department,
                            course_num: back.course_num,
                            title: back.title,
                            section_id: back.section_id,
                            professor: prof,
                            lecture_num: back.lecture_num,
                            ucsd_podcast_video_url: back.ucsd_podcast_video_url,
                            starting_timestamp_second: element.starting_timestamp_second,
                            transcription_blob: element.transcription_blob,
                            ucsd_podcast_audio_url: back.ucsd_podcast_audio_url,
                        }
                    }
                    this.setState(prevState => ({results: [...prevState.results, result]}));
                    counter++;
                    if(counter === response.length){
                        this.props.history.push({
                        pathname: '/results',
                        state: { results: this.state.results}
                        })

                        this.setState({results: []});
                        this.setState({showFilters: false});
                    }
                    });
                });

        });

    }
    
    handleEnter = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            toast("Press the Search Button", {className: 'popup'});
         }
    }
    
    render() {                   
        let filters;
        if(this.state.showFilters) {
            filters = 
                <div className='resfilters'>
                    <div className='resfilterinputs'>
                        <input 
                            type = 'text'
                            className ='resfilterbar' 
                            name = 'department'
                            value = {this.state.department} 
                            onChange={e => this.change(e)} 
                            onKeyDown={e => this.handleEnter(e)}/>
                        <input 
                            type = 'text'
                            className ='resfilterbar' 
                            name = 'course'
                            value = {this.state.course} 
                            onChange={e => this.change(e)} 
                            onKeyDown={e => this.handleEnter(e)} />
                        <input 
                            type = 'text'
                            className ='resfilterbar' 
                            name = 'professor'
                            value = {this.state.professor} 
                            onChange={e => this.change(e)} 
                            onKeyDown={e => this.handleEnter(e)} />
                        <input 
                            type = 'text'
                            className ='resfilterbar' 
                            name = 'quarter'
                            value = {this.state.quarter} 
                            onChange={e => this.change(e)} 
                            onKeyDown={e => this.handleEnter(e)} />
                    </div>
                    <p style={{marginTop: '5px'}}>Department</p>
                    <p>Course</p>
                    <p>Professor</p>
                    <p>Quarter</p>
                    
                </div>
        } else {
            filters = null;
        }

        return (
            <div className={'ressearchform'}>
                <form className='col-xs-1 text-center'>
                    <input 
                    type = 'text'
                    className ='ressearchbar' 
                    name = 'query'
                    placeholder = "Keep Learning?"
                    value = {this.state.query} 
                    onChange={e => this.change(e)} />
                    <p id="noResults"></p>
                    {filters}
                    <button className='rescenter' onClick={e => this.onSubmit(e)}>Search</button>


                </form> 
            </div>
        )
    }
}

export default withRouter(ResSearch);