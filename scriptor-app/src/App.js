import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Navbar from './components/Navbar.js';
import Home from './Home.js';
import About from './About.js';
import User from './User.js';
import History from './History.js';
import Favorites from './Favorites.js';
import './App.css';
import Forgotpass from './Forgotpass.js'
import temp_podcall from './temp_podcall.js'

class App extends Component {
    render() {
        return (
                <Router>
                    <Navbar/>
                    <div>
                        <Route exact path="/" component={Home}/>
                        <Route path="/about" component={About}/>
                        <Route path="/user" component={User}/>
                        <Route path="/forgotpass" component={Forgotpass}/>
                        <Route path="/history" component={History}/>
                        <Route path="/favorites" component={Favorites}/>
                        
                        <Route path="/podcastpage" component={temp_podcall}/>
                    </div>
                </Router>
        );
    }
}

export default App;