import React, { Component } from 'react';
import './App.css';
import { Route } from 'react-router-dom'
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import Main from './components/Main';

class App extends Component {
  render() {
    return (
	    <div className="App">
		    <Route exact path="/" component={LoginScreen}/>
		    <Route exact path="/dashboard" component={Dashboard}/>
		    <Route exact path="/planner" component={Main}/>
	    </div>
    );
  }
}

export default App;
