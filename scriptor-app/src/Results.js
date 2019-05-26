import React, {Component} from 'react';
import './About.css';
import './Results.css';
import { Link } from 'react-router-dom';



class Results extends Component {
    search = this.props.location.state.results.podcastPage;
	constructor(props){
		super(props);
		this.state = {
			isLoaded: false,
		}
	}



	render(){
		return (
			<div className = "results">
				{this.props.location.state.results.map((result, index) => (
					<div key={index}>
						<li className= "description"> 
                            <Link to={{ 
							pathname: '/podcast',
                            search:  
                            "?department=" + result.podcastPage.department 
                            + "&course_num=" + result.podcastPage.course_num
                            + "&title=" + result.podcastPage.title
                            + "&section_id=" + result.podcastPage.section_id
                            + "&professor=" + result.podcastPage.professor
                            + "&lecture_num=" + result.podcastPage.lecture_num
                            + "&ucsd_podcast_video_url=" + result.podcastPage.ucsd_podcast_video_url
                            + "&starting_timestamp_second=" + result.podcastPage.starting_timestamp_second
                            + "&transcription_blob=" + result.podcastPage.transcription_blob
                            + "&ucsd_podcast_audio_url=" + result.podcastPage.ucsd_podcast_audio_url
                            + "&podcast_id=" + result.podcastPage.podcast_id,
                             }}>
                             {result.description}
                            </Link> 
                         </li>
						<div className="times">
							<a className= "timeStamp" href= {result.url + "#t=" + result.timestamp} target="_blank" rel="noopener noreferrer"> {result.timestamp}</a> 
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