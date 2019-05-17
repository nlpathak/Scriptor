import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Navbar from './components/Navbar.js';
import Home from './Home.js';
import About from './About.js';
import User from './User.js';
import './App.css';

class App extends Component {
    render() {
        return (
            <Router>
                <Navbar />
                <div>
                    <Route exact path="/" component={Home}/>
                    <Route path="/about" component={About}/>
                    <Route path="/user" component={User}/>
                </div>
            </Router>
        );
    }
}

export default App;