import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Navbar from './components/Navbar.js';
import Home from './Home.js';
import About from './About.js';
import User from './User.js';
import History from './History.js';
import Favorites from './Favorites.js';
import PodcastPage from './PodcastPage.js';
import './App.css';
import Results from './Results.js';
import Forgotpass from './Forgotpass.js';
import Transcript from './Transcript.js';

class App extends Component {
    render() {
        return (
                <Router>
                    <Navbar/>
                    <div>
                        <Route exact path="/" component={Home}/>
                        <Route path="/about" component={About}/>
                        <Route path="/user" component={User}/>
                        <Route path="/forgot_password" component={Forgotpass}/>
                        <Route path="/results" component={Results}/>
                        <Route path="/history" component={History}/>
                        <Route path="/favorites" component={Favorites}/>
                        <Route path="/podcast" component={PodcastPage}/>
                        <Route path="/transcript" component={Transcript}/>
                    </div>
                </Router>
        );
    }
}

export default App;