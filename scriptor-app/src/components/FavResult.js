import React, {Component} from 'react';
import ReactList from 'react-list';
import './_Components.css';
/*
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import SvgIcon from '@material-ui/core/SvgIcon';
import { withStyles } from '@material-ui/core/styles';
*/
import ListGroup from 'react-bootstrap/ListGroup'

import starOff from './starOff.svg';
import starOn from './starOn.svg';
import { Link } from "react-router-dom";





const list = [
  {
      "lecture_num": 1,
      "date": "04/02/2019",
      "audio_url": "https://podcast.ucsd.edu/Podcasts//sp19/bibc120_a00_q9av2ugvff/bibc120_a00-04022019-1400.mp3",
      "video_url": "https://podcast.ucsd.edu/Podcasts//sp19/bibc120_a00_q9av2ugvff/bibc120_a00-04022019-1400.mp4",
      "professor": "Hampton, Randolph Y.",
      "quarter": "Spring 2019",
      "course_name": "Nutrition",
      "department": "BIBC",
      "course_num": 120,
      "section_id": "A00"
  },
  {
      "lecture_num": 1,
      "date": "01/08/2019",
      "audio_url": "http://podcast-media.ucsd.edu/Podcasts/wi19/cogs9_a00_ccorforpav/cogs9_a00-01082019-1100.mp3",
      "video_url": "http://podcast-media.ucsd.edu/Podcasts/wi19/cogs9_a00_ccorforpav/cogs9_a00-01082019-1100.mp4",
      "professor": "Ellis, Shannon Elizabeth",
      "quarter": "Winter 2019",
      "course_name": "Introduction to Data Science",
      "department": "COGS",
      "course_num": 9,
      "section_id": "A00"
  },

]

//Hardcode data
/*
this.props  = {
    "lecture_num": 1,
    "date": "04/02/2019",
    "audio_url": "https://podcast.ucsd.edu/Podcasts//sp19/bibc120_a00_q9av2ugvff/bibc120_a00-04022019-1400.mp3",
    "video_url": "https://podcast.ucsd.edu/Podcasts//sp19/bibc120_a00_q9av2ugvff/bibc120_a00-04022019-1400.mp4",
    "professor": "Hampton, Randolph Y.",
    "quarter": "Spring 2019",
    "course_name": "Nutrition",
    "department": "BIBC",
    "course_num": 120,
    "section_id": "A00"
};
*/

const List = ({ list }) => (
  <ul>
    {list.map(item => (
      <ListItem key={item.id} item={item} />
    ))}
  </ul>
);

const ListItem = ({ item }) => (
  <li>
    <div>{item.professor}</div>
    <div>{item.department}</div>
    <div>{item.video_url}</div>
    <div>{item.course_num}</div>
  </li>
);

class FavResult extends Component {

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

  unFavorite(e){
      e.preventDefault();
      alert('UNFAVORITE TEST');

  }

  renderItem(index, key) {
      return <div key={key}>{'CSE'}</div>;
  }


  render(){

      return(
          <div className='favorites'>
              <div className='header'>
                  <h1>FAVORITES</h1>
              </div>
              <div className = 'favList'>
                    <ul>
                    {list.map(item => (
                        <li className = 'favResult' key={item.audio_url}>
                            <a href={item.video_url}>
                                <div>{item.department + " " + item.professor }
                                    <img onClick={e => this.unFavorite(e)}
                                     src={starOn} alt="" width="48" height="48" />
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
