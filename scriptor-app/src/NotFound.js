import React from 'react';
import './NotFound.css';

function submit(e) {
  e.preventDefault();
  window.location.assign('/');
  
}

function NotFound() {
  return (
    <div className='notfound'>
        <h1>Uh oh! Something went wrong.</h1>
        <h5>Let's get you home:</h5>
        <button onClick={e => submit(e)}>Home</button>
    </div>
  );
}

export default NotFound;
