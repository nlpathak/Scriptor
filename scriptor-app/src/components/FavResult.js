import React, {Component} from 'react';
import ReactList from 'react-list';
import './_Components.css';


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

  unFavorite(){

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
              <div style={{overflow: 'auto', maxHeight: 400}}>
                    <ReactList
                        itemRenderer={this.renderItem}

                        //Change this length to the user's total number of favorites
                        length = '20'
                        type = 'uniform'
                    />
              </div>
          </div>
      );
  }
}


export default FavResult;
