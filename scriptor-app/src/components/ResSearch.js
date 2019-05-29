import React, {Component} from 'react';
import './_Components.css';
import { toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';


class ResSearch extends Component {
    query = "";
    noResponse = false;
    state = {
        query: '',
        department: '',
        course: '',
        professor: '',
        quarter: '',
        showFilters: false,
        results: [],
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
     this.props.history.push({
     search:
        "?query=" + this.state.query
        + "&department=" + this.state.department
        + "&course=" + this.state.course
        + "&professor=" + this.state.professor
        + "&quarter=" + this.state.quarter,
     state: {query: this.state.query, department: this.state.department, course: this.state.course, professor: this.state.professor, quarter: this.state.quarter}
    })
 }

    
    handleEnter = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            toast("Press the Search Button", {className: 'popup'});
         }
    }
    
    render() {                   
        let filters;
        if(this.state.showFilters) {
            filters = 
                <div className='resfilters'>
                    <div className='resfilterinputs'>
                        <input 
                            type = 'text'
                            className ='resfilterbar' 
                            name = 'department'
                            list = 'department'
                            value = {this.state.department} 
                            onChange={e => this.change(e)} 
                            onKeyDown={e => this.handleEnter(e)}/>
                        <datalist id="department">
                             <option value="CSE"></option>
                             <option value="MATH"></option>
                             <option value="CHEM"></option>
                             <option value="COGS"></option>
                             <option value="BIBC"></option>
                        </datalist>
                        <input 
                            type = 'text'
                            className ='resfilterbar' 
                            name = 'course'
                            list = 'course_number'
                            value = {this.state.course} 
                            onChange={e => this.change(e)} 
                            onKeyDown={e => this.handleEnter(e)} />
                        <datalist id="course_number">
                             <option value="183"></option>
                             <option value="190"></option>
                             <option value="20"></option>
                             <option value="101"></option>
                             <option value="9"></option>
                             <option value="120"></option>
                             <option value="4"></option>
                             <option value="18"></option>
                        </datalist>
                        <input 
                            type = 'text'
                            className ='resfilterbar' 
                            name = 'professor'
                            list = 'professor'
                            value = {this.state.professor} 
                            onChange={e => this.change(e)} 
                            onKeyDown={e => this.handleEnter(e)} />
                        <datalist id="professor">
                             <option value="Miles Jones"></option>
                             <option value="Garrison Cottrell"></option>
                             <option value="Carl Hoeger"></option>
                             <option value="Todd Kemp"></option>
                             <option value="Randolph Hampton"></option>
                             <option value="David Quarfoot"></option>
                        </datalist>
                        <input 
                            type = 'text'
                            className ='resfilterbar' 
                            name = 'quarter'
                            list = 'quarter'
                            value = {this.state.quarter} 
                            onChange={e => this.change(e)} 
                            onKeyDown={e => this.handleEnter(e)} />
                         <datalist id="quarter">
                             <option value="Fall 2018"></option>
                             <option value="Spring 2018"></option>
                             <option value="Winter 2018"></option>
                             <option value="Fall 2019"></option>
                             <option value="Winter 2019"></option>
                             <option value="Spring 2019"></option>
                        </datalist>
                    </div>
                    <p style={{marginTop: '5px'}}>Department</p>
                    <p>Course Number</p>
                    <p>Professor</p>
                    <p>Quarter</p>
                    
                </div>
        } else {
            filters = null;
        }

        return (
            <div className={'ressearchform'}>
                <form className='col-xs-1 text-center'>
                    <input 
                    type = 'text'
                    className ='ressearchbar' 
                    name = 'query'
                    placeholder = "Keep Learning?"
                    value = {this.state.query} 
                    onChange={e => this.change(e)} />
                    <p id="noResults"></p>
                    {filters}
                    <button className='rescenter' onClick={e => this.onSubmit(e)}>Search</button>


                </form> 
            </div>
        )
    }
}

export default withRouter(ResSearch);