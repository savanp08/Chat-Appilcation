
  import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
  import { Routes } from 'react-router-dom';
  import React , {Component}from "react";
  import ChatWindow from './ChatWindow/ChatWindow.js'
  import Home from './Home/Home.js'
  import Login from './Login/Login.js';
  import SignUp from './Login/SignUp.js';
  import QuickChatWindow from './ChatWindow/QuickChat.js';
  const RoutesComponent = () => {
return(
<div className='Content-wrapper'>
<Routes>
  
  <Route exact path="/Account/:UserName" element={<ChatWindow/>}/>
  <Route exact path="/Home/:UserName" element={<Home/>}/>
  <Route exact path="/Login" element={<Login/>}/>
  <Route exact path="/SignUp" element={<SignUp/>}/>
  {/* <Route exact path="/Account/Settings/:UserName" element={<Settings/>}/> */}
  <Route exact path="/" element={<Home/>}/>
  <Route exact path="/Account" element={<ChatWindow/>}/>
  <Route exact path="/QuickRoom/:UserType/:RoomId/:UserId/:Name" element={<QuickChatWindow/>}/>
  <Route exact path="/SavedRoom/:RoomId/:UserId" element={<ChatWindow/>}/>
  <Route exact path="/SavedRoom/:RoomId" element={<ChatWindow/>}/>
  {/* <Route exact path="/Account/Settings" element={<Settings/>}/> */}
  </Routes>
</div>
);
  }

  export default RoutesComponent