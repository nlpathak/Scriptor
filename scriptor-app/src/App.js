import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Navbar from './components/Navbar.js';
import Home from './Home.js';
import About from './About.js';
import User from './User.js';
import './App.css';
import Forgotpass from './Forgotpass.js'

class App extends Component {
    render() {
        return (
            <div>
                <link href="https://github.com/jewelzqiu/ChromeFonts/blob/master/css/2yahei.css" rel="stylesheet" type="text/css"/>
                <Router>
                    <Navbar/>
                    <div>
                        <Route exact path="/" component={Home}/>
                        <Route path="/about" component={About}/>
                        <Route path="/user" component={User}/>
                        <Route path="/forgotpass" component={Forgotpass}/>
                    </div>
                </Router>
            </div>
        );
    }
}

export default App;