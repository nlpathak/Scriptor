import React from 'react';
import Changepass from './components/Changepass.js'
import APIClient from './api/APIClient';
import './User.css';

function User() {
  const loggedin = APIClient.isCurrentUserLoggedIn();
  if(loggedin) {
    return (
      <div>
            <Changepass />
      </div>
    );
  } else {
    window.location.assign('/');
  }
}

export default User;
