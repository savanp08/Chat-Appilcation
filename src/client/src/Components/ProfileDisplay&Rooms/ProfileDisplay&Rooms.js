import React from 'react' ;
import './ProfileDisplay&Rooms.css' ;

 const  ProfileDisplay=({ProfilePic,ProfileName,LastMessage})=> {
     
    var priority,count; 
      return( 
      <div className="Profile-Wrapper" > 
      <div className="Contact"> 
     
     <div className="Contact-ProfilePic-Container">
     
      <img className = "Contact-ProfilePic" src ="https://previews.123rf.com/images/grandeduc/grandeduc1603/grandeduc160300008/54330729-reaper-moon-rising-3d-render-of-cratered-skull-moon-in-night-sky.jpg" alt="Not Loaded" ></img>
      </div>
      <div className="Contact-BasicInfo"> 
     
      <div className="Profile-Name Text-Control-Box Contact-Text-Width" >
      <p  id="Room-ProfileName"  className="User-ProfileName Text-Control-Box" >{ProfileName}</p>
       </div>
       <div className="Last-Message Text-Control-Box " >
       <span className="Last-Message Text-Control-Box">{LastMessage}</span> 
      </div> 
      </div>
       </div> 
       </div>
        ); 
    }
    
                    
       export default ProfileDisplay;
                 
