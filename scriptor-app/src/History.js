import React, {Component} from 'react';
import APIClient from './api/APIClient.js';
import './History.css';
import {toast} from 'react-toastify';


class History extends Component {
  state = {
    queries: [],
    podcasts: []
  };
  
  returnURL(item){
      if(item.video_url.length < 1){
          item.video_url = item.audio_url
      }
      return item.video_url
  }

  formatName(back){
    const quarter = back.quarter.split(' ');
    const qString = quarter[0].substr(0,1) + quarter[1].substr(2,3);
    var prof = back.professor;
    prof = prof.substring(prof.indexOf(',') + 1, prof.length) + " " +
        prof.substring(0, prof.indexOf(','))
    return back.department + ' ' + back.course_num + " - " + back.title + " [" + back.section_id + " - " + qString + "] | " + prof + " | Lecture " + back.lecture_num
  }

  componentDidMount() {
    APIClient.getHistory().then(response => {
      response.forEach(element => {
        console.log(element);
        if(element.type === 'SEARCH_QUERY') {
          if(this.state.queries.indexOf(element.title) === -1) {
            this.setState(prevState => ({queries: [...prevState.queries, element.title]}));
          }
        } else {
            const name = this.formatName(element);
            if(this.state.podcasts.indexOf(name) === -1) {
              this.setState(prevState => ({podcasts: [...prevState.podcasts, name]}));
            }
        }
      });
    });
  }

  onClear(e) {
    APIClient.clearHistory();
    this.setState({queries: []}); 
    this.setState({podcasts: []});
    toast("History Cleared", {className: 'popup'});
  }

  render() {
    if(APIClient.isCurrentUserLoggedIn()) {
      return (
        <div className = "history">
          <div className='header'>
            <h1>HISTORY</h1>
            <button className='center' onClick={e => this.onClear(e)}>Clear</button>
          </div>
          <div className = "search" >
            <h1> You've Searched For...
              <div>
                <ul>
                {this.state.queries.map((item, index)  => (
                  <li className = 'searches' key={index}>
                    <div>
                      {item}
                    </div>
                  </li>
                ))}
                </ul>
              </div>
            </h1>
            <h2>You've Found...
                <div>
                  <ul>
                  {this.state.podcasts.map((item, index)  => (
                    <li className = 'results' key={index}>
                      <div>{item}</div>
                    </li>
                  ))}
                </ul>
                </div>
              </h2>
          </div>
        </div>
      );
    } else {
      window.location.assign('/');
    }
  }
}
export default History;
