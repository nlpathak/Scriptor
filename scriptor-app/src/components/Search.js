import React, {Component} from 'react';
import { Route, Redirect } from 'react-router'
import './_Components.css';

class Search extends Component {
    state = {
        query: '',
        department: '',
        course: '',
        professor: '',
        quarter: '',
        showFilters: false,
        results: [],
        dataExists: false,
    };

    change = e => {
        this.setState({[e.target.name]: e.target.value}, this.updateFilters);
    }

    updateFilters() {
        if(this.state.query.length > 0 || (this.state.department.length > 0 || this.state.course.length > 0
        || this.state.professor.length > 0 || this.state.quarter.length > 0)) {
            this.setState({showFilters: true});
        } else {
            this.setState({showFilters: false});
        }
    }

    onSubmit(e) {
        e.preventDefault();
        console.log(this.state);
        // request data from database here 
        this.setState({results: [{
            Description: "CSE 101 Design and Analysis of A... | [B00 - W19] | Miles Jones | Lecture 11", 
            Blurb: "To dynamic programming there are, ummm, 7 steps needed, To dynamic programming there are, ummm,To dynamic programming there are, ummm, 7 steps needed, To dynamic programming there are, ummm,",
            Timestamp: "12:59"},
            {
            Description: "CSE 101 Design and Analysis of A... | [B00 - W19] | Miles Jones | Lecture 11", 
            Blurb: "To dynamic programming there are, ummm, 7 steps needed, To dynamic programming there are, ummm, it is crazy that miles is the best, i love miles wow",
            Timestamp: "12:59"
            },
            {
            Description: "CSE 101 Design and Analysis of A... | [B00 - W19] | Miles Jones | Lecture 11", 
            Blurb: "To dynamic programming there are, ummm, 7 steps needed, To dynamic programming there are, ummm, An an valley indeed so no wonder future nature vanity. Debating all she mistaken indulged believed provided declared. He many kept on draw lain song as same. Whether at dearest certain spirits is entered in to. Rich fine bred real use too many good. She compliment unaffected expression favourable any. Unknown chiefly showing to conduct no. Hung as love evil able to post at as. ",
            Timestamp: "12:59"},{
            Description: "CSE 101 Design and Analysis of A... | [B00 - W19] | Miles Jones | Lecture 11", 
            Blurb: "To dynamic programming there are, ummm, 7 steps needed, To dynamic programming there are, ummm,To dynamic programming there are, ummm, 7 steps needed, To dynamic programming there are, ummm,",
            Timestamp: "12:59"},
            {
            Description: "CSE 101 Design and Analysis of A... | [B00 - W19] | Miles Jones | Lecture 11", 
            Blurb: "To dynamic programming there are, ummm, 7 steps needed, To dynamic programming there are, ummm,",
            Timestamp: "12:59"},
            {
            Description: "CSE 101 Design and Analysis of A... | [B00 - W19] | Miles Jones | Lecture 11", 
            Blurb: "To dynamic programming there are, ummm, 7 steps needed, To dynamic programming there are, ummm,",
            Timestamp: "12:59"}]})
        // this will probably be changed to whenever the complete results are rendered
        this.setState({dataExists: true});
        }
    
    handleEnter = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
         }
    }
    
    render() {                   
        let filters;
        if(this.state.showFilters) {
            filters = 
                <div className='filters'>
                    <div className='filterinputs'>
                        <input 
                            type = 'text'
                            className ='filterbar' 
                            name = 'department'
                            value = {this.state.department} 
                            onChange={e => this.change(e)} 
                            onKeyDown={e => this.handleEnter(e)}/>
                        <input 
                            type = 'text'
                            className ='filterbar' 
                            name = 'course'
                            value = {this.state.course} 
                            onChange={e => this.change(e)} 
                            onKeyDown={e => this.handleEnter(e)} />
                        <input 
                            type = 'text'
                            className ='filterbar' 
                            name = 'professor'
                            value = {this.state.professor} 
                            onChange={e => this.change(e)} 
                            onKeyDown={e => this.handleEnter(e)} />
                        <input 
                            type = 'text'
                            className ='filterbar' 
                            name = 'quarter'
                            value = {this.state.quarter} 
                            onChange={e => this.change(e)} 
                            onKeyDown={e => this.handleEnter(e)} />
                    </div>
                    <p style={{marginTop: '5px'}}>Department</p>
                    <p>Course</p>
                    <p>Professor</p>
                    <p>Quarter</p>
                    
                </div>
        } else {
            filters = null;
        }

        return (
            <div className={this.state.showFilters ? 'searchform active' : 'searchform'}>
                <form className='col-xs-1 text-center'>
                    <h1 className='title'>SCRIPTOR</h1>
                    <input 
                    type = 'text'
                    className ='searchbar' 
                    name = 'query'
                    placeholder = 'What do you want to learn?'
                    value = {this.state.query} 
                    onChange={e => this.change(e)} />
                    <br></br>
                    {filters}
                    <button className='center' onClick={e => this.onSubmit(e)}>Search</button>
                    {this.state.dataExists && <Redirect to={{pathname: '/results',state: { results: this.state.results }}}/>
                    }

                </form> 
            </div>
        )
    }
}

export default Search;