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

 const ChatWindow_RemoveMember = ({Members,ActiveRoomId}) => {
const [FilterQuery , setFilterQuery] = React.useState("");
var RoomType = "Rooms";
if(useParams().UserType==="QuickUser") RoomType="QuickRoom";

console.log("Room Id Passed to Remove user is ->",ActiveRoomId);
const MembersArr = Members;
React.useEffect(()=>{
  console.log("search filter is ",FilterQuery);
  const temp=document.getElementById("RemoveMembersList");
  const list = temp.getElementsByClassName("RemoveMember-Container");
    for(var i=0;i<list.length;i++){
      const x = list[i].getElementsByClassName("RemoveMemberName")[0];
      console.log("Sub Div in filtering loop",x.childNodes[0].nodeValue);
      const y = x.childNodes[0].nodeValue;
      if(y.toLowerCase().includes(FilterQuery.toLocaleLowerCase())){
      list[i].style.display="";
       console.log("Element checking for filterting in remove Member",y);
      }
      else
      list[i].style.display="none";
    }
},[FilterQuery]);

var count=0;
var removeMember = "";
console.log("in remove Member->");
console.log("Remove Members->",Members);
var UserNamex  = useParams();
var UserName="";
const deleteMember = async() =>{

if(UserNamex.UserName) UserName=UserNamex.UserName;
console.log(removeMember);
var RoomId = ActiveRoomId;
console.log("Deleteing User ",removeMember,"from Room",RoomId);
await axios.post(`/Server/${RoomType}/Delete/Member/${ActiveRoomId}/${removeMember}`)
.then(res=>{
  console.log(res.data);
  var x = document.getElementById('RemoveMember-SearchArea');
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
          id="RemoveMember-SearchArea"
          label="Member UserName"
          defaultValue=""
          placeholder='Member UserName'
          onChange={(e)=>{
                setFilterQuery(e.target.value);
          }}
        />
            <div id="RemoveMembersList" >
        <Box  
        sx={{ 
            maxHeight:'300px', maxWidth:'300px', overflowX:'scroll' , overflowY:'scroll' , display:'flex' , flexFlow:'column nowrap' 
        }}
      >
        {
        [...MembersArr.keys()].map(key=>{ ++count;
         
          return(
          <div className="RemoveMember-Container"  id={`RemoveMember${count}`} onClick={()=>{ 
            console.log("User",UserName," is going be deleted from roomID",key);
            removeMember = key;
            document.getElementById("RemoveMember-ChatWindow-Output").innerHTML=`Remove ${MembersArr.get(key).UserId}`
           }}>
            <div className='MemberPic'>
              <img src={MembersArr.get(key).Img} />
            </div>
            <div className='RemoveMemberName'>
                {/* {MembersArr.get(key).Name} */}
                {key}
                </div>
                
          </div>
          );
        })
    }
      </Box>
      </div>
      <p id="RemoveMember-ChatWindow-Output" ></p>
      <div className='SubmitRemoveMember'>
      <Button variant="contained"
      sx={{
        marginTop:'10px'
      }}
        onClick={()=>{
          deleteMember();
        }}
        >Remove Member</Button>
      </div>
    </Paper>
  );
}

export default ChatWindow_RemoveMember;