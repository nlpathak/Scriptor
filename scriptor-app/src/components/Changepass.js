import React, {Component} from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './_Components.css';
import APIClient from '../api/APIClient';

class Changepass extends Component {
    state = {
        oldpass: '',
        newpass: '',
        verify: ''
    };

    change = e => {
        this.setState({[e.target.name]: e.target.value});
    }

    onSubmit(e) {
        e.preventDefault();
        if(this.state.newpass !== this.state.verify) {
            // @David
            toast("New Passwords Don't Match", {className: 'popup error'});
            return;
        }
        APIClient.changePassword(this.state.oldpass, this.state.newpass).then((authToken) => {
            toast("Password Updated", {className: 'popup'});
            this.setState({oldpass: ''});
            this.setState({newpass: ''});
            this.setState({verify: ''});
        }).catch(e => {
            toast("Invalid Old Password", {className: 'popup error'});
          // @David
        }); 

    }

    render(){
        return(
            <div className='settings'>
                <div className='header'>
                    <h1>CHANGE PASSWORD</h1>
                    <br></br>
                </div>

                <form className='col-xs-1 text-center navform'>
                    <div className='field'>
                        <p>Old Password</p>
                        <br></br>
                        <input 
                        type = 'password'
                        className ='searchbar' 
                        name = 'oldpass'
                        value = {this.state.oldpass} 
                        onChange={e => this.change(e)} />
                    </div>

                    <div className='field'>
                        <p>New Password</p>
                        <br></br>
                        <input 
                        type = 'password'
                        className ='searchbar' 
                        name = 'newpass'
                        value = {this.state.newpass} 
                        onChange={e => this.change(e)} />
                    </div>

                    <div className='field'>
                        <p>Verify New Password</p>
                        <br></br>
                        <input 
                        type = 'password'
                        className ='searchbar' 
                        name = 'verify'
                        value = {this.state.verify} 
                        onChange={e => this.change(e)} />
                    </div>

                    <button className='center' onClick={e => this.onSubmit(e)}>RESET PASSWORD</button>
                </form>
            </div>
        );
    }
}

export default Changepass;