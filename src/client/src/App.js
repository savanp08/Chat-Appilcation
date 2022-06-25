import React from 'react'
import './App.css';
import ChatWindow from './Components/ChatWindow/ChatWindow.js'
import RoutesComponent from './Components/RoutesComponent.js'
import { BrowserRouter as Router, Route, Link ,Routes } from 'react-router-dom';
import Home from './Components/Home/Home.js'
import Login from './Components/Login/Login';
import SignUp from './Components/Login/SignUp';
function App() {
  return(
    <Router>
  <div className="Content-wrapper">
 <RoutesComponent>
   
 </RoutesComponent>
</div>
</Router>
  );
}

export default App;


