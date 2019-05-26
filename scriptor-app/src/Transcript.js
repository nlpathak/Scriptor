import React, {Component} from 'react';
import queryString from 'query-string';
import APIClient from './api/APIClient.js';
import './Transcript.css';

class Transcript extends Component {
    values = queryString.parse(this.props.location.search);

    state = {
        transcript: null
    };

    // TODO: How should we render response.transcript_sections instead of just the full_transcript?
    // response.transcript_sections is a list of strings representing the entire podcast split into paragraphs (ie. each string in transcript_sections is a paragraph).

    componentDidMount() {
        APIClient.getPodcastTranscript(this.values.podcast_id).then(response => {
            this.setState({transcript: response.full_transcript})
        });
    }
    
    render() {
        return(
            <div>
                {this.state.transcript}
            </div>
        );
    }
}

export default Transcript;
