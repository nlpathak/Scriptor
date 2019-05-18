import React, {Component} from 'react';
import './Forgotpass.css';

class Forgotpass extends Component {
    state = {
        email: '',
    };

    change = e => {
        this.setState({[e.target.name]: e.target.value});
    }

    onSubmit(e) {
        e.preventDefault();
        if(this.state.email.length < 1) {
            alert('Please enter an email');
        } else {
            console.log(this.state);
        }
    }

    render(){
        return(
            <div className='forgotpass'>
                <div className='header'>
                    <h1>RESET PASSWORD</h1>
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

                    <button className='center' onClick={e => this.onSubmit(e)}>RESET PASSWORD</button>
                </form>
            </div>
        );
    }
}

export default Forgotpass;