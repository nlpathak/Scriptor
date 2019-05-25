import React, {Component} from 'react';
import './About.css';
import './Results.css';



class Results extends Component {
	constructor(props){
		super(props);
		console.log(this.props.location.state.results);
		this.state = {
			isLoaded: false,
		}
	}



	render(){
		var url = "";
		return (
			<div className = "results">
					{this.props.location.state.results.map((results, index) => (
						<div key={index}>
							<li className= "description"> {results.description}</li>
							<div className="times">
								<a className= "timeStamp" href= {results.url + "#t=" + results.timestamp} target="_blank"> {results.timestamp}</a> 
							</div>
							<li className= "blurb"> {results.blurb} </li>
							<div className ="spacer"></div>
						</div>			
				))}
			</div>
		);
	}
}



export default Results;