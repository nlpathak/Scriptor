import React, {Component} from 'react';
import { toast } from 'react-toastify';
import './_Components.css';
import APIClient from "../api/APIClient.js";

class Login extends Component {
    state = {
        email: '',
        pass: '',
    };

    change = e => {
        this.setState({[e.target.name]: e.target.value});
    }

    onSubmit(e) {
        e.preventDefault();
        APIClient.login(this.state.email, this.state.pass).then((authToken) => {
            window.location.reload();
        }).catch(e => {
            toast("Invalid Username or Password", {className: 'popup error'});
            // @David
        });
    }
    render(){
        return(
            <div className='navpop'>
                <div className='header'>
                    <h1>LOG IN</h1>
                    <br></br>
                    <h2>Enter your details below</h2>
                </div>

                <form className='col-xs-1 text-center navform'>
                    <div className='field'>
                        <p>Email</p>
                        <br></br>
                        <input 
                        type = 'text'
                        className ='searchbar' 
                        name = 'email'
                        value = {this.state.email} 
                        onChange={e => this.change(e)} />
                    </div>

                    <div className='field'>
                        <p>Password</p>
                        <br></br>
                        <input 
                        type = 'password'
                        className ='searchbar' 
                        name = 'pass'
                        value = {this.state.pass} 
                        onChange={e => this.change(e)} />
                    </div>

                    <button className='center' onClick={e => this.onSubmit(e)}>LOG IN</button>
                </form> 
                <a href='/forgotpass'>Forgot your password?</a>
            </div>
        );
    }
}

export default Login;