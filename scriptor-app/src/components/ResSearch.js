import React, {Component} from 'react';
import './_Components.css';
import { toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';
import APIClient from "../api/APIClient.js";



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
        departments: [],
        courses: [],
        quarters: [],
        professors: [],
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

    
    componentDidMount(){
        APIClient.searchProfessors("").then(response => {
            this.setState({professors: response})
            }  
       );
        APIClient.searchQuarters("").then(response => {
            this.setState({quarters: response})
        }  
       );
        APIClient.searchDepartments("").then(response => {
            this.setState({departments: response})
        }  
       );
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
                            {this.state.departments.map((item, index)  => (
                             <option key = {index} value={item}></option>
                            ))}
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
                            {this.state.professors.map((item, index)  => (
                             <option key = {index} value={item}></option>
                            ))}
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
                            {this.state.quarters.map((item, index)  => (
                             <option key = {index} value={item}></option>
                            ))}
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