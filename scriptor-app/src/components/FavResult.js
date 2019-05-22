import React, {Component} from 'react';
import ReactList from 'react-list';
import './_Components.css';
import List from '@material-ui/core/List';
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import SvgIcon from '@material-ui/core/SvgIcon';
import { withStyles } from '@material-ui/core/styles';
import starOff from './starOff.svg';
import starOn from './starOn.svg';
import { Link } from "react-router-dom";




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

//Change the style
const styles = {
    root: {

    },
    disabled: {},
};

//Generates list for favResult
function generate(element) {
    return [0, 1, 2].map(value =>
        React.cloneElement(element, {
            key: value
        })
    );
}

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

  //Initializes state as not dense
  state = {
    dense: false,
  };


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

      const { dense } = this.state;
      return(
          <div className='favorites'>
              <div className='header'>
                  <h1>FAVORITES</h1>
              </div>
              <div className='FavList'>
                  <List dense={dense}>
                      {generate(
                            //Hard code link
                            <ListItem button component="a" href="https://podcast.ucsd.edu/Podcasts//sp19/bibc120_a00_q9av2ugvff/bibc120_a00-04022019-1400.mp4">
                                //Hard code BIBC
                                <ListItemText primary="BIBC" />

                                <ListItemSecondaryAction>
                                    <IconButton onClick={e => this.unFavorite(e)}>
                                          <img src={starOn} alt="" width="36" height="36" />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                      )}
                  </List>
              </div>
          </div>
        );
    }
}


 export default withStyles(styles)(FavResult);
