import React, {Component} from 'react';
import Popup from 'reactjs-popup';
import Signup from './Signup.js';
import Login from './Login.js';
import './_Components.css';
import APIClient from "../api/APIClient.js";
import {toast} from 'react-toastify';


class Navbar extends Component {

    constructor() {
        super();
        APIClient.addCallback((msg) => {
            if (msg.type === "auth") {
                // trigger a re-render
                this.setState({authAction: msg.action});
            }
        });
    }

    redirect(e, route) {
        e.preventDefault();
        window.location.assign(route);
    }

    logout(e) {
        e.preventDefault();
        APIClient.logout();
        toast("Logged Out", {className: 'popup'});
        window.location.reload();
    }

    render() {
        // Render login navbar based on login
        const loggedin = APIClient.isCurrentUserLoggedIn();

        let logout_buttons =
            <div>
                <Popup trigger={<li>
                    <button>LOG IN</button>
                </li>} modal contentStyle={{height: '700px', width: '500px'}} closeOnDocumentClick>
                    {close => (
                        <div>
                            <Login/>
                            <button className='close close1' onClick={close}>
                                &times;
                            </button>
                        </div>
                    )}</Popup>
                <Popup trigger={<li>
                    <button>SIGN UP</button>
                </li>} modal contentStyle={{height: '700px', width: '500px'}} closeOnDocumentClick>
                    {close => (
                        <div>
                            <Signup/>
                            <button className='close close2' onClick={close}>
                                &times;
                            </button>
                        </div>
                    )}</Popup>
                <li>
                    <button onClick={e => this.redirect(e, '/about')}>ABOUT</button>
                </li>
            </div>;

        let login_buttons =
            <div>
                <Popup trigger={<li>
                    <button className='dropper'>MY ACCOUNT</button>
                </li>} position="bottom center" on="hover" closeOnDocumentClick mouseLeaveDelay={0} mouseEnterDelay={0}
                       contentStyle={{padding: '0px', border: 'none'}}
                       arrow={false}>
                    <div className='dropdown'>
                        <button onClick={e => this.redirect(e, '/history')}>HISTORY</button>
                        <button onClick={e => this.redirect(e, '/favorites')}>FAVORITES</button>
                        <button onClick={e => this.redirect(e, '/user')}>SETTINGS</button>
                        <button onClick={e => this.logout(e)}>LOG OUT</button>
                    </div>
                </Popup>
                <li>
                    <button onClick={e => this.redirect(e, '/about')}>ABOUT</button>
                </li>
            </div>;

        return (
            <div className='navbar'>
                <button className='logo' onClick={e => this.redirect(e, '/')}>SCRIPTOR</button>
                <ul className='outer'>
                    {loggedin ? login_buttons : logout_buttons}
                </ul>
            </div>
        );
    }
}

export default Navbar;
