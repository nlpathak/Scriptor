import React, {Component} from 'react';
import Popup from 'reactjs-popup';
import Signup from './Signup.js';
import Login from './Login.js';
import './_Components.css';


class Navbar extends Component {
    render(){
        // If user not logged in
       return(
            <div className='navbar'>
                <div className='logo'>SCRIPTOR</div>
                <ul className='outer'>
                    <Popup trigger={<li><button>LOG IN</button></li>} modal contentStyle={{height: '700px', width: '500px'}} closeOnDocumentClick>
                    {close => (
                    <div>
                        <Login/>
                        <button className='close close1' onClick={close}>
                            &times;
                        </button>
                    </div>
                    )}</Popup>
                    <Popup trigger={<li><button>SIGN UP</button></li>} modal contentStyle={{height: '700px', width: '500px'}} closeOnDocumentClick>
                    {close => (
                    <div>
                        <Signup/>
                        <button className='close close2' onClick={close}>
                            &times;
                        </button>
                    </div>
                    )}</Popup>
                    <li><button>ABOUT</button></li>
                </ul>
            </div>
        );
        
        // Else
        /*return(
            <div className='navbar'>
                <div className='logo'>SCRIPTOR</div>
                <ul className='outer'>
                    <Popup trigger={<li><button>MY ACCOUNT</button></li>} position="bottom center" on="hover" closeOnDocumentClick mouseLeaveDelay={0} mouseEnterDelay={0}
                    contentStyle={{padding: '0px', border: 'none'}}
                    arrow={false}>
                    <div className='dropdown'>
                        <button>HISTORY</button>
                        <button>FAVORITES</button>
                        <button>SETTINGS</button>
                        <button>LOG OUT</button>
                    </div>
                    </Popup>
                    <li><button>ABOUT</button></li>
                </ul>
            </div>
        );*/
    }
}

export default Navbar;