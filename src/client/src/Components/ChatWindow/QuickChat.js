import React, { useRef } from 'react'
import ChatScopeSwitch from '../ChatScopeSwitch/ChatScopeSwitch.js';
import './ChatWindow.css';
import ProfileDisplay from '../ProfileDisplay&Rooms/ProfileDisplay&Rooms.js' 
import Message from '../Message/Message.js'
import { useState,useEffect } from 'react';
import axios from 'axios'; 
import TextField from '@mui/material/TextField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IoMdSend ,IoMdMore} from "react-icons/io";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RoomHeaderOptions from '../Mui/RoomHeaderOptions.js';
import { useParams } from 'react-router-dom';
import Pusher from 'pusher-js'; 
import mongoose from 'mongoose';
import { io } from "socket.io-client";
import ChatWindowOptions from '../Additional_Components/ChatWindowOptions.js';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';

import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';










var NewRoomName="";
var roomtype ="quick";
  //  "start": "concurrently \"react-scripts start\" \" cd.. && cd server && npm start\"",

var userid ="";
var UserName="";
var name="";

const tempid=new mongoose.Types.ObjectId().toString();
const ChatWindow = () =>{

const [Rooms,setRooms] = useState(new Map());
const [Members,setMembers] = useState(new Map());
const [ActiveRoomId,setActiveRoomId] = useState();
const[ xArray ,setxArray]=useState([ActiveRoomId]);
const[UserType,setUserType] = useState("Quick");
const [n,setN] = useState(1);
const [UserId , setUserId] = useState("");
const [Messages, setMessages] = useState(new Map());
const [LastMessage,setLastMessage]=useState(new Map());
const [ActiveWindow,setActiveWindow] = useState("Both");
const [TypedMessage, setTypedMessage] = useState("");
const [OptionState,setOptionState] = useState(null);
const [RoomCount,setRoomCount] = useState(0);
const [msg, setMsg] = useState();
const [Lastmsg, setLastMsg] = useState();
const [room, setroom] = useState();
const [delmsg,setdelmsg]=useState();
const [delmem,setdelmem] = useState();
const [delroom,setdelroom] = useState();
const [mem,setmem] = useState();
const [flag,setflag] = useState();
const [flag2,setflag2] = useState();
const [flagLoadMessages,setFlagLoadMessages] = useState(true);
const [setactmem,actmem] = useState();
const [ActiveMembers,setActiveMembers] = useState(new Map());
const [Rerender,setRerender] = useState(0);
const [Conn,setConn] = useState(false);
const params= useParams();
userid= params.UserId;
console.log(params);
UserName=userid;
if(!UserName){
  console.log("UserName not found");
  window.location.replace(`/Login`);
}
console.log(UserName , "userName->");
var RoomId = params.RoomId;

var Name = params.Name;

useEffect(()=>{
var roomExists=true;
if(RoomId){
 axios.get(`/Server/QuickRoom/RoomInitial/${RoomId}`)
.then(res=>{ console.log("Result from QUick Room Check->",res.data)
  if(res.data.Status==="Found"){
    setRooms(new Map(Rooms.set(res.data.Rooms.RoomId,{ Status:"Active" , Name:res.data.Rooms.Name })));
    console.log("Quick Room Exists",res.data.Rooms);
    setflag(true);
    setActiveRoomId(RoomId);
    
  }
  else {createRoom();
    console.log("Quick Room Not Found Creating New->",RoomId);
  }
})
.catch(err=>{
  console.log("Error in QUick Room Initialization->");
  console.log(err);
})
}
},[]);

useEffect(()=>{
  if(ActiveRoomId){
    setMessages(new Map(Messages.clear()));
   
  axios.get(`/Server/QuickRoom/Message/load/${ActiveRoomId}`)
  .then(res=>{
    console.log("Messages of room loaded",res.data);
    const Temp=res.data;
    if(Temp){
    for(const message of Temp){
      Messages.set(message.MessageId,message);
    }
  }
    setMessages(new Map(Messages));
    setFlagLoadMessages(!flagLoadMessages);
  })
  .catch(err=>{
    console.log("Err in loading messages",err);
  });
  }
},[ActiveRoomId]);

useEffect(()=>{
  if(ActiveRoomId){
  setMembers(new Map(Members.clear()));
    axios.get(`/Server/QuickRoom/Members/load/${ActiveRoomId}`)
    .then(res=>{
       
      console.log("Members of room loaded",res.data);
      const Temp=res.data;
      if(Temp){
      for(const member of Temp){
        Members.set(member.UserId,member);
      }
    }
    if(!Members.has(UserName)) addUser();
      setMembers(new Map(Members));
    })
    .catch(err=>{
      console.log("Err in loading members",err);
    });
  }
},[ActiveRoomId]); 


var QuickRoomCount=1;
 const createRoom= async()=>{
  if(Rooms.size===0  && UserName){
  console.log("creating Quick Room->",RoomId);
  await axios.post(`/Server/QuickRoom/create/Room/${UserName}`,
    {
      RoomId:RoomId,
      Name:RoomId,
      Members : [{
        UserId:UserName,
        Name:Name,
        RoomId:RoomId
      }],
      Messages:[],
      RoomType : "quick"
  })
  .then(res=>{
    console.log("created new Quick room",res.data);
    var temp=res.data;
    setRooms(new Map(Rooms.set(temp.RoomId,{RoomId:temp.RoomId, Name:temp.Name})));
    setflag(true);
    setActiveRoomId(RoomId);
  })
  .catch(err=>{
    console.log("Err in creating Quick  room",err);
  });
}
}
var User_Name="Temp Name";
const sendMessage =async()=>{
  const x=document.getElementById('Message-TypeArea').value;
  console.log("Typed Message is " , x);
  console.log("Active room ->",ActiveRoomId);
  await axios.post(`/Server/QuickRoom/Message/add/${ActiveRoomId}`,
  {
    RoomId:ActiveRoomId,
     MessageText:x,
     TimeStamp:Date.now(),
     Sender:UserName,
     Name:Name,
     MessageId:new mongoose.Types.ObjectId().toString()
  })
  .then(res=>{
    console.log("Added New Message",res.data);
  })
  .catch(err=>{
    console.log("Err in Adding Message",err);
  });
}

const addUser=async(NewUser)=>{
  
  if(!Members.has(UserName)){
    console.log("User doesnt exist so adding->",UserName);
  await axios.post(`/Server/QuickRoom/add/User/${RoomId}`,
  {
   UserId:UserName,
   Name:Name,
   RoomId:RoomId
  })
  .then(res=>{
    console.log("Added new Member",res.data);
    setMembers(new Map(Members.set(UserName,{
      UserId:UserName,
      Name:Name,
      RoomId:ActiveRoomId
    })));
  })
  .catch(err=>{
    console.log("Err in adding Member",err);
  });
}
}

const deleteUser = async(UserName,RoomId) =>{

 await axios.post(`/Server/QuickRoom/Delete/Member/${RoomId}/${UserName}`)
.then(res=>{
  console.log(res.data);
}).catch(err=>{
  console.log(err);
});

}
//   window.addEventListener('beforeunload',function(e){
//     e.preventDefault();
//     deleteUser(UserName,ActiveRoomId);
  
// })

// window.addEventListener('unload',function(e){
//   e.preventDefault();
//   navigator.sendBeacon(`Server/Room/Delete/Member/${ActiveRoomId}/${UserId}`)
//   deleteUser(UserId,ActiveRoomId);
// });

useEffect(()=>{
return()=>{
deleteUser();
}
},[])

const [socket,setSocket] = useState(null);
console.log("socket ->",socket);
if(socket)
console.log("socket Id->",socket.id);
// useEffect(()=>{
  
//   if(socket===null){
//     console.log("setting socket->")
//   setSocket(io());
//   }
//   console.log("UseEeffcet Test");
//     if(socket){
//     socket.on("connect",()=>{
//       console.log("Socket connected-> Sending Rooms to server");
//       const roomsArray = [...Rooms].map(([key,value])=> key);
//   console.log(roomsArray);
//   roomsArray.push(UserName);
//   socket.emit("joinRoom",roomsArray);
// });

//     }
    
     
//     return ()=>{
//       if(socket){
//      socket.removeAllListeners();  
       
//     }
    
//   }
// },[Rooms,socket]);


// useEffect(()=>{
//   if(socket){
// console.log("socket Id is ",socket.id);
   
//    socket.on('update',data=>{
//      if(Object.keys(data).length>4){
//        setMsg(data);
//        setLastMsg(data);
//        console.log("new  message in socket",data);
//      }
//      else if(Object.keys(data).length==4){
//        setmem(data);
//        console.log("new  member in socket",data);
//      }
//    });
//    socket.on("disconnected",data=>{
//     if(data){
//       ActiveMembers.delete(data);
//       setActiveMembers(new Map(ActiveMembers));
//     console.log("Socket User Left fired",data);
//     }
//    })
//    socket.on('connected',data=>{
//       if(data){
//         setActiveMembers(new Map(ActiveMembers.set(data,Members.get(data))));
//       }
//       console.log("socket USer joined room->",data);
//    })
  
//     socket.on("MemberStatusResponse",data=>{
//       console.log("socket Active Members in Room are ",data);
//       const AM =new Map();
//       ActiveMembers.clear();
//       if(Array.isArray(data)){
//         data.forEach(userId=>{
//             ActiveMembers.set(userId,Members.get(userId));
//         })
//       }
//       setActiveMembers(new Map(ActiveMembers));
//     })
//   }
// return ()=>{
//   if(socket){
//  socket.removeAllListeners();  
//      socket.disconnect();
// }
// }

// },[socket,ActiveRoomId]);

// useEffect(()=>{
//   if(socket){
//   socket.emit("MemberStatus",ActiveRoomId);
//   }
// },[ActiveRoomId])

//const [socket,setSocket] = useState(null);
console.log("Socket is",socket);
var count=0
useEffect(()=>{
  const port = process.env.fakePort;
  console.log("window hostname",window.location.hostname);
  if(socket===null)
  setSocket(io());
 ++count;
 
  
  
    if(socket && !Conn){
    socket.on("connect",()=>{
      console.log("Sending rooms to socket, count->",count);
      console.log(socket.id);
      var roomsArray=[];
[...Rooms].map(([key,value])=> roomsArray.push(key));
roomsArray.push(UserName);
console.log(roomsArray);
  socket.emit("joinRoom",roomsArray); 
  setConn(true);
});

    }

    return ()=>{
      if(socket){
      socket.on('disconnect', () => { 
        console.log("disccoented");
        socket.removeAllListeners();  
        socket.off("connect"); 
       
     });
     
    }
    
  }
},[flag]);


useEffect(()=>{
  if(socket){
console.log("socket Id is ",socket.id);
   
   socket.on('update',data=>{
     if(Object.keys(data).includes("MessageId")){
       setMsg(data);
       setLastMsg(data);
       console.log("new  message in socket",data);
     }
     else if(Object.keys(data).includes("UserId")){
       setmem(data);
       console.log("new  member in socket",data);
     }
    
   });

  socket.on('insert',data=>{
    console.log("New Room Detected in Socket",data)
    if(data){
   //   socket.emit("joinRoom",[data.RoomId,UserName]);
      console.log("Debug socket-> sending rooms to  from useeffect main");
    }
    setroom(data);
  });

  
    
  socket.on("disconnected",data=>{
    console.log("User Left Socket fired");
    if(data && Members.has(data)){
      ActiveMembers.delete(data);
      setActiveMembers(new Map(ActiveMembers));
    console.log("Socket User Left fired",data);
    }
   })
   socket.on('connected',data=>{
      if(data){
        setActiveMembers(new Map(ActiveMembers.set(data,Members.get(data))));
      }
      console.log(" USer joined room->",data);
   })
  
    socket.on("MemberStatusResponse",data=>{
      console.log("Active Members in Room are ",data);
      const AM =new Map();
      ActiveMembers.clear();
      if(Array.isArray(data)){
        data.forEach(userId=>{
            ActiveMembers.set(userId,Members.get(userId));
        })
      }
      setActiveMembers(new Map(ActiveMembers));
    })

  }
return ()=>{
  if(socket){
  
    console.log("disccoented");
    socket.removeAllListeners();  
    
     socket.disconnect();
}
}

},[socket]);


useEffect(()=>{
  if(socket){
    console.log("asking active members for room",ActiveRoomId);
  socket.emit("MemberStatus",ActiveRoomId);
  }
},[ActiveRoomId,flag,RoomId,Rerender])

console.log("Active Members->",ActiveMembers);
useEffect(() => {

 
    //  [...Rooms.keys()].map(romId=>{
       
    //  });


    
  























  //    //Pusher.logToConsole = true;
      var pusher = new Pusher('d3a40ccf8c32cd64d3ac', {
       cluster: 'ap2',
       encrypted:true,
     });
  
     var deleteChannel = pusher.subscribe('delete');
     deleteChannel.bind('Message',function(data){console.log("Pusher -> delete message",data);
     if(data){ console.log(ActiveRoomId,data.RoomId);
       if(data.RoomId===ActiveRoomId)
       setdelmsg(data);
     }
     });
     deleteChannel.bind('Member',function(data){console.log("Pusher -> delete member",data);
       if(data){ 
        if(data.RoomId===ActiveRoomId){
          console.log("Member deleted");
         setdelmem(data);
        }
       }
     });
     deleteChannel.bind('Room',function(data){
      if(data){
        if(data.UserId===UserName)
        setdelroom(data);
      }
    });
  
  // var MessageChannel = pusher.subscribe('Messages');
  // MessageChannel.bind('inserted', function(data) {
  //  setLastMsg(data);
  //  if(ActiveRoomId===data.RoomId) setMsg(data);
  //   console.log("Triggered pusher-> Message added",data);
  //   console.log("Active ->",ActiveRoomId,"newmessage ->", data.RoomId, ActiveRoomId===data.RoomId);
    
    
  // });
  
    
  // MessageChannel.bind('deleted', function(data) {
   
  //   console.log("Triggered pusher-> Message deleted",data);
   
  //  //iterate and set all messages as data is full messages array
  // });
  
  // MessageChannel.bind('updated', function(data) {
    
  //   console.log("Triggered pusher-> Message updated",data);
  //   setLastMsg(data);
   
  // });
  
  // var MemberChannel = pusher.subscribe("Members");
  // MemberChannel.bind('inserted', function(data) {
  //   setmem(data);
  //   console.log("Triggered pusher-> Member added",data);
    
  // });
  
  // MemberChannel.bind('deleted', function(data) {
  //   console.log("Triggered pusher-> Member deleted",data);
  //  //iterate and set
  //  setdelmem(data);
  // });
  
  // MemberChannel.bind('updated', function(data) {
  //  setmem(data);
  //   console.log("Triggered pusher-> Member updated",data);
   
  // });
  
  // var RoomChannel = pusher.subscribe('Rooms');

  // RoomChannel.bind('inserted', function(data) {
  //   if(data){
  //   console.log("Triggered pusher-> Room added",data.NewRoom);
  //  setroom(data.NewRoom);
  // }
  // });
  
  // RoomChannel.bind('deleted', function(data) {
  //   console.log("Triggered pusher-> Room deleted",data);
  //   setdelroom(data);
  // });
  
  // RoomChannel.bind('updated', function(data) {
  //   setroom(data);
  //   console.log("Triggered pusher-> Room updated",data);
    
    
  // });
  // return () => {
  //   pusher.unsubscribe("Messages");
  //   pusher.unsubscribe("Members");
  //   pusher.unsubscribe("Rooms");
  // };
  return ()=>{
    pusher.unsubscribe('delete');
  };
  
}, []);




useEffect(() => {console.log("New Message useEffect fired  ",msg);
if (msg) { console.log("New Message is ",msg);
const temp=msg;
setMessages(new Map(Messages.set(temp.MessageId,temp)));
scrollToBottom();
}
}, [msg]);

useEffect(() => {console.log("New LastMessage useEffect fired  ",Lastmsg);
if(Lastmsg){
const temp=Lastmsg;
setLastMessage(new Map(LastMessage.set(temp.RoomId,temp.MessageText)));
 //if (Lastmsg) setLastMessage(new Map(LastMessage.set(Lastmsg.RoomId,Lastmsg)));
}
}, [Lastmsg]);

useEffect(() => {console.log("New Member useEffect fired  ",mem);
if (mem) { console.log("New Member is ",mem);
const temp=mem;
setMembers(new Map(Members.set(temp.UserId,temp)));
}
}, [mem]);


useEffect(() => {
if (room) {
  const temp=room;
  console.log("New Room is",room);
  console.log("New Room Id is",temp.RoomId);
   setRooms(new Map(Rooms.set(temp.RoomId,{RoomId:temp.RoomId, Name:temp.Name})));
  
//    if(room.UserId === UserName) setRooms(new Map(Rooms.set(room.RoomId,"inactive")));
}
}, [room]);

useEffect(() => {console.log("delete Message useEffect fired  ",msg);
if (delmsg && Messages.has(delmsg.RoomId)) { console.log("delete Message is ",delmsg);
const temp=delmsg;
if(ActiveRoomId===temp.RoomId){
Messages.delete(temp.MessageId);
const X=Messages;
setMessages(new Map(X));
}
}
}, [delmsg]);

useEffect(() => {
  console.log("Delete Member USeEffect Fired->",delmem);
if(delmem && Members.has(delmem.UserId)){
const temp=delmem;
console.log("testting delete member roomid",ActiveRoomId===delmem.RoomId)
  console.log("delete member useEffect fired  ",delmem.UserId);
  Members.delete(temp.UserId);
  const X=Members;
setMembers(new Map(X));
 //if (Lastmsg) setLastMessage(new Map(LastMessage.set(Lastmsg.RoomId,Lastmsg)));
}
}, [delmem]);

useEffect(() => {
if (delroom) {
  console.log("delete room use effect fired for ", delroom);
  const temp=delroom;
  if(Rooms.has(temp.RoomId)){
    Rooms.delete(temp.RoomId);
    const X=Rooms;
    setRooms(new Map(X));}
    //    if(room.UserId === UserName) setRooms(new Map(Rooms.set(room.RoomId,"inactive")));
}
}, [delroom]);


useEffect(()=>{
window.addEventListener('resize',function(e){
const wid = window.innerWidth;
const hei = window.innerHeight;
var x =document.getElementById("Room-Container-Wrapper");
  var y = this.document.getElementById("Chat-Container-Wrapper");
if(wid<=600){  console.log("Debug Active Window -> Active Window now chatwindow -> width<600px && window===both");
   if(x && !x.classList.contains("Hide") && y && !y.classList.contains("Hide")){
    x.classList.add("Hide");
   }
}
else if(wid>600){ 
  
  if(x && x.classList.contains("Hide")) x.classList.remove("Hide");
  if(y && y.classList.contains("Hide")) y.classList.remove("Hide");
console.log("Debug Active Window -> Active Window now Both -> width>600px")
}
});
return()=>{
 window.removeEventListener('resize',function(){
  console.log("Removed Event")
 })
};
},[])


console.log("Members before rendering are",Members);
console.log("Rooms before rendering are",Rooms);
   const loadMessages= (RoomId) =>{
      setActiveRoomId(RoomId);
   }
   var count=0;
console.log(LastMessage);
    var width,height;


    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      var objDiv = document.getElementById("ScrollDownDiv");
objDiv.scrollIntoView(false);
    }
    useEffect(() => {
      scrollToBottom();
    }, [flagLoadMessages]);
 
    var ChatWindowOptionsX=null;
    
       
    return (
     <div className="ContentWrapper">
       
       <div className ={"Room-container-Wrapper" + (ActiveWindow==="ChatWindow"? " Hide" : "")}>
        
        <div className="Room-container">
        
        <div className="Room-Header-Wrapper">
            <div className="Room-Header-scopeSwitch">
               <ChatScopeSwitch>
                   
                </ChatScopeSwitch>
           </div>
           <div className="Room-Header-contents">
           <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '89%' }}
    >
      <div className='RoomSearchBarContainer' id="RoomSearchBarContainer">
      <InputBase
      id="RoomSearchBar"
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Rooms"
        inputProps={{ 'aria-label': 'Search Rooms' }}
      />
      <IconButton type="submit" sx={{ p: '10px' , flex:0.3 }} aria-label="search">
        <SearchIcon />
      </IconButton>
      </div>
     
    </Paper>
             {/* <IoMdMore className="OptionsMenu-RoomHeader"/> */}
             
             
           </div>
           </div>
           <div className="Room-Window-Wrapper">
           <div className="Room-Window">
              
        {/*  add rooms */}
        {
       
          [...Rooms.keys()].map(roomid=>{
           
            return(
           <div onClick={()=>{
                   setRerender(Rerender+1);
                    width = document.body.clientWidth;
                    width = document.body.clientWidth;
                    var x =document.getElementById("Room-Container-Wrapper");
                    var y = document.getElementById("Chat-Container-Wrapper")
                     console.log("Active RoomID is ",ActiveRoomId , roomid, ActiveRoomId===roomid);
                   if(width<=600){
                    if(y && y.classList.contains("Hide")) y.classList.remove("Hide");
                    if(x && !x.classList.contains("Hide")) x.classList.add("Hide");
                   }
                  
                  }}>
           <ProfileDisplay ProfileName={roomid} LastMessage={LastMessage.get(roomid)}/>
           </div>
            );
          })
        }
            </div>
           </div>

        </div>
        </div>

        <div className={"Chat-container-Wrapper" +(ActiveWindow==="RoomWindow"? " Hide":"") }
        id="Chat-Container-Wrapper"
        >
            <div className="Chat-Container"  >
        <div className="Chat-Header-Wrapper" 
       >
            <div className="Chat-Header"
            
            >
              <div className='backArrow-ChatHeader'>
                <ArrowBackIcon className={"BackArrow-ChatWindow BackArrowRes backArrow-ChatHeader"} 
                onClick={()=>{setActiveWindow("RoomWindow")}}
                sx={{
                  width:'40px' , height:'30px'
                }}
                />
                </div>
                <div className="RoomDetails-Wrapper-ChatHeader"
                 onClick={(e)=>{
                  
                  
                   var y =document.getElementById("Room-Container-Wrapper");
                   var x = document.getElementById("Chat-Container-Wrapper")
                    var wid = document.body.clientWidth;
                  if(wid<=600){
                   if(y && y.classList.contains("Hide")) y.classList.remove("Hide");
                   if(x && !x.classList.contains("Hide")) x.classList.add("Hide");
                  }
                 }}
                >
                  <img className='RoomDetails-Avatar-ChatHeader'  src="" alt="error" />
                  <div className='RoomDetails-Name-ChatHeader'>
                    {RoomId}
                  </div>
                </div>
                <div className='RoomOptions-ChatHeader'>
                  <div className='RoomDetails-ChatHeader'>
                  </div>
                  <div className='Search-ChatHeader'>
                  <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '89%' }}
    >
      <div className='ChatSearchBarContainer' id="ChatSearchBarContainer">
      <InputBase
      id="ChatSearchBar"
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Chat"
        inputProps={{ 'aria-label': 'Search Chat' }}
      />
      <IconButton type="submit" sx={{ p: '10px' , flex:0.3 }} aria-label="search">
        <SearchIcon />
      </IconButton>
      </div>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <ChatWindowOptions Members={Members}  ActiveRoomId={ActiveRoomId}  />
    </Paper>
                  </div>{console.log("Active Room id is->",ActiveRoomId)}
                
                </div>  
                </div>
            </div>
           
            <div className="Chat-Box-Wrapper" id="Chat-Box-Wrapper" >
            <div className="Chat-Box">
               {console.log(Messages.size)}
            { 
                 [...Messages.keys()].map(message=>{ 
                  var time =new Date(Messages.get(message).TimeStamp);
                  time= time.toString().split(' ');
                  console.log("Time parts",time);
                 time=time[1]+ " " + time[2] + " "+ time[3] + " " + time[4] ;
                   return(
                     <Message 
                     own={Messages.get(message).Sender===UserName}
                     MessageText={Messages.get(message).MessageText}
                     Name={Messages.get(message).Name}
                     TimeStamp={time}
                     />
                   );
                 })
            }
            <div ref={messagesEndRef} id="ScrollDownDiv" />
            </div>
            <div className='Members-Wrapper-ChatContainer'>
              <p className='WhiteTextOnDarkBG H2'>
              Members:  </p>
              <div className='MembersList-ChatContainer'>

                  {
                    [...ActiveMembers.keys()].map(key=>{ if(!Members.get(key)) return null
                      return(
                        <div className='MemberWrapper-ChatContainer'>
                      <div className="MemberName-ChatContainer ActiveMember-Online">
                         {Members.get(key).Name} 
                      </div>
                      <div className='MemberStatus-ChatContainer'>

                      </div>
                    </div>
                      )
                    })
                  }


                {
                  [...Members.keys()].map(key=>{ if(ActiveMembers.has(key)) return null;
                    return(
                    <div className='MemberWrapper-ChatContainer'>
                      <div className="MemberName-ChatContainer">
                        {Members.get(key).Name}
                      </div>
                      <div className='MemberStatus-ChatContainer'>

                      </div>
                    </div>
                    )
                  })
                }
              </div>
             </div>
            </div>
            <div className="Type-Menu">
               
                <div className="emoji-Stickers">

                </div>
            </div>
        
        
        <div className='TypeArea'>
          <div className='TypeBox-Container'>
          <TextField
          id="Message-TypeArea"
          label="Message"
          placeholder="Message"
          multiline 
          maxRows={3}
          
          
          onKeyPress={(ev) => {
            if (ev.key === 'Enter') {
             if(ev.shiftKey){ sendMessage();
              ev.preventDefault();
             }
            }
          }}
          sx={{width:'90%',margin:'10px', maxWidth:'700px'  , boxShadow:4}}
        /> 
          
          
          </div>
          <div className='TypeArea-SendButton'>
                   <IoMdSend  
                   className='Chat-SendButton'
                   
                   onClick={()=>{ 
                    var typedMssg = document.getElementById('Message-TypeArea').value;
                    console.log("Submitted Message  is " , typedMssg);
                       if(typedMssg.length>0)
                       sendMessage();
                       else alert("Type atleast 1 Letter");
                   }}  
                   
                   />
          </div>
        </div>
        </div>
        </div>
    
        <div className='RoomDetails-FullDetails Hide'
            id="RoomDetails-FullDetails"
            >
            <div className='RoomInside-DetailsHeader'>
            <ArrowBackIcon className={"BackArrow-ChatWindow BackArrowRes backArrow-ChatHeader"} 
                onClick={()=>{
                 var x =document.getElementById("RoomDetails-FullDetails");
                 if(x)  x.classList.add("Hide");
                 x=document.getElementById("Chat-Container-Wrapper");
                 if(x) x.classList.remove("Hide");
                }}
                sx={{
                  width:'40px' , height:'30px'
                }}
                />
            </div> 
            Members : 
             <div className='RoomInside-MembersList'>
             {
              [...ActiveMembers.keys()].map(mem=>{ if(!Members.has(mem)) return null
                return(
                  <div className="Member-InsideDetailsList-Wrapper">
                    <img className="MemberAvatar-InsideDetailsList"  src="" alt="error" />
                    <div className='MemberName-InsideDetailsList ActiveMember-Online'>
                      {Members.get(mem).Name}
                    </div>
                  </div>
                )
              })
             }
              {
                [...Members.keys()].map(key=>{if(ActiveMembers.has(key)) return null;
                  return(
                    <div className="Member-InsideDetailsList-Wrapper">
                      <img className="MemberAvatar-InsideDetailsList"  src="" alt="error" />
                      <div className='MemberName-InsideDetailsList'>
                        {Members.get(key).Name}
                      </div>
                    </div>
                  )
                })
              }
             </div>
            </div>

        </div>
    );
}

export default ChatWindow;