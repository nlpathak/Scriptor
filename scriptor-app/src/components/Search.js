import React, {Component} from 'react';
import { Route, Redirect } from 'react-router'
import './_Components.css';
import { toast } from 'react-toastify';
import APIClient from '../api/APIClient.js';

class Search extends Component {
    data = [];
    state = {
        query: '',
        department: '',
        course: '',
        professor: '',
        quarter: '',
        showFilters: false,
        results: [],
        dataExists: false,
        show: true,
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

    checkDataExist(){

    }

    onSubmit(e) {
       e.preventDefault();
        if(this.state.query.length === 0) {
            this.setState({show: false})
        }
        APIClient.searchPodcasts(this.state.query, {}).then(response => {
            var counter = 0;
            if(response.length == 0){
                document.getElementById('noResults').style.color = "rgba(207, 70, 70, 0.93)";
                document.getElementById('noResults').innerHTML = "No results found";
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
                    console.log(back);
                    var result = {description: back.department + ' ' + back.course_num + " - " + back.title + " [" + back.section_id + " - " + qString + "]" + " | " + back.professor + " | " + "Lecture " + back.lecture_num, blurb: element.transcription_blob, timestamp: timeStamp, url: vidUrl}
                    this.setState(prevState => ({results: [...prevState.results, result]}));
                    counter++;
                    if(counter == response.length){
                        if(this.state.results.length > 0){
                            this.setState({dataExists: true});
                        }
                    }
                });
              });

        }).catch(e => {
            console.log(e);         
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
                <div className='filters'>
                    <div className='filterinputs'>
                        <input 
                            type = 'text'
                            className ='filterbar' 
                            name = 'department'
                            value = {this.state.department} 
                            onChange={e => this.change(e)} 
                            onKeyDown={e => this.handleEnter(e)}/>
                        <input 
                            type = 'text'
                            className ='filterbar' 
                            name = 'course'
                            value = {this.state.course} 
                            onChange={e => this.change(e)} 
                            onKeyDown={e => this.handleEnter(e)} />
                        <input 
                            type = 'text'
                            className ='filterbar' 
                            name = 'professor'
                            value = {this.state.professor} 
                            onChange={e => this.change(e)} 
                            onKeyDown={e => this.handleEnter(e)} />
                        <input 
                            type = 'text'
                            className ='filterbar' 
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
            <div className={this.state.showFilters ? 'searchform active' : 'searchform'}>
                <form className='col-xs-1 text-center'>
                    <h1 className='title'>SCRIPTOR</h1>
                    <input 
                    type = 'text'
                    className ='searchbar' 
                    name = 'query'
                    placeholder = 'What do you want to learn?'
                    value = {this.state.query} 
                    onChange={e => this.change(e)} />
                    <p id="noResults"></p>
                    <br></br>
                    {filters}
                    <button className='center' onClick={e => this.onSubmit(e)}>Search</button>
                    {this.state.dataExists && <Redirect to={{pathname: '/results',state: { results: this.state.results }}}/>
                    }


                </form> 
            </div>
        )
    }
}

export default Search;