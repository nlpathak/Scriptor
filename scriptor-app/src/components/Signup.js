import React, {Component} from 'react';
import APIClient from "../api/APIClient";
import './_Components.css';

class Signup extends Component {
    state = {
        email: '',
        pass: '',
        verify: ''
    };

    change = e => {
        this.setState({[e.target.name]: e.target.value});
    }

    onSubmit(e) {
        e.preventDefault();
        document.getElementById('emailInput').style.color = "rgba(0,0,0,.65)";
        document.getElementById('emailError').style.color = "rgba(0,0,0,.65)";
        document.getElementById('emailError').innerHTML = "";
        document.getElementById('verifyInput').style.color = "rgba(0,0,0,.65)";
        document.getElementById('passInput').style.color = "rgba(0,0,0,.65)";
        document.getElementById('passNoMatch').style.color = "rgba(0,0,0,.65)";
        document.getElementById('passNoMatch').innerHTML = "";
        document.getElementById('passTitle').style.marginTop = "75px";
        document.getElementById('confirmTitle').style.marginTop = "75px";
        document.getElementById('signButton').style.marginTop = "75px";


        // Check if the email is in "email format" ___@___.___
        if(!this.validateEmail(this.state.email)) {
          document.getElementById('emailInput').style.color = "rgba(207, 70, 70, 0.93)";
          document.getElementById('emailError').style.color = "rgba(207, 70, 70, 0.93)";
          document.getElementById('emailError').innerHTML = "Please enter a valid email.";
          document.getElementById('passTitle').style.marginTop = "35px";
          return;
        }

        // Checks if password and verify password match
        if(this.state.pass !== this.state.verify) {
          document.getElementById('verifyInput').style.color = "rgba(207, 70, 70, 0.93)";
          document.getElementById('passInput').style.color = "rgba(207, 70, 70, 0.93)";
          document.getElementById('passNoMatch').style.color = "rgba(207, 70, 70, 0.93)";
          document.getElementById('passNoMatch').innerHTML = "Passwords do not match.";
          document.getElementById('signButton').style.marginTop = "35px";
          return;
        }
        
        if (this.state.pass.length < 4) {
          document.getElementById('verifyInput').style.color = "rgba(207, 70, 70, 0.93)";
          document.getElementById('passInput').style.color = "rgba(207, 70, 70, 0.93)";
          document.getElementById('passNoMatch').style.color = "rgba(207, 70, 70, 0.93)";
          document.getElementById('passNoMatch').innerHTML = "Password must be at least 4 characters."
          document.getElementById('signButton').style.marginTop = "35px";
          return;
        }

        APIClient.register(this.state.email, this.state.pass).then((authToken) => {
            window.location.reload();
        }).catch(e => {
            document.getElementById('emailInput').style.color = "rgba(207, 70, 70, 0.93)";
            document.getElementById('emailError').style.color = "rgba(207, 70, 70, 0.93)";
            document.getElementById('emailError').innerHTML = "Account already exists.";
            document.getElementById('passTitle').style.marginTop = "35px";
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
                    <h1>SIGN UP</h1>
                    <br></br>
                    <h2>Create an account below</h2>
                </div>

                <form className='col-xs-1 text-center navform'>
                    <div className='field' id="emailInput">
                        <p>Email</p>
                        <br></br>
                        <input 
                        type = 'text'
                        className ='searchbar' 
                        name = 'email'
                        value = {this.state.email} 
                        onChange={e => this.change(e)} />
                        <p id='emailError'></p>
                    </div>

                    <div className='field' id="passInput">
                        <p id='passTitle' style={{marginTop: '75px'}}>Password</p>
                        <br></br>
                        <input 
                        type = 'password'
                        className ='searchbar' 
                        name = 'pass'
                        value = {this.state.pass} 
                        onChange={e => this.change(e)} />
                    </div>

                    <div className='field' id="verifyInput">
                        <p id='confirmTitle' style={{marginTop: '75px'}}>Password Confirmation</p>
                        <br></br>
                        <input 
                        type = 'password'
                        className ='searchbar' 
                        name = 'verify'
                        value = {this.state.verify} 
                        onChange={e => this.change(e)} />
                        <p id='passNoMatch'></p>
                    </div>

                    <button id='signButton' className='center' onClick={e => this.onSubmit(e)}>SIGN UP</button>
                </form>
            </div>
        );
    }
}

export default Signup;