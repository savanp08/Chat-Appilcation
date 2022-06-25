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
import Post from '../Posts/Posts.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import fontawesome from '@fortawesome/fontawesome'
import AttachFileIcon from '@mui/icons-material/AttachFile';







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
const [RoomId, setRoomId] = useState(""); 
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
const [DisplayDataType,setDisplayDataType] = useState("MainMessages");
const [Posts,setPosts] = useState(new Map());
const [Queries,setQueries] = useState(new Map());
const [post,setpost] = useState();
const [query,setquery]  = useState();
const [FullRoomData,setFullRoomData] = useState(new Map());
const [PostImages, setPostImages] = useState();
const [ActiveMembers,setActiveMembers] = useState(new Map());

const params= useParams();
userid= params.UserName;

UserName=userid;
if(!UserName){
  window.location.replace(`/Login`);
}
console.log(UserName , "userName->");
useEffect(()=>{
  
  const AccessToken = localStorage.getItem(`User ${UserName}`);
  console.log("fetched from local->")
    console.log(AccessToken);
  axios.get('/Server/Auth/TokenValidate', {headers:{"authorization" : `Bearer ${AccessToken}`  }}).then(Response=>{
     
   if(Response.data.resval === "TokenVerified")
   { 
       
        console.log("Token Verified");
   }
   else{
     window.location.replace(`/Login`);
   }
 console.log(Response.data); 
 
}).catch(error=>{
 console.log(error);
});

},[]);

useEffect(()=>{
  if(UserName){
console.log("Loading Rooms as new Room detected or page loaded->");
  axios.get(`/Server/Rooms/Room/load/${UserName}`)
  .then(res=>{
     console.log("Rooms Loaded",res.data);
     res.data.forEach(room=>{
       Rooms.set(room.RoomId,{
        Status:"Active",
        Name:room.Name
       });
     });
     setRooms(new Map(Rooms));
     setflag(true);
  })
  .catch(err=>{
    console.log("Error in Loading rooms",err);
  });

  }
},[room]);

useEffect(()=>{
  if(ActiveRoomId){
    setMessages(new Map(Messages.clear()));
   
   axios.get(`/Server/Rooms/Message/load/${ActiveRoomId}`)
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


  setPosts(new Map(Posts.clear()));

   axios.get(`/Server/Rooms/load/Posts/${ActiveRoomId}`)
  .then(res=>{
    console.log("Posts Fetched ->",res.data);
    const Temp=res.data;
    if(Temp){
    for(const post of Temp){
      Posts.set(post.PostId,post);
    }
  }
    setPosts(new Map(Posts));
  })
  .catch(err=>{
    console.log("Error While fetching Posts",err);
  });
   
  setQueries(new Map(Queries.clear()));
   axios.get(`/Server/Rooms/Queries/load/${ActiveRoomId}`)
  .then(res=>{
    console.log("Queries Fetched ->",res.data);
    const Temp=res.data;
    if(Temp){
    for(const query of Temp){
      Queries.set(query.QueryId,query);
    }
  }
    setQueries(new Map(Queries));
  })
  .catch(err=>{
    console.log("Error While fetching Queries",err);
  });

}
},[ActiveRoomId]);

useEffect(()=>{
  if(ActiveRoomId){
  setMembers(new Map(Members.clear()));
    axios.get(`/Server/Rooms/Members/load/${ActiveRoomId}`)
    .then(res=>{
       
      console.log("Members of room loaded",res.data);
      const Temp=res.data;
      if(Temp){
      for(const member of Temp){
        Members.set(member.UserId,member);
      }
    }
      setMembers(new Map(Members));
    })
    .catch(err=>{
      console.log("Err in loading members",err);
    });
  }
},[ActiveRoomId]); 


useEffect(()=>{
  setFullRoomData(new Map());
  axios.get(`/Server/Rooms/GetFullRooms/${UserName}`)
  .then(res=>{
    console.log("Full Rooms and thier Data Fetched->",res.data);
    const temp = res.data;
    
    temp.forEach(room=>{
      
       const msgMap = new Map();
       const PostsMap = new Map();
       const QueriesMap = new Map();
       const MemMap = new Map();
       room.Messages.forEach(msg=>{
        msgMap.set(msg.MessageId,msg);
       });
       room.Posts.forEach(pos=>{
         PostsMap.set(pos.PostId,pos);
       });
       room.Queries.forEach(que=>{
        QueriesMap.set(que.QueryId,que);
       });
room.Members.forEach(mem=>{
     MemMap.set(mem.UserId,mem);
});

       FullRoomData.set(room.RoomId , {
        RoomId:room.RoomId,
        Name: room.Name,
        Messages : msgMap,
        Posts: PostsMap,
        Queries : QueriesMap,
        RoomType:room.RoomType,
        Members:MemMap
       });
    });
    console.log("Full Room Data is ->",FullRoomData);
    setFullRoomData(new Map(FullRoomData));
  })
  .catch(err=>{
    console.log("Error in fecthing full data of rooms of user->");
    console.log(err);
  })
},[Rooms])


useEffect(()=>{
  if(DisplayDataType==="Messages"){
    
  }
  else if(DisplayDataType === "Posts"){

  }
  else if(DisplayDataType === "Queries"){

  }
},[DisplayDataType])





const [socket,setSocket] = useState(null);
console.log("Socket is",socket);
useEffect(()=>{
  const port = process.env.fakePort;
  console.log("window hostname",window.location.hostname);
  if(socket===null)
  setSocket(io());
 
 
  
  
    if(socket){
    socket.on("connect",()=>{
      console.log(socket.id);
     var roomsArray=[];
[...Rooms].map(([key,value])=> roomsArray.push(key));
roomsArray.push(UserName);
console.log(roomsArray);
socket.emit("joinRoom",roomsArray); 
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
     else if(Object.keys(data).includes("PostId")){
      setpost(data);
      console.log("new  post in socket",data);
     }
     else if(Object.keys(data).includes("QueryId")){
      setquery(data);
      console.log("new  Query in socket",data);
     }
   });

  socket.on('insert',data=>{
    console.log("New Room Detected in Socket",data)
    if(data){
      socket.emit("joinRoom",[data.RoomId,UserName]);
    }
    setroom(data);
  });

  
    
  socket.on("disconnected",data=>{
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
  socket.emit("MemberStatus",ActiveRoomId);
  }
},[ActiveRoomId])
console.log("Active Members->",ActiveMembers);

var QuickRoomCount=1;
 const createRoom= async()=>{
  var NewRoomId = new mongoose.Types.ObjectId();
  NewRoomId=NewRoomId.toString();
  console.log("Creating Room with->",NewRoomId);
  socket.emit("joinRoom",NewRoomId);
  // await axios.post(`/Room/create/${UserName}`,
  //   {
  //     RoomId:NewRoomId,
  //     Name:NewRoomName,
  //     Members : [{
  //       UserId:UserName,
  //       Name:name,
  //       RoomId:NewRoomId
  //     }],
  //     Messages:[],
  //     RoomType : "Auth"
  // })
  // .then(res=>{
  //   console.log("created new room",res.data);
   
  // })
  // .catch(err=>{
  //   console.log("Err in creating room",err);
  // });
}
var User_Name="Temp Name";
const sendMessage =async()=>{
  var NewMessage = Messages.get("Message-TypeComponent");
  console.log("Debugging FileUpload-> New Message->",NewMessage);
  if(NewMessage && Messages.has("Message-TypeComponent")){
   Messages.delete("Message-TypeComponent");
   var files = document.getElementById("Message-ImageAttach-Input");
   var MessageText = document.getElementById("Message-TypeArea").value;
   var NewMessageId = new mongoose.Types.ObjectId().toString();
   if(!MessageText) MessageText="";
   console.log("Debugging FileUpload-> Files->",files.file , files.files);
   
   const formData  = new FormData();
   if(files && files.files){
    console.log("Debugging FileUpload-> Files Found->",files.files);
    const NewFiles=[];
    var x = files.files;
    console.log("Debug->",x,Array.isArray(x),Object.keys(x))
    
    Object.keys(x).forEach(index=>{
      formData.append("image",x[index],x[index].path);
     })
    
    console.log("Debugging FileUpload->  Type of ->",)
  //  formData.append("image",NewFiles);
    console.log("Debugging FileUpload-> New Files Array->",NewFiles);
  }
  var date  = Date.now();
   formData.append("Sender",UserName);
   formData.append("MessageText",MessageText);
   formData.append("MessageId",NewMessageId);
   formData.append("RoomId",ActiveRoomId);
   formData.append("TimeStamp",date)
   for (var pair of formData.entries()) {
    console.log("Debug-> FormData->",pair[0]+ ', ' + pair[1]); 
}
   await axios.post(`/Server/Rooms/Message/add/${ActiveRoomId}`,
   formData,
   {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
  }
   )
   .then(res=>{
    console.log("Message Insertion Response->",res);
    document.getElementById("Message-TypeArea").value="";
   })
   .catch(err=>{
    console.log("Message Insertion Error->",err);
   })
  }
}

const sendPost = async() =>{
  var NewPost = Posts.get("Post-TypeComponent");
  console.log("Debugging FileUpload-> New Post->",NewPost);
  if(NewPost && Posts.has("Post-TypeComponent")){
   Posts.delete("Post-TypeComponent");
   var files = document.getElementById("Post-ImageAttach-Input");
   var PostText = document.getElementById("Post-TypeArea").value;
   var NewPostId = new mongoose.Types.ObjectId().toString();
   if(!PostText) PostText="";
   console.log("Debugging FileUpload-> Files->",files.files);
   
   const formData  = new FormData();
   if(files && files.files && files.files.length>0){
    console.log("Debugging FileUpload-> Files Found->",files.files);
    const NewFiles=[];
    var x = files.files;
    console.log("Debug->",x,Array.isArray(x),Object.keys(x))
    Object.keys(x).forEach(index=>{
     formData.append("image",x[index],x[index].path);
    })
    console.log("Debugging FileUpload->  Type of ->",)
  //  formData.append("image",NewFiles);
    console.log("Debugging FileUpload-> New Files Array->",NewFiles);
  }
   formData.append("Sender",UserName);
   formData.append("PostText",PostText);
   formData.append("PostId",NewPostId);
   formData.append("RoomId",ActiveRoomId);
   for (var pair of formData.entries()) {
    console.log("Debug-> FormData->",pair[0]+ ', ' + pair[1]); 
}
   await axios.post(`/Server/Rooms/add/Post/${ActiveRoomId}`,
   formData,
   {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
  }
   )
   .then(res=>{
    console.log("Post Insertion Response->",res);
    document.getElementById("Post-TypeArea").value="";

   })
   .catch(err=>{
    console.log("Post Insertion Error->",err);
   })



  }
  
}




const addUser=async(NewUser)=>{
  await axios.post(`/Server/Rooms/Room/add/User/${ActiveRoomId}`,
  {
   UserId:NewUser.UserId,
   Name:NewUser.Name,
   RoomId:ActiveRoomId
  })
  .then(res=>{
    console.log("Added new Member",res.data);
  })
  .catch(err=>{
    console.log("Err in adding Member",err);
  });
}

const deleteUser = async(UserName,RoomId) =>{

 await axios.post(`/Server/Rooms/Room/Delete/Member/${RoomId}/${UserName}`)
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
//   navigator.sendBeacon(`/Room/Delete/Member/${ActiveRoomId}/${UserId}`)
//   deleteUser(UserId,ActiveRoomId);
// });


const FilterRooms = () =>{
  var FilterQuery = document.getElementById("RoomSearchBar").value;
  console.log("search filter is ",FilterQuery);
  var list = document.getElementById("Room-Window");
   list = list.getElementsByClassName("RoomComponentWrapperDiv");
  console.log("Rooms list for litering are->",list);
    for(var i=0;i<list.length;i++){
      const x = list[i].getElementsByClassName("User-ProfileName")[0];
      console.log("Sub Div in filtering loop",x.childNodes[0].nodeValue);
      const y = x.childNodes[0].nodeValue;
      if(y.toLowerCase().includes(FilterQuery.toLocaleLowerCase())){
      list[i].style.display="";
       console.log("Element checking for filterting in remove Room",y);
      }
      else
      list[i].style.display="none";
    }
}




useEffect(() => {

 
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
if(ActiveRoomId===msg.RoomId)
setMessages(new Map(Messages.set(temp.MessageId,temp)));
if(msg.Sender===UserName) scrollToBottom();
//setFullRoomData(new Map(FullRoomData.get(msg.RoomId).Messages.set(msg.MessageId,msg)));
console.log("After inserting new Message the Full Room Data is ->",FullRoomData);
}
}, [msg]);

useEffect(() => {console.log("New Post useEffect fired  ",msg);
if (post) { console.log("New Post is ",post);
const temp=post;
if(ActiveRoomId===post.RoomId)
setPosts(new Map(Posts.set(temp.PostId,temp)));
if(post.Sender===UserName) scrollToBottom();
//setFullRoomData(new Map(FullRoomData.get(post.RoomId).Posts.set(post.PostId,post)));
console.log("After inserting new Post the Full Room Data is ->",FullRoomData);
}
}, [post]);

useEffect(() => {console.log("New Query useEffect fired  ",msg);
if (query) { console.log("New Query is ",query);
const temp=query;
if(ActiveRoomId===query.RoomId)
setQueries(new Map(Queries.set(temp.QueryId,temp)));
if(query.Sender===UserName) scrollToBottom();
//setFullRoomData(new Map(FullRoomData.get(query.RoomId).Queries.set(query.QueryId,query)));
console.log("After inserting new Query the Full Room Data is ->",FullRoomData);
}
}, [query]);




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
   setRooms(new Map(Rooms.set(temp.RoomId,{status:"inactive", Name:temp.Name})));
  
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
if(delmem && Members.has(delmem.UserId)){
  
const temp=delmem;
console.log("testting delete member roomid",ActiveRoomId===delmem.RoomId)
if(ActiveRoomId===temp.RoomId) {
  console.log("delete member useEffect fired  ",delmem.UserId);
  Members.delete(temp.UserId);
  const X=Members;
setMembers(new Map(X));
}
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
window.addEventListener('resize',function(e){ console.log("Debug Active Window fired-> current window",ActiveWindow);
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
 window.removeEventListener("resize",function(){

 })
};
},[])
console.log("Debug -> Active Window =",ActiveWindow);

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
      var objDiv = document.getElementById("MessagesScrollDownDiv");
objDiv.scrollIntoView(false);
    }
    useEffect(() => {
      scrollToBottom();
    }, [flagLoadMessages]);
 
    var ChatWindowOptionsX=null;
    

  const ScrollToBottomCustom =(div,Container)=>{
    if(div){
      var x= div.offsetTop;
     var y = Container;
      if(y){
        y.scrollTop = x;
      }
    }
  }

       
    return (
     <div className="ContentWrapper">
       
       <div className ={"Room-container-Wrapper" + (ActiveWindow==="ChatWindow"? " Hide" : "")} id="Room-Container-Wrapper"  >
        
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
      onChange={(e)=>{
        FilterRooms();
      }}
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Rooms"
        inputProps={{ 'aria-label': 'Search Rooms' }}
      />
      <IconButton  sx={{ p: '10px' , flex:0.3 }} aria-label="search">
        <SearchIcon />
      </IconButton>
      </div>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <RoomHeaderOptions Rooms={Rooms} socket={socket} />
    </Paper>
             {/* <IoMdMore className="OptionsMenu-RoomHeader"/> */}
             
             
           </div>
           </div>
           <div className="Room-Window-Wrapper">
           <div className="Room-Window" id="Room-Window">
              
        {/*  add rooms */}
        {
      
          [...Rooms.keys()].map(roomid=>{
           
            return(
           <div className="RoomComponentWrapperDiv" id="RoomComponentWrapperDiv"
           onClick={()=>{ 
            setActiveRoomId(roomid);
            document.getElementById("Chat-Header-Details-Name").innerHTML=Rooms.get(roomid).Name;
                    width = document.body.clientWidth;
                    var x =document.getElementById("Room-Container-Wrapper");
                    var y = document.getElementById("Chat-Container-Wrapper")
                     console.log("Active RoomID is ",ActiveRoomId , roomid, ActiveRoomId===roomid);
                   if(width<=600){
                    if(y && y.classList.contains("Hide")) y.classList.remove("Hide");
                    if(x && !x.classList.contains("Hide")) x.classList.add("Hide");
                   }
            }}
                   >
           <ProfileDisplay ProfileName={Rooms.get(roomid).Name} LastMessage={LastMessage.get(roomid)}/>
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
            <div className="Chat-Container">
        <div className="Chat-Header-Wrapper">
            <div className="Chat-Header">
              <div className='backArrow-ChatHeader'>
                <ArrowBackIcon className={"BackArrow-ChatWindow BackArrowRes backArrow-ChatHeader"} 
                onClick={()=>{
                  var y =document.getElementById("Room-Container-Wrapper");
                    var x = document.getElementById("Chat-Container-Wrapper")
                     var wid = document.body.clientWidth;
                   if(wid<=600){
                    if(y && y.classList.contains("Hide")) y.classList.remove("Hide");
                    if(x && !x.classList.contains("Hide")) x.classList.add("Hide");
                   }
                
                }}
                sx={{
                  width:'40px' , height:'30px'
                }}
                />
                </div>
                <div className="RoomDetails-Wrapper-ChatHeader"
                 onClick={(e)=>{
                  console.log("Debug Window-> Room Clicked ");
                   var ChatContainer=document.getElementById("Chat-Container-Wrapper");
                   if(ChatContainer){
                     ChatContainer.classList.add("Hide");
                     var RoomDetails = document.getElementById("RoomDetails-FullDetails");
                     if(RoomDetails){
                      RoomDetails.classList.remove("Hide");
                     }
                   }
                 }}
                >
                  <img className='RoomDetails-Avatar-ChatHeader'  src="" alt="error" />
                  <div className='RoomDetails-Name-ChatHeader' id="Chat-Header-Details-Name" >
                    
                  </div>
                </div>
                <div className='RoomOptions-ChatHeader'>
                  <div className='RoomDetails-ChatHeader'>
                  </div>
                  <div className='Search-ChatHeader'>
                  <Paper
                    component="form"
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '89%' ,marginRight:'5vw'}}
                    >
                   <div className='ChatSearchBarContainer' id="ChatSearchBarContainer">
                   <InputBase
                       id="ChatSearchBar"
                       onChange={()=>{
                        //FilterChat()
                       }}
                       sx={{ ml: 1, flex: 0.8 }}
                       placeholder="Search Chat"
                       inputProps={{ 'aria-label': 'Search Chat' }}
      />                 
      <IconButton  sx={{ p: '10px' , flex:0.3 }} aria-label="search">
        <SearchIcon 
        
        />
      </IconButton>
      </div>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <ChatWindowOptions Members={Members}  ActiveRoomId={ActiveRoomId}  />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <MenuIcon
      onClick={(e)=>{
         var x= document.getElementById("ChatDisplayTypes-Container");
         if(x){
          if(x.classList.contains("Hide")){
            x.classList.remove("Hide");
          }
          else x.classList.add("Hide");
         }
      }}
      sx={{
        cursor:'pointer'
      }}
      id="MenuIcon-ChatHeader-OtherDataOptions"
      className="MenuIcon-ChatHeader-OtherDataOptions"
      />        
    </Paper>    
                  </div>{console.log("Active Room id is->",ActiveRoomId)}
                
                </div>  
                </div>
            </div>
            {/* {
              ActiveRoomId===undefined? 
              <img src="https://images2.minutemediacdn.com/image/upload/c_fill,w_720,ar_16:9,f_auto,q_auto,g_auto/shape/cover/sport/istock-579416094-f09b85324ce8504d3b8b1ba983134e8d.jpg"/>
              : <p></p>
            } */}
            <div className="Chat-Box-Wrapper">
            <div className={"Chat-Box" + (DisplayDataType==="MainMessages"? " MessageChatBox" : " Hide") } 
            id="ChatBox-Messages-Id"
            >
               {console.log(Messages.size)}
            {   
                 [...Messages.keys()].map(message=>{  var time =new Date(Messages.get(message).TimeStamp);
                  time= time.toString().split(' ');
                  console.log("Time parts",time);
                 time=time[1]+ " " + time[2] + " "+ time[3] + " " + time[4] ;
                   return(
                     <Message
                     own={Messages.get(message).Sender===UserName}
                     MessageText={Messages.get(message).MessageText}
                     Name={Messages.get(message).Sender}
                     TimeStamp={time}
                     Media={Messages.get(message).Media}
                     />
                   );
                 })
            }
            <div ref={messagesEndRef} id="MessagesScrollDownDiv" />
            </div>
            
            <div className={"Chat-Box" + (DisplayDataType==="MainPosts"? " PostChatBox" : " Hide") }
            id="ChatBox-Posts-Id"
            >
              {
                [...Posts.keys()].map(key=>{
                  var time =new Date(Posts.get(key).TimeStamp);    
                  time= time.toString().split(' ');
                  console.log("Time parts",time);
                 time=time[1]+ " " + time[2] + " "+ time[3] + " " + time[4] ;
                  return(
                    <Post Sender={Posts.get(key).Sender}  Media={Posts.get(key).Media} TimeStamp={time}  
                    PostText={Posts.get(key).PostText} PostId={key}
                    />
                  )
                })
              }
            
            <div ref={messagesEndRef} id="PostsScrollDownDiv" />
            </div>

            <div className={"Chat-Box" + (DisplayDataType==="MainQueries"? " QueryChatBox" : " Hide") }
            id="ChatBox-Queries-Id"
            >
               {console.log(Messages.size)}
            { 
                 [...Messages.keys()].map(message=>{  var time =new Date(Messages.get(message).TimeStamp);
                  time= time.toString();
                 
                   return(
                     <Message 
                     own={Messages.get(message).Sender===UserName}
                     MessageText={Messages.get(message).MessageText}
                     Name={Messages.get(message).Sender}
                     TimeStamp={time}
                     />
                   );
                 })
            }
            <div ref={messagesEndRef} id="QueriesScrollDownDiv" />
            </div>
               
            
            <div className='Members-Wrapper-ChatContainer'>
              <p className='WhiteTextOnDarkBG H2'>
              Members:  </p>
              <div className='MembersList-ChatContainer'>
              {
                    [...ActiveMembers.keys()].map(key=>{ if(!Members.has(key)) return null
                      return(
                        <div className='MemberWrapper-ChatContainer'>
                      <div className="MemberName-ChatContainer ActiveMember-Online">
                         {key} 
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
                        {key}
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
           
        <div className={"TypeArea" + (DisplayDataType==="MainMessages"? "" : " Hide") }>
          <div className='TypeBox-Container'>
          <TextField
          id="Message-TypeArea"
          label="Message"
          placeholder="Message"
          multiline 
          maxRows={3}
          onChange={(e)=>{
            var val=document.getElementById("Message-TypeArea").value;
                      if(val.length > 0){
                        var files = document.getElementById("Message-ImageAttach-Input");
                        var media=[];
                        if(files && files.files && Object.keys(files.files).length>0){
                          Object.keys(files.files).forEach(index=>{
                            console.log("Debug MessageMedia->",files.files[index],files.files)
                            media.push(URL.createObjectURL(files.files[index]));
                          })
                        }
                        setMessages(new Map(Messages.set("Message-TypeComponent", {
                          Sender:UserName,
                          MessageText:val,
                          Media:media,
                          TimeStamp:Date.now().toString(),
                        })))
                      }
                      else{Messages.delete("Message-TypeComponent")
                        setMessages(new Map(Messages))
                      }
                      ScrollToBottomCustom(document.getElementById("MessagesScrollDownDiv"),
                      document.getElementById("ChatBox-Messages-Id"));
                     
          }}
          
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
                   <label htmlFor="Message-ImageAttach-Input">
                     <input accept="image/*" id="Message-ImageAttach-Input" multiple type="file"   className="AttachFile-InputBar" 
                     onChange={(e)=>{
                      var val=document.getElementById("Message-TypeArea").value;
                      if(val.length > 0){
                        var files = document.getElementById("Message-ImageAttach-Input");
                        var media=[];
                        if(files && files.files && Object.keys(files.files).length>0){
                          Object.keys(files.files).forEach(index=>{
                            console.log("Debug MessageMedia->",files.files[index],files.files)
                            media.push(URL.createObjectURL(files.files[index]));
                          })
                        }
                        setMessages(new Map(Messages.set("Message-TypeComponent", {
                          Sender:UserName,
                          MessageText:val,
                          Media:media,
                          TimeStamp:Date.now().toString(),
                        })))
                      }
                      else{Messages.delete("Message-TypeComponent")
                        setMessages(new Map(Messages))
                      }
                      ScrollToBottomCustom(document.getElementById("MessagesScrollDownDiv"),
                      document.getElementById("ChatBox-Messages-Id"));
                     }}
                     />
                    <AttachFileIcon 
                    sx={{
                      width:'40px' , height:'35px' ,  cursor:'pointer'
                    }}
                                />
                       </label>
          </div>
        </div>
         
        <div className={"TypeArea" + (DisplayDataType==="MainPosts"? "" : " Hide") }>
          <div className='TypeBox-Container'>
          <TextField
          id="Post-TypeArea"
          label="Post"
          placeholder="Post"
          multiline 
          maxRows={3}
          onChange={(e)=>{
            var val=document.getElementById("Post-TypeArea").value;
            if(val.length > 0){
              var files = document.getElementById("Post-ImageAttach-Input");
              var media=[];
              if(files && files.files && Object.keys(files.files).length>0){
                Object.keys(files.files).forEach(index=>{
                  console.log("Debug PostMedia->",files.files[index],files.files)
                  media.push(URL.createObjectURL(files.files[index]));
                })
              }
              setPosts(new Map(Posts.set("Post-TypeComponent", {
                Sender:UserName,
                PostText:val,
                Media:media,
                TimeStamp:Date.now().toString(),
              })))
            }
            else{Posts.delete("Post-TypeComponent")
              setPosts(new Map(Posts))
            }
            ScrollToBottomCustom(document.getElementById("PostsScrollDownDiv"),
            document.getElementById("ChatBox-Posts-Id"));
          }}
          
          onKeyPress={(ev) => {
            if (ev.key === 'Enter') {
             if(ev.shiftKey){ sendPost();
              ev.preventDefault();
             }
            }//import { FontAwesomeIcon } from "react-icons/fa";
          }}
          sx={{margin:'10px', width:'70vw'  , boxShadow:4}}
        />   
          </div>


                   <div className='TypeArea-SendButton'>
                   <IoMdSend  
                   className='Chat-SendButton'
                   
                   onClick={()=>{ 
                    var typedMssg = document.getElementById('Post-TypeArea').value;
                    console.log("Submitted Post  is " , typedMssg);
                       if(typedMssg.length>0)
                       sendPost();
                       else alert("Type atleast 1 Letter");
                   }}  
                   
                   />
                    <label htmlFor="Post-ImageAttach-Input">
                     <input accept="image/*" id="Post-ImageAttach-Input" multiple type="file"   className="AttachFile-InputBar" 
                     onChange={(e)=>{
                      var val=document.getElementById("Post-TypeArea").value;
                      if(val.length > 0){
                        var files = document.getElementById("Post-ImageAttach-Input");
                        var media=[];
                        if(files && files.files && Object.keys(files.files).length>0){
                          Object.keys(files.files).forEach(index=>{
                            console.log("Debug PostMedia->",files.files[index],files.files)
                            media.push(URL.createObjectURL(files.files[index]));
                          })
                        }
                        setPosts(new Map(Posts.set("Post-TypeComponent", {
                          Sender:UserName,
                          PostText:val,
                          Media:media,
                          TimeStamp:Date.now().toString(),
                        })))
                      }
                      else{Posts.delete("Post-TypeComponent")
                        setPosts(new Map(Posts))
                      }
                      ScrollToBottomCustom(document.getElementById("PostsScrollDownDiv"),
                      document.getElementById("ChatBox-Posts-Id"));
                     }}
                     />
                    <AttachFileIcon 
                    sx={{
                      width:'40px' , height:'35px' ,  cursor:'pointer'
                    }}
                                />
                       </label>
          </div>
         
         
        </div>

        <div className={"TypeArea" + (DisplayDataType==="MainQueries"? "" : " Hide") }>
          <div className='TypeBox-Container'>
          <TextField
          id="Query-TypeArea"
          label="Query"
          placeholder="Query"
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
                  console.log("debug window-> back arrow clicked->");
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
                      {mem}
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
                        {key}
                      </div>
                    </div>
                  )
                })
              }
             </div>
            </div>


        <div className='ChatDisplayTypes-Container Hide' id="ChatDisplayTypes-Container">
             ____Room Board
          <div className = "Fit-Text Container NoOverFlow ChatDisplayTypes-TypeHolder">
            <p className='NormalHeader NoOverFlow'>Messages</p>
                  <div className="SubContentsListContainer">
                    <div className="SubContentName Highlight5"
                    onClick={(e)=>{
                      var x =document.getElementById("ChatDisplayTypes-Container");
                      if(x){
                        if(!(x.classList.contains("Hide"))) x.classList.add("Hide");
                      }
                      setDisplayDataType("MainMessages");
                    }}
                    >Main Messages</div>
                    </div>
                  </div>
                  
                  <div className = "Fit-Text Container NoOverFlow ChatDisplayTypes-TypeHolder">
            <p className='NormalHeader NoOverFlow'>Posts</p>
                  <div className="SubContentsListContainer">
                    <div className="SubContentName Highlight5"
                    onClick={(e)=>{
                      var x =document.getElementById("ChatDisplayTypes-Container");
                      if(x){
                        if(!(x.classList.contains("Hide"))) x.classList.add("Hide");
                      }
                      setDisplayDataType("MainPosts");
                    }}
                    >Main Posts</div>
                    </div>
                  </div>
                 
                  <div className = "Fit-Text Container NoOverFlow ChatDisplayTypes-TypeHolder">
            <p className='NormalHeader NoOverFlow'>Queries</p>
                  <div className="SubContentsListContainer">
                    <div className="SubContentName Highlight5"
                    onClick={(e)=>{
                      var x =document.getElementById("ChatDisplayTypes-Container");
                      if(x){
                        if(!(x.classList.contains("Hide"))) x.classList.add("Hide");
                      }
                      setDisplayDataType("MainQueries");
                    }}
                    >Main Queries</div>
                    </div>
                  </div>
         
       
        </div>
        </div>
    );
}

export default ChatWindow;