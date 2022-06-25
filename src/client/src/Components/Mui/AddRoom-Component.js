import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import mongoose from 'mongoose';
import './RoomOptions.css';
import { Socket } from 'socket.io-client';


 const AddRoom_Component = ({socket}) => {
  console.log("props are  Socket->",socket);
  var UserName = useParams().UserName;
  var NewRoomName = "";
  const MemArr = [];
  var ActualMem=[];
  function addUser(){
    var y = document.getElementById('AddUser-TextArea');
   
    if(y){
       var x = y.value;
       console.log(x);
        MemArr.push(x);
        y.value="";
    }
    console.log("Members to be added to New Room->",MemArr);
  };
const addRoom = async()=>{
   ActualMem = [];
  ActualMem.push({
    UserId:UserName,
    Name:"TestAccount"
  });
  var NewRoomNamex = document.getElementById("RoomName-AddRoom");
  if(NewRoomNamex){
    NewRoomName = NewRoomNamex.value;
  }
    if(NewRoomName.length<3) {
      window.alert("Room Name Length Should be atLeast 3");
      return;
    }
 
  var NewRoomId = new mongoose.Types.ObjectId();
  NewRoomId=NewRoomId.toString();
  console.log("Creating Room with->",NewRoomId);

    joinRoom(NewRoomId);
   
}


const joinRoom = async(NewRoomId)=>{
  console.log("Joning Room in socket server->",NewRoomId);
  var NewRoom = [];
  NewRoom.push(NewRoomId);
  NewRoom.push(UserName);
 socket.emit("joinRoom",NewRoom);
 createRoom(NewRoomId);
}
const createRoom = async(NewRoomId) =>{

  

  await axios.post(`/Server/Rooms/Room/create/${UserName}`,
  {
    RoomId:NewRoomId,
    Name:NewRoomName,
    Members : ActualMem,
    Messages:[],
    RoomType : "Auth"
})
.then(res=>{
  console.log("created new room",res.data);
  MemArr.forEach(key=>{
    checkUser(key,NewRoomId);
  })
})
.catch(err=>{
  console.log("Err in creating room",err);
});
}
const checkUser = async(UserId,RoomId)=>{
  
  console.log("Member to be added to this Room->",UserId,RoomId);
 var x = UserId;
  var flag = true;

  await axios.get(`/Server/Auth/CheckUser/${x}`).then(res=>{
    if(res.status===200 || res.data === "Found") flag=true;
    else flag=false;
    if(flag) addUserToRoom(x,RoomId);
  }).catch(err=>{
    console.log(err)
})

  
};

const addUserToRoom = async(x,RoomId) =>{

  await axios.post(`/Server/Rooms/Room/add/User/${RoomId}`,
{
UserId:x,
Name:"Temp User",
RoomId:RoomId
})
.then(res=>{
console.log("Added new Member",res.data);
})
.catch(err=>{
console.log("Err in adding Member",err);
});

}

  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px' , display: 'flex', alignItems: 'center', maxWidth: 400 ,maxHeight:500 
          , flexFlow:'column wrap', justifyContent:'space-around'
    }} 
    >
      
      <TextField
          required
          id="RoomName-AddRoom"
          label="Room Name"
          defaultValue=""
          placeholder='Room Name'
        />
        
        <Box sx={{ display: 'flex', alignItems: 'flex-end' ,
      width:"100%" , marginTop:'15px'
      }}>
        <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
        <TextField id="AddUser-TextArea" label="UserName" variant="standard" />
        </Box>
        <Button variant="contained"
        sx={{
          marginTop:'8px'
        }}
        onClick={()=>{
          addUser();
        }}
        >Add User</Button>
      
      <Box sx={{ 
     maxHeight:'120px', maxWidth:'170px', overflowX:'hidden' , 
     overFlowY:'scroll' , display:'flex' , flexFlow:'column wrap' ,
     marginTop:'13px'
    }}>
       {
        MemArr.map(ele=>{
          return(
           <div className='AddUser-AddRoom'>
            <div className='UserName-AddRoom'>
                 {ele}
              </div>
           </div>
          );
          
        })
       }
      </Box>
      <Button variant="contained"
      sx={{
        marginTop:'10px'
      }}
        onClick={()=>{
          addRoom();
        }}
        >Add Room</Button>
    </Paper>
  );
}

export default AddRoom_Component;