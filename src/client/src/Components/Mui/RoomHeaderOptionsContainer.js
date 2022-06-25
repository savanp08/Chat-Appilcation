import * as React from 'react';
import AddRoom_Component from './AddRoom-Component';
import RemoveRoom_Component from './RemoveRoom-Component';
import './RoomOptions.css';



const RoomHeaderOpenOptionsContainer = ({socket,SelectedOption,Rooms}) =>{
  console.log("props are Rooms and Socket->",Rooms,socket);
  if(SelectedOption==="None"){
     var x = document.getElementById('RoomSearchBarContainer');
     if(x) x.classList.remove('Hide');
  }
  else{
    var x = document.getElementById('RoomSearchBarContainer');
    if(x) x.classList.add('Hide');  }

   React.useEffect(()=>{
    window.addEventListener('click',function(){

    });

    return()=>{
      window.removeEventListener('click',function(){
        console.log("Removed");
      });
    }
   },[])

const RoomsList = Rooms;
    console.log("In Room Open Options->");
    console.log("Rooms passed to Open Options in Room Section are->",Rooms);
    console.log("IN Open _> Selcted Option is ",SelectedOption);

    return(
<div className='RoomOptions-Wrapper' id="RoomOptions-Wrapper" >
      <div className={ "AddRoom-Container" +(SelectedOption==="Add Room"? "" : " Hide") }>
        <AddRoom_Component socket={socket} />
      </div>
      <div className={ "RemoveRoom-Container" +(SelectedOption==="Delete Chat & Room"? "" : " Hide") }>
       <RemoveRoom_Component Rooms={RoomsList} socket={socket}/>
      </div>
    </div>
    );
};


export default RoomHeaderOpenOptionsContainer;