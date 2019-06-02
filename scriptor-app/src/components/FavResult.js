import React, {Component} from 'react';
import APIClient from '../api/APIClient.js';
import './_Components.css';
import starOff from '../assets/starOff.png';
import starOn from '../assets/starOn.png';
import {toast} from 'react-toastify';
import {Link} from "react-router-dom";


class FavResult extends Component {
    constructor(props) {
        super(props);
        this.state = {isFav: [], favorites: []};
        this.handleClick = this.handleClick.bind(this);
    }

    static formatTitle(item) {
        // Add department and coursenum
        let fulltitle = item.department + ' ' + item.course_num;

        // Add truncated coursename
        var coursename = item.title;
        if (coursename.length > 25) {
            coursename = coursename.substring(0, 25) + '...';
        }
        fulltitle += ' - ' + coursename;

        // Add section id
        var quarter = item.quarter;
        quarter = quarter.substring(0, 2).toUpperCase() + quarter.substring(quarter.length - 2, quarter.length);
        fulltitle += ' [' + item.section_id + '-' + quarter + ']';

        // Add truncated professor
        var professor = item.professor;
        // Swaps first and last name
        professor = professor.substring(professor.indexOf(',') + 1, professor.length) + " " +
        professor.substring(0, professor.indexOf(','));
        if (professor.length > 25) {
            professor = professor.substring(0, 25) + '...';
        }
        fulltitle += ' | ' + professor;

        // Add lecturenum
        fulltitle += ' | Lecture ' + item.lecture_num;

        return fulltitle;
    }

    static isPodcastInList(list, podcast) {
        for (var i = 0; i < list.length; i++) {
            if (podcast.id === list[i].id) {
                return true;
            }
        }
        return false;
    }

    handleClick(e, index, item) {
        e.preventDefault();

        const newFav = [...this.state.isFav];
        newFav[index] = !this.state.isFav[index];

        if (!newFav[index]) {
            APIClient.removeFavoritePodcastById(item.favorite_podcast.id, item.favorite_blob.id).then(response => {
                toast("Removed from Favorites", {className: 'popup'});
            });
        } else {
            APIClient.addFavoritePodcastById(item.favorite_podcast.id, item.favorite_blob.id).then(response => {
                toast("Added to Favorites", {className: 'popup'});
            });
        }

        this.setState(state => ({
            isFav: newFav
        }));
    }

    componentDidMount() {
        APIClient.getFavoritePodcasts().then(response => {
            console.log(response);
            let favorites = [];
            for (var i = 0; i < response.length; i++) {
                if (!FavResult.isPodcastInList(favorites, response[i].favorite_podcast))
                    favorites.push(response[i]);
            }
            this.setState({favorites: favorites});
            this.setState({isFav: favorites.map((element) => true)});
        });
    }

    render() {

        if (this.state.favorites.length <= 0) {

            return (
                <div className='favorites'>
                    <div className='header'>
                        <h1>FAVORITES</h1>
                    </div>

                    <div className="row mt-5 justify-content-center">
                        <div className="col text-center">
                            <h3>Got any favorites?
                                <br/>
                                <small className="text-muted" style={{fontSize: "65%"}}>
                                    Once you favorite a podcast snippet, you'll see it here.
                                </small>
                            </h3>
                        </div>
                    </div>
                </div>
            );

        } else {

            return (
                <div className='favorites'>
                    <div className='header'>
                        <h1>FAVORITES</h1>
                    </div>
                    <div className='favList mt-4'>
                        <ul>
                            {this.state.favorites.map((item, index) => (
                                <li className='favResult' key={index}>
                                    <div className='each'>
                                        <div className="row">
                                            <div className="col-8">
                                                <Link to={{
                                                    pathname: '/podcast',
                                                    search: "?blob_id=" + item.favorite_blob.id
                                                }} style={{color: 'rgba(72,136,163,.93)'}}>
                                                    {FavResult.formatTitle(item.favorite_podcast)}
                                                </Link>
                                            </div>
                                            <div className="col-4">
                                                <img onClick={(e) => {
                                                    this.handleClick(e, index, item)
                                                }}
                                                     src={this.state.isFav[index] ? starOn : starOff}
                                                     alt="" width="58" height="58"/>
                                            </div>
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
}


export default FavResult;
