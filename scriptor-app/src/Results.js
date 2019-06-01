import React, {Component} from 'react';
import './About.css';
import './Results.css';
import {Link} from 'react-router-dom';
import ResSearch from './components/ResSearch.js';
import APIClient from './api/APIClient.js';
import queryString from 'query-string';


class Results extends Component {
	constructor(props){
		super(props);
		this.state = {
            results: []
		}
	}



componentDidMount(){
       var values = queryString.parse(this.props.location.search);
       if(values.query.length === 0) {
        document.getElementById('noResults').style.color = "rgba(207, 70, 70, 0.93)";
        document.getElementById('noResults').innerHTML = "Please enter a query.";
        return;
       }
        APIClient.searchPodcasts(values.query, {dept: values.department, course_num: values.course, professor: values.professor, quarter: values.quarter}).then(response => {
            if(response.length === 0){
                document.getElementById('noResults').style.color = "rgba(207, 70, 70, 0.93)";
                document.getElementById('noResults').innerHTML = "No results found.";
                return;
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
                    var prof = back.professor;
                    prof = prof.substring(prof.indexOf(',') + 1, prof.length) + " " +
                        prof.substring(0, prof.indexOf(','));
                    var result = {description: back.department + ' ' + back.course_num + " - " + back.title + " [" + back.section_id + " - " + qString + "] | " + prof + " | Lecture " + back.lecture_num, 
                        blurb: element.transcription_blob, 
                        timestamp: timeStamp, 
                        url: vidUrl,
                        podcast_id: element.podcast_id,
                        blob_id: element.id,
                        podcastPage: {
                            department: back.department,
                            course_num: back.course_num,
                            title: back.title,
                            section_id: back.section_id,
                            professor: prof,
                            lecture_num: back.lecture_num,
                            ucsd_podcast_video_url: back.ucsd_podcast_video_url,
                            starting_timestamp_second: element.starting_timestamp_second,
                            transcription_blob: element.transcription_blob,
                            ucsd_podcast_audio_url: back.ucsd_podcast_audio_url,
                        }
                    };
                    this.setState(prevState => ({results: [...prevState.results, result]}));
                    });
                });
        });
    }


	render(){
        var values = queryString.parse(this.props.location.search);
		return (
			<div className = "results">
                <ResSearch query={values.query} department={values.department} course={values.course}
                           quarter={values.quarter} professor={values.professor}/>
				{this.state.results.map((result, index) => (
					<div key={index}>
						<li className= "description"> 
                            <Link to={{ 
							pathname: '/podcast',
                            search:  
                            "?department=" + result.podcastPage.department 
                            + "&course_num=" + result.podcastPage.course_num
                            + "&title=" + encodeURIComponent(result.podcastPage.title)
                            + "&section_id=" + result.podcastPage.section_id
                            + "&professor=" + result.podcastPage.professor
                            + "&lecture_num=" + result.podcastPage.lecture_num
                            + "&ucsd_podcast_video_url=" + result.podcastPage.ucsd_podcast_video_url
                            + "&starting_timestamp_second=" + result.podcastPage.starting_timestamp_second
                            + "&transcription_blob=" + result.podcastPage.transcription_blob
                            + "&ucsd_podcast_audio_url=" + result.podcastPage.ucsd_podcast_audio_url
							+ "&podcast_id=" + result.podcast_id
							+ "&blob_id=" + result.blob_id
                             }}>
                             {result.description}
                            </Link> 
                         </li>
						<div className="times">
							<li className= "timeStamp"> 
                            <Link to={{ 
							pathname: '/podcast',
                            search:  
                            "?department=" + result.podcastPage.department 
                            + "&course_num=" + result.podcastPage.course_num
                            + "&title=" + encodeURIComponent(result.podcastPage.title)
                            + "&section_id=" + result.podcastPage.section_id
                            + "&professor=" + result.podcastPage.professor
                            + "&lecture_num=" + result.podcastPage.lecture_num
                            + "&ucsd_podcast_video_url=" + result.podcastPage.ucsd_podcast_video_url
                            + "&starting_timestamp_second=" + result.podcastPage.starting_timestamp_second
                            + "&transcription_blob=" + result.podcastPage.transcription_blob
                            + "&ucsd_podcast_audio_url=" + result.podcastPage.ucsd_podcast_audio_url
                            + "&podcast_id=" + result.podcast_id
                            + "&blob_id=" + result.blob_id
                             }}>
                             {result.timestamp}
                            </Link > 
							</li> 
						</div>
						<li className= "blurb"> {result.blurb} </li>
						<div className ="spacer"></div>
					</div>			
				))}
			</div>
		);
	}
}


export default Results;