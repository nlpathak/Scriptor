import React, {Component} from 'react';
import APIClient from '../api/APIClient.js';
import './_Components.css';
import starOff from '../assets/starOff.png';
import starOn from '../assets/starOn.png';
import {toast} from 'react-toastify';


class FavResult extends Component {
    constructor(props) {
        super(props);
        this.state = {isFav : [], podcasts: []};
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e, index, item) {
        e.preventDefault();

        const newFav = [...this.state.isFav]
        newFav[index] = !this.state.isFav[index]

        if(!newFav[index]) {
            APIClient.removeFavoritePodcastById(item.id).then(response => {
                toast("Removed from Favorites", {className: 'popup'});
            });
        } else {
            APIClient.addFavoritePodcastById(item.id).then(response => {
                toast("Added to Favorites", {className: 'popup'});
            });
        }   
        this.setState(state => ({
            isFav: newFav
        }));
    }

    formatTitle(item) {
        // Add department and coursenum
        let fulltitle = item.department + ' ' + item.course_num;

        // Add truncated coursename
        var coursename = item.title;
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

    componentDidMount() {
        APIClient.getFavoritePodcasts().then(response => {
            this.setState({podcasts: response});
            this.setState({isFav: this.state.podcasts.map((element) => true)});
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
                                <div className='each'>
                                    <div>{this.formatTitle(item)}
                                        <img onClick={(e) => {this.handleClick(e, index, item)}}
                                        src={this.state.isFav[index] ? starOn : starOff}
                                        alt="" width="58" height="58"/>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
}



 export default FavResult;
