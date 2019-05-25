import React, {Component} from 'react';
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
        document.getElementById('emailLogin').style.color = "rgba(0,0,0,.65)";
        document.getElementById('emailLoginError').style.color = "rgba(0,0,0,.65)";
        document.getElementById('emailLoginError').innerHTML = "";
        document.getElementById('invalidLogin').style.color = "rgba(0,0,0,.65)";
        document.getElementById('invalidLoginError').style.color = "rgba(0,0,0,.65)";
        document.getElementById('invalidLoginError').innerHTML = "";
        document.getElementById('titulo').style.marginTop = "75px";
        document.getElementById('loginConfirm').style.marginTop = "75px";

        if(!this.validateEmail(this.state.email)) {
            document.getElementById('emailLogin').style.color = "rgba(207, 70, 70, 0.93)";
            document.getElementById('emailLoginError').style.color = "rgba(207, 70, 70, 0.93)";
            document.getElementById('emailLoginError').innerHTML = "Please enter a valid email.";
            document.getElementById('titulo').style.marginTop = "35px";
            return;
        }

        APIClient.login(this.state.email, this.state.pass).then((authToken) => {
            window.location.reload();
        }).catch(e => {
            document.getElementById('invalidLogin').style.color = "rgba(207, 70, 70, 0.93)";
            document.getElementById('invalidLoginError').style.color = "rgba(207, 70, 70, 0.93)";
            document.getElementById('invalidLoginError').innerHTML = "Invalid username or password.";
            document.getElementById('loginConfirm').style.marginTop = "35px";
            // @David
        });
    }

    validateEmail(email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
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
                    <div className='field' id='emailLogin'>
                        <p>Email</p>
                        <br></br>
                        <input 
                        type = 'text'
                        className ='searchbar' 
                        name = 'email'
                        value = {this.state.email} 
                        onChange={e => this.change(e)} />
                        <p id='emailLoginError'></p>
                    </div>

                    <div className='field' id='invalidLogin'>
                        <p style={{marginTop: '75px'}} id='titulo'>Password</p>
                        <br></br>
                        <input 
                        type = 'password'
                        className ='searchbar' 
                        name = 'pass'
                        value = {this.state.pass} 
                        onChange={e => this.change(e)} />
                        <p id='invalidLoginError'></p>
                    </div>

                    <button id='loginConfirm' className='center' onClick={e => this.onSubmit(e)}>LOG IN</button>
                </form> 
                <a href='/forgotpass'>Forgot your password?</a>
            </div>
        );
    }
}

export default Login;