import React, {Component} from 'react';
import './_Components.css';
import {withRouter} from 'react-router-dom';
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
        course_codes: {},
        depExists: false,
        course_numbers: [],

    };

    change = e => {
        this.setState({[e.target.name]: e.target.value}, this.updateFilters);
    };
    handleEnter = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.onSubmit(e);
        }
    };

    updateFilters() {
        if (this.state.query.length > 0 || (this.state.department.length > 0 || this.state.course.length > 0
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
            state: {
                query: this.state.query,
                department: this.state.department,
                course: this.state.course,
                professor: this.state.professor,
                quarter: this.state.quarter
            }
        })
    }

    checkDepExists(dep) {
        if (!dep)
            return false;
        if (this.state.course_codes.hasOwnProperty(dep.toUpperCase())) {
            return true;
        } else {
            return false;
        }
    }

    handleClick(e) {
        e.preventDefault();
        this.setState({showFilters: true});
    }

    componentDidMount() {
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
        APIClient.getAllCourseCodes().then(response => {
            var course_to_codes = {};
            for (var i = 0; i < response.length; i++) {
                var split = response[i].split(' ');
                if (!course_to_codes.hasOwnProperty(split[0])) {
                    course_to_codes[split[0].trim()] = [split[1].trim()];
                } else {
                    course_to_codes[split[0].trim()].push(split[1].trim());
                    course_to_codes[split[0].trim()].sort(function(a, b){return a-b});
                }
            }
            this.setState({course_codes: course_to_codes})
            }
        );

        this.setState({
            query: this.props.query || "",
            department: this.props.department || "",
            course: this.props.course || "",
            quarter: this.props.quarter || "",
            professor: this.props.professor || ""
        });
    }

    render() {
        var course_numbers = [];
        let filters;
        if (this.state.showFilters) {
            filters =
                <div className='resfilters'>
                    <div className='resfilterinputs'>
                        <input
                            autoComplete='off'
                            type='text'
                            className='resfilterbar'
                            name='department'
                            list='department'
                            value={this.state.department}
                            onChange={e => this.change(e)}
                            onKeyDown={e => this.handleEnter(e)}/>
                        <datalist id="department">
                            {this.state.departments.map((item, index) => (
                                <option key={index} value={item}></option>
                            ))}
                        </datalist>
                        <input
                            autoComplete='off'
                            type='text'
                            className={!this.checkDepExists(this.state.department) ? 'course_number' : 'course_number_active'}
                            name='course'
                            list='course_number'
                            disabled={this.state.department.length === 0 ? true : false}
                            value={this.state.course}
                            onChange={e => this.change(e)}
                            onKeyDown={e => this.handleEnter(e)}/>
                        <datalist id="course_number">
                            {this.checkDepExists(this.state.department) ? course_numbers = this.state.course_codes[this.state.department.toUpperCase()] : course_numbers = []}
                            {course_numbers.map((item, index) => (
                                <option key={index} value={item}></option>
                            ))}
                        </datalist>
                        <input
                            autoComplete='off'
                            type='text'
                            className='resfilterbar'
                            name='professor'
                            list='professor'
                            value={this.state.professor}
                            onChange={e => this.change(e)}
                            onKeyDown={e => this.handleEnter(e)}/>
                        <datalist id="professor">
                            {this.state.professors.map((item, index) => (
                                <option key={index} value={item}></option>
                            ))}
                        </datalist>
                        <input
                            autoComplete='off'
                            type='text'
                            className='resfilterbar'
                            name='quarter'
                            list='quarter'
                            value={this.state.quarter}
                            onChange={e => this.change(e)}
                            onKeyDown={e => this.handleEnter(e)}/>
                        <datalist id="quarter">
                            {this.state.quarters.map((item, index) => (
                                <option key={index} value={item}></option>
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
                        type='text'
                        className='ressearchbar'
                        name='query'
                        value={this.state.query}
                        onChange={e => this.change(e)}
                        onClick={e => this.handleClick(e)}/>
                    <p id="noResults"></p>
                    {filters}
                    <button className='rescenter' onClick={e => this.onSubmit(e)}>Search</button>
                </form>
            </div>
        )
    }
}

export default withRouter(ResSearch);