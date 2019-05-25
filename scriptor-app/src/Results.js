import React, {Component} from 'react';
import './About.css';
import './Results.css';



class Results extends Component {
constructor(props){
	super(props);
	console.log(this.props.location.state.results[0]);
	this.state = {
		isLoaded: false,
	}

}



render(){
	return (
     <div className = "results">
      	{this.props.location.state.results.map((results, index) => (
      		<div key={index}>
        		<li className= "description"> {results.Description}</li>
        		<div className="times">
				<a className= "timeStamp" href="https://www.w3schools.com" target="_blank"> {results.Timestamp}</a> 
				</div>
        		<li className= "blurb"> {results.Blurb} </li>
        		<div className ="spacer"></div>
        	</div>			
      ))}
    </div>
    )
  }
}



export default Results;