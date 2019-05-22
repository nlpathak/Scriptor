import React, {Component} from 'react';
import { toast } from 'react-toastify';
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
        if(this.state.pass !== this.state.verify) {
            //@David
        } else {
            toast("Welcome to Scriptor", {
                className: 'popup'
            });
            console.log(this.state);
        }
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

                    <div className='field'>
                        <p>Password Confirmation</p>
                        <br></br>
                        <input 
                        type = 'password'
                        className ='searchbar' 
                        name = 'verify'
                        value = {this.state.verify} 
                        onChange={e => this.change(e)} />
                    </div>

                    <button className='center' onClick={e => this.onSubmit(e)}>SIGN UP</button>
                </form>
            </div>
        );
    }
}

export default Signup;