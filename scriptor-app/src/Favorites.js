import React from 'react';
import Favorite from './components/FavResult.js';
import APIClient from './api/APIClient.js';
import './Favorites.css';

function Favorites() {
  const loggedin = APIClient.isCurrentUserLoggedIn();
  if(loggedin) {
    return (
      <div>
        <Favorite/>
      </div>
    );
  } else {
    window.location.assign('/');
  }
}

export default Favorites;
