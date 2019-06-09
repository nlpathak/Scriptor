import React, {Component} from 'react';
import {toast} from 'react-toastify';
import './Forgotpass.css';
import APIClient from "./api/APIClient";

class Forgotpass extends Component {
    state = {
        email: '',
        passwordToken: '',
        newPassword: '',
        sentVerificationEmail: false
    };

    change = e => {
        this.setState({[e.target.name]: e.target.value});
    };

    onEmailFormSubmit(e) {
        e.preventDefault();
        APIClient.sendPasswordTokenEmail(this.state.email).then((success) => {
            this.setState({sentVerificationEmail: true, email: this.state.email});
            toast("Check your email for a verification token.", {className: 'popup'});
        }).catch((err) => {
            this.setState({sentVerificationEmail: false, email: ''});
            toast(err, {className: 'popup error'});
        })
    }

    onResetPasswordFormSubmit(e) {
        e.preventDefault();
        if(this.state.newPassword.length < 4) {
            toast('Password must be 4 or more characters.', {className: 'popup error'});
            return;
        }
        APIClient.setNewPassword(this.state.email, this.state.newPassword, this.state.passwordToken).then((success) => {
            toast("Your password has been changed.", {className: 'popup'});

            // Login the user & redirect them to the login page.
            APIClient.login(this.state.email, this.state.newPassword).then(() => {
                // Redirect the user to the home page.
                this.props.history.push("/");
            });

        }).catch((err) => {
            toast(err, {className: 'popup error'});
        });
    }

    getForm() {
        if (!this.state.sentVerificationEmail) {
            return (
                <form className='col-xs-1 text-center navform'>
                    <div className='field'>
                        <p>Email</p>
                        <br></br>
                        <input
                            type='text'
                            className='searchbar'
                            name='email'
                            value={this.state.email}
                            onChange={e => this.change(e)} required/>
                    </div>

                    <button className='center' onClick={e => this.onEmailFormSubmit(e)}>RESET PASSWORD</button>
                </form>
            )
        } else {
            return (
                <form className='col-xs-1 text-center navform'>
                    <div className='field'>
                        <p>Email</p>
                        <br></br>
                        <input
                            type='text'
                            className='searchbar'
                            name='email'
                            value={this.state.email}
                            onChange={e => this.change(e)} required/>
                    </div>
                    <div className='field'>
                        <p>Password token</p>
                        <br></br>
                        <input
                            type='text'
                            className='searchbar'
                            name='passwordToken'
                            value={this.state.passwordToken}
                            onChange={e => this.change(e)} required/>
                    </div>
                    <div className='field'>
                        <p>New password</p>
                        <br></br>
                        <input
                            type='password'
                            className='searchbar'
                            name='newPassword'
                            value={this.state.newPassword}
                            onChange={e => this.change(e)} required/>
                    </div>

                    <button className='center' onClick={e => this.onResetPasswordFormSubmit(e)}>RESET PASSWORD</button>
                </form>
            )
        }
    }

    render() {
        return (
            <div className='forgotpass'>
                <div className='header'>
                    <h1>RESET PASSWORD</h1>
                </div>
                {this.getForm()}
            </div>
        );
    }
}

export default Forgotpass;