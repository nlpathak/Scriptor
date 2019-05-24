import React from 'react';
import APIClient from './api/APIClient.js';
import './History.css';

function History() {
  const loggedin = APIClient.isCurrentUserLoggedIn();
  if(loggedin) {
    return (
      <div>
        History page not implemented.
      </div>
    );
  } else {
    window.location.assign('/');
  }
}

export default History;
