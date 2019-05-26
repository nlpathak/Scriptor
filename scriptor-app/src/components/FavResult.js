import React, {Component} from 'react';
import APIClient from '../api/APIClient.js';
import './_Components.css';
import starOff from './starOff.svg';
import starOn from './starOn.svg';
//Hard coded fav data
import { course_podcasts } from "./favData.json"


class FavResult extends Component {
    constructor(props) {
        super(props);
        this.state = {isFav : course_podcasts.map((element) => true), podcasts: ''};
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e, index) {
        e.preventDefault();

        const newFav = [...this.state.isFav]
        newFav[index] = !this.state.isFav[index]
        this.setState(state => ({
            isFav: newFav
        }));
    }

    formatTitle(item) {
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

    formatVideoLink(item) {
        return (item.videolink + '#t=' + item.starttime);
    }

    returnURL(item){
        if(item.video_url.length < 1){
            item.video_url = item.audio_url
        }
        return item.video_url
    }

    componentDidMount() {
        APIClient.getFavoritePodcasts().then(response => {
            this.setState({podcasts: {response}});
        });
    }

    render(){
        return(
            <div className='favorites'>
                <div className='header'>
                    <h1>FAVORITES</h1>
                </div>
                <div className = 'favList'>
                        <ul>
                        {this.state.podcasts.map((item, index)  => (
                            <li className = 'favResult' key={index}>
                                <a href={this.returnURL(item)}>
                                    <div>{this.formatTitle(item)}
                                        <img onClick={(e) => {this.handleClick(e, index)}}
                                        src={this.state.isFav[index] ? starOn : starOff}
                                        alt="" width="48" height="48"/>
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
}



 export default FavResult;
