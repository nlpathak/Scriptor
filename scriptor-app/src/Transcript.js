import React, {Component} from 'react';
import queryString from 'query-string';
import APIClient from './api/APIClient.js';
import './Transcript.css';

class Transcript extends Component {
    values = queryString.parse(this.props.location.search);

    state = {
        transcript: null
    };

    componentDidMount() {
        APIClient.getPodcastTranscript(this.values.podcast_id).then(response => {
            this.setState({transcript: response})
        }).catch(e => {
            console.log(e);
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
