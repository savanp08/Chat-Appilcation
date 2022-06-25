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
import './RoomOptions.css';

 const RemoveRoom_Component = ({Rooms,socket}) => {
const [FilterQuery , setFilterQuery] = React.useState("");
console.log("props are Rooms and Socket->",Rooms,socket);
const RoomsArr = Rooms;
React.useEffect(()=>{
  console.log("search filter is ",FilterQuery);
  const temp=document.getElementById("RemoveRoomsList");
  const list = temp.getElementsByClassName("RemoveRoom-Container");
    for(var i=0;i<list.length;i++){
      const x = list[i].getElementsByClassName("RemoveRoomName")[0];
      console.log("Sub Div in filtering loop",x.childNodes[0].nodeValue);
      const y = x.childNodes[0].nodeValue;
      if(y.toLowerCase().includes(FilterQuery.toLocaleLowerCase())){
      list[i].style.display="";
       console.log("Element checking for filterting in remove Room",y);
      }
      else
      list[i].style.display="none";
    }
},[FilterQuery]);

var count=0;
var removeRoom = {};
console.log("in remove Room->");
console.log("Remove Rooms->",Rooms);
var UserNamex  = useParams();
var UserName="";
const deleteRoom = async() =>{

if(UserNamex.UserName) UserName=UserNamex.UserName;
console.log(removeRoom);
var RoomId = removeRoom.RoomId;
console.log("Deleteing USer ",UserName,"from Room",RoomId);
await axios.post(`/Server/Rooms/Room/Delete/Member/${RoomId}/${UserName}`)
.then(res=>{
  console.log(res.data);
  var x = document.getElementById('RemoveRoom-SearchArea');
  if(x) x.value = "";
}).catch(err=>{
  console.log(err);
});


}


  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px' , display: 'flex', alignItems: 'center', maxWidth: 400 ,flexFlow:'column wrap',justifyContent:'space-around' }}
    >
      <TextField
          required
          id="RemoveRoom-SearchArea"
          label="Room Name"
          defaultValue=""
          placeholder='Room Name'
          onChange={(e)=>{
                setFilterQuery(e.target.value);
          }}
        />
            <div id="RemoveRoomsList" >
        <Box  
        sx={{ 
            maxHeight:'400px', maxWidth:'400px', overflowX:'scroll' , overflowY:'scroll' , display:'flex' , flexFlow:'column nowrap' 
        }}
      >
        {
        [...RoomsArr.keys()].map(key=>{ ++count;
         
          return(
          <div className="RemoveRoom-Container"  id={`RemoveRoom${count}`} onClick={()=>{ 
            console.log("User",UserName," is going be deleted from roomID",key);
            document.getElementById("RemoveRoom-Output").innerHTML=`Selected Room : ${RoomsArr.get(key).Name}`
            removeRoom = {
              RoomId:key,
              Name:RoomsArr.get(key).Name
            }
           }}>
            <div className='RoomPic'>
              <img src={RoomsArr.get(key).Img} />
            </div>
            <div className='RemoveRoomName'>
                {/* {RoomsArr.get(key).Name} */}
                {RoomsArr.get(key).Name}
                </div>
                
          </div>
          );
        })
    }
      </Box>
      </div>
     <p id="RemoveRoom-Output" className="RemoveRoom-Output"></p>
      <div className='SubmitRemoveRoom'>
      <Button variant="contained"
      sx={{
        marginTop:'10px'
      }}
        onClick={()=>{
          deleteRoom();
        }}
        >Remove Room</Button>
      </div>
    </Paper>
  );
}

export default RemoveRoom_Component;