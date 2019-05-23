import React from 'react';
import Search from './components/Search.js';
import './Home.css';
import APIClient from "./api/APIClient"

// TODO: Remove this
APIClient.register("test@testasdf.com", "asd").then((authToken) => {
    console.log("Auth token is: " + authToken);
});

function Home() {
  return (
    <div>
      <div className="parent">
        <Search />
      </div>
    </div>
  );
}

export default Home;
