import React, {Component} from 'react';
import ReactList from 'react-list';
import './_Components.css';
import ListGroup from 'react-bootstrap/ListGroup'
import starOff from './starOff.svg';
import starOn from './starOn.svg';
import { Link } from "react-router-dom";
//Hard coded fav data
import { course_podcasts } from "./favData.json"


var podcasts = course_podcasts.map((item, index) =>
    <div key={index}>
        {1}
    </div>
);


class FavResult extends Component {

    toggleFav (e, index) {
      e.preventDefault();
      alert("Unfavorite test")
      podcasts[index] = podcasts[index] ? 0 : 1;
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


  render(){


      return(
          <div className='favorites'>
              <div className='header'>
                  <h1>FAVORITES</h1>
              </div>
              <div className = 'favList'>
                    <ul>
                    {course_podcasts.map((item, index)  => (
                        <li className = 'favResult' key={index}>
                            <a href={item.video_url}>
                                <div>{this.formatTitle(item)    }
                                    <img onClick={e => this.toggleFav(e, index)}
                                    src={podcasts[index] ? starOn : starOff}
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
