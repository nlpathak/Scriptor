import React, {Component} from 'react';
import queryString from 'query-string';
import APIClient from './api/APIClient.js';
import './Transcript.css';

class Transcript extends Component {
    values = queryString.parse(this.props.location.search);

    state = {
        transcript: []
    };

    componentDidMount() {
        APIClient.getPodcastTranscript(this.values.podcast_id).then(response => {
            response.transcript_sections.forEach(element => {
                this.setState(prevState => ({transcript: [...prevState.transcript, element]}));
            });
        });
    }
    
    render() {
        return(
            <div className='transcript'>
                {this.state.transcript.map((result, index) => (
					<div key={index}>
                        {result}
                        <br></br>
                        <br></br>
					</div>			
				))}
            </div>
        );
    }
}

export default Transcript;
