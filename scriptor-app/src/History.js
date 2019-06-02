import React, {Component} from 'react';
import APIClient from './api/APIClient.js';
import './History.css';
import {toast} from 'react-toastify';
import {Link} from "react-router-dom";


class History extends Component {
    state = {
        queries: [],
        podcasts: []
    };

    static returnURL(item) {
        if (item.video_url.length < 1) {
            item.video_url = item.audio_url
        }
        return item.video_url
    }

    static formatName(podcast) {
        const quarter = podcast.quarter.split(' ');
        const qString = quarter[0].substr(0, 1) + quarter[1].substr(2, 3);
        var prof = podcast.professor;
        prof = prof.substring(prof.indexOf(',') + 1, prof.length) + " " +
            prof.substring(0, prof.indexOf(','));
        return podcast.department + ' ' + podcast.course_num + " - " + podcast.title + " [" + podcast.section_id + " - " + qString + "] | " + prof + " | Lecture " + podcast.lecture_num
    }

    static areObjectsEqual(o1, o2) {
        for (var k in o1) {
            if (o2[k] !== o1[k])
                return false;
        }
        return true;
    }

    static getSearchQueryURL(item) {
        var url = "?query=" + item.search_query;
        if (item.search_filters) {
            let filters = item.search_filters;
            if (filters.dept) {
                url += "&department=" + filters.dept;
            }
            if (filters.course_num) {
                url += "&course=" + filters.course_num;
            }
            if (filters.professor) {
                url += "&professor=" + filters.professor;
            }
            if (filters.quarter) {
                url += "&quarter=" + filters.quarter;
            }
        }
        return url;
    }

    static getSearchTitle(item) {
        let filters = item.search_filters;
        let filterNames = Object.keys(filters);

        if (filterNames.length === 0) {
            return (
                <div>
                    <h3>
                        {item.search_query}
                    </h3>
                </div>
            );
        }


        var filtered_str = "";

        let numFilters = filterNames.length;
        var currentfilterIdx = 0;

        for (var i = 0; i < filterNames.length; i++) {
            let filter = filterNames[i];
            let filterVal = filters[filter];

            if (filter === "dept") {
                filtered_str += "Department: " + filterVal;
            } else if (filter === "course_num") {
                filtered_str += "Course number: " + filterVal;
            } else if (filter === "professor") {
                filtered_str += "Professor: " + filterVal;
            } else if (filter === "quarter") {
                filtered_str += "Quarter: " + filterVal;
            }

            if (currentfilterIdx !== numFilters - 1) {
                filtered_str += ", ";
            }
            currentfilterIdx += 1;
        }

        return (
            <div>
                <h3>
                    {item.search_query}
                    <br/>
                    <p className="mt-2 text-muted" style={{fontSize: "50%"}}>
                        <b><i>{filtered_str}</i></b>
                    </p>
                </h3>
            </div>
        );
    }

    static getPodcastURL(item) {
        return "?blob_id=" + item.blob_id;
    }

    doesSearchQueryExistInHistory(element) {
        for (var i = 0; i < this.state.queries.length; i++) {
            let query = this.state.queries[i];
            if (query.search_query === element.search_query && query.type === element.type && History.areObjectsEqual(element.search_filters, query.search_filters)) {
                return true;
            }
        }
        return false;
    }

    doesPodcastExistInHistory(element) {
        for (var i = 0; i < this.state.podcasts.length; i++) {
            if (this.state.podcasts[i].podcast.id === element.podcast.id)
                return true;
        }
        return false;
    }

    componentDidMount() {
        APIClient.getHistory().then(response => {
            console.log(response);
            response.forEach(element => {
                if (element.type === 'SEARCH_QUERY') {
                    if (!this.doesSearchQueryExistInHistory(element)) {
                        this.setState(prevState => ({queries: [...prevState.queries, element]}));
                    }
                } else {
                    if (!this.doesPodcastExistInHistory(element)) {
                        this.setState(prevState => ({podcasts: [...prevState.podcasts, element]}));
                    }
                }
            });
        });
    }

    onClear(e) {
        APIClient.clearHistory().then(() => {
            this.setState({queries: []});
            this.setState({podcasts: []});
            toast("History Cleared", {className: 'popup'});
        });
    }

    renderSearchHistory() {
        if (this.state.queries.length <= 0) {
            return (<div className="row justify-content-center" style={{marginTop: "100px"}}>
                <div className="col text-center">
                    <h4>It's empty here.
                        <br/>
                        <small className="text-muted" style={{fontSize: "65%"}}>
                            This is where you'll see your most recent searches.
                        </small>
                    </h4>
                </div>
            </div>);
        } else {
            return (
                <div className="mt-4">
                    <ul style={{"list-style": "none"}}>
                        {this.state.queries.map((item, index) => (

                            <Link to={{
                                pathname: '/results',
                                search: History.getSearchQueryURL(item)
                            }} style={{color: 'rgba(72,136,163,.93)'}}>

                                <li className="mt-4 mb-4" key={index}>
                                    {History.getSearchTitle(item)}
                                </li>

                            </Link>

                        ))}
                    </ul>
                </div>
            )
        }
    }

    renderPodcastHistory() {
        if (this.state.podcasts.length <= 0) {
            return (<div className="row justify-content-center" style={{marginTop: "100px"}}>
                <div className="col text-center">
                    <h4>It's empty here.
                        <br/>
                        <small className="text-muted" style={{fontSize: "65%"}}>
                            This is where you'll see your recently-viewed podcasts.
                        </small>
                    </h4>
                </div>
            </div>);
        } else {
            return (<div className="mt-4">
                <ul style={{"list-style": "none"}}>
                    {this.state.podcasts.map((item, index) => (
                        <Link to={{
                            pathname: '/podcast',
                            search: History.getPodcastURL(item)
                        }} style={{color: 'rgba(72,136,163,.93)'}}>
                            <li className="mt-4 mb-4" key={index}>
                                <h3>{History.formatName(item.podcast)}</h3>
                            </li>
                        </Link>
                    ))}
                </ul>
            </div>);
        }
    }

    render() {
        if (APIClient.isCurrentUserLoggedIn()) {

            return (
                <div className="history">
                    <div className='header'>
                        <h1>HISTORY</h1>
                        <button className='center' onClick={e => this.onClear(e)}>Clear</button>
                    </div>
                    <div className="row mt-3">
                        <div className="col-3">
                            <h2>You've Searched For...</h2>
                            {this.renderSearchHistory()}
                        </div>
                        <div className="col">
                            <h2>You've Found...</h2>
                            {this.renderPodcastHistory()}
                        </div>
                    </div>
                </div>
            );
        } else {
            window.location.assign('/');
        }
    }
}

export default History;
