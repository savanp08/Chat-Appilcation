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
import './ChatWindowOptions.css';


 const ChatWindow_AddMember = ({ActiveRoomId,Members}) => {
  var RoomType ="Rooms";
  var UserName = useParams().UserName;
  var RoomId = ActiveRoomId;
  if(useParams().UserType==="QuickUser") RoomType="QuickRoom";
  console.log("Room Id Passed to ADD user is ->",ActiveRoomId);
  const checkUser = async()=>{
    var y = document.getElementById('ChatWindow-AddUser-TypeArea');
   var x = "";
    if(y){
        x = y.value;
       console.log(x);
        y.value="";
    }
    console.log("Member to be added to this Room->",x);
   
    var flag = true;

    await axios.get(`/Server/Auth/CheckUser/${x}`).then(res=>{
      if(res.status===200 || res.data === "Found") flag=true;
      else flag=false;
      if(flag) addUser(x,RoomId);
    }).catch(err=>{
      console.log(err)
  })

    
  };
 
 const addUser = async(x,RoomId) =>{
  
    await axios.post(`/Server/${RoomType}/Room/add/User/${RoomId}`,
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
          id="ChatWindow-AddUser-TypeArea"
          label="Member UserName"
          defaultValue=""
          placeholder='Member UserName'
        />
        
     
        <Button variant="contained"
        sx={{
          marginTop:'8px'
        }}
        onClick={()=>{
          checkUser();
        }}
        >Add User</Button>
      
     
    </Paper>
  );
}

export default ChatWindow_AddMember;