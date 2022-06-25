import React from 'react';
import { useEffect, useState } from 'react';
//import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import './ChatScopeSwitch.css';

const ChatScopeSwitch=()=> {
    const personalKey= 'personalKey', globalKey='globalKey';
    const [activeKey, setActiveKey] = useState('personalKey');
    
   const handleTabSwitch=(activeKey, prop)=>{
       console.log({activeKey});
       console.log({prop});
        if(prop===activeKey) {
            return;
        }
        else {
            if(activeKey===personalKey) setActiveKey('globalKey');
            else setActiveKey('personalKey');
        }
     }
//console.log({activeKey});
 return (
     <>
   
     <div className="ChatScopeSwitch-container" >
         
         <div className={"ChatScopeSwitch-Element-container"+(activeKey===globalKey? " active" : "")} onClick={()=>handleTabSwitch(activeKey, globalKey)}>
         <p className="ChatScopeSwitch-Menu_Element gradient-text">
         Global
             
         </p>
     </div>

     <div className={"ChatScopeSwitch-Element-container"+(activeKey===personalKey? " active" : "")} onClick={()=>handleTabSwitch(activeKey, personalKey)}>
         <p className="ChatScopeSwitch-Menu_Element gradient-text" >
         Personal
         </p>
     </div>
     </div>
     
    </> 
 );
}

export default ChatScopeSwitch;
