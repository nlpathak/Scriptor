import React from 'react';
import Navbar from './components/Navbar.js';
import Search from './components/Search.js';
import './App.css';

function App() {
  return (
    <div>
      <Navbar />
      <div className="parent">
        <Search />
      </div>
    </div>
  );
}

export default App;
