import React, {Component} from 'react';
import './_Components.css';

class Search extends Component {
    state = {
        query: ''
    };

    change = e => {
        this.setState({[e.target.name]: e.target.value});
    }

    onSubmit() {
        console.log(this.state);
    }
    
    render() {
        return (
            <form className='col-xs-1 text-center'>
                <h1 className='title'>SCRIPTOR</h1>
                <input 
                className='searchbar' 
                name = 'query'
                placeholder = 'What do you want to learn?' 
                value={this.state.query} 
                onChange={e => this.change(e)} />
                <br></br>
                <button className='center button_fat' onClick={() => this.onSubmit()}>Submit</button>
            </form> 
        )
    }
}

export default Search;