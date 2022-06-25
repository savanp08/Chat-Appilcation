import React ,{useState,useEffect} from "react";
import './Login.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FcGoogle } from "react-icons/fc";
import { SiFacebook } from "react-icons/si";
import { AiOutlineMail } from "react-icons/ai";
import axios from "axios";
import { Route } from "react-router";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import mongoose from "mongoose";
import { IoMdDisc } from "react-icons/io";

const Login = () => {

    const [UserName, setUserName] = useState("");
    const [Password, setPassword] = useState("");
    const [SecretKey, setSecretKey] = useState("");
    const [AuthStatus, setAuthStatus] = useState("NotValid");
    const [Message, SetMessage] = useState("");
    const [AccessToken, setAccessToken] = useState("");
    const CheckUserName = (e) => {
      setUserName(e.target.value);
      console.log(UserName);
    };
    const CheckPassword = (e) => {
      setPassword(e.target.value);
      console.log(UserName);
    };
    const CheckSecretKey = (e) => {
      setSecretKey(e.target.value);
      console.log(SecretKey);
    };
  
    const [UserType, setUserType] = useState("");
    async function submitLogin(e) {
      console.log(UserName);
      console.log("Password is ",Password);
      var CheckMessage = "";
      await axios
        .post(
          `/Server/Auth/User/Login`,
          {
                UserName: UserName,
                Password: Password,
              }
        )
        .then((Response) => { 
          console.log(Response.data);
          if (
            typeof Response.data.resval === "string" ||
            Response.data.resval instanceof String
          )
            SetMessage(Response.data.resval);
          const accessToken = Response.data.token;
          if (accessToken) {
            console.log("token from login->");
            console.log(Response.data.token);
            try {
              console.log(UserName);
              localStorage.setItem(`User ${UserName}`, accessToken);
            } catch (error) {
              console.log("error->");
              console.log(error);
            }
            setAccessToken(localStorage.getItem(`User ${UserName}`));
          }
          if (Response.data.resval) SetMessage(Response.data.resval);
          CheckMessage = Response.data.resval;
  
          console.log(AccessToken);
        })
  
        .catch((error) => {
          console.log("error while Logging in");
          console.log(error);
        });
  
      const token = localStorage.getItem(`User ${UserName}`);
      console.log("fetched from local->");
      console.log(token);
      if (token && CheckMessage === "Matched")
        await axios
          .get("/Server/Auth/TokenValidate", {
            headers: { authorization: `Bearer ${token}` },
          })
          .then((Response) => {
            if (Response.data.resval === "TokenVerified") {
              window.location.replace(`/Account/${UserName}`);
            }
            console.log(Response.data);
          })
          .catch((error) => {
            console.log(error);
          });
    }
    console.log("state after token validation ");
    console.log(AccessToken);
  



  const createQuickRoom = async() =>{
   var tempUserId = new mongoose.Types.ObjectId().toString();
   tempUserId = tempUserId.toString();
   var roomId = document.getElementById("QuickRoom-Login");
   if(roomId) roomId = roomId.value;
   var tempName = document.getElementById("QuickRoom--UsersName-Login");
   if(tempName) tempName= tempName.value;
   if(roomId.length<1 || tempName.length<1){
   var xx= document.getElementById("Login-HelperText-QuickRoom");
   xx.innerHTML ="Name and RoomId should be atLeast 1 length long";
   }
   else
    window.location.replace(`QuickRoom/QuickUser/${roomId}/${tempUserId}/${tempName}`);
  }





  useEffect(()=>{

   var quickButton = document.getElementById("QuickRoom-LoginButton");
    document.addEventListener('click',function(e){
      var container = document.getElementById("QuickRoom-Login-Div");
      console.log("Event of click->",e);
    if (e.target!==container && !container.contains(e.target) && e.target!==quickButton) 
    {console.log("Detected click outside quick room div")
      if(container && !container.classList.contains("Hide"))
      container.classList.add("Hide");
    }
})
  },[])




  return (
    <div className="LoginPage-Wrapper">
   <div className="Login-Wrapper">
       <div className='Login-Container'>
           <div className='User-Pass-Container'>
           <TextField id="outlined-basic" 
           label="UserName" 
           variant="outlined" 
           onChange={(e) => {
            CheckUserName(e);
          }}
          inputProps={{
            style: { fontSize: 18, wordSpacing: 17, lineHeight: 1.5 },
          }}
          InputLabelProps={{
            style: { fontSize: 18, wordSpacing: 17, lineHeight: 1.5 },
          }}
          sx={{boxShadow: 4 }}
           />
           
           <TextField
          id="outlined-password-input"
          label="Password"
          type="password"
          inputProps={{
            style: { fontSize: 18, wordSpacing: 17, lineHeight: 1.5 },
          }}
          InputLabelProps={{
            style: { fontSize: 18, wordSpacing: 17, lineHeight: 1.5 },
          }}
          onChange={(e) => {
            CheckPassword(e);
          }}
          sx={{  boxShadow: 4,  }}
          
        />
           </div>
               <div className='Login-Options'>

               <FcGoogle className="LoginOption-Icons" />
               <SiFacebook className="LoginOption-Icons" />
               <AiOutlineMail className="LoginOption-Icons" />
           </div>
           <div className='OtherRoom-Wrapper'>
           <div className='QuickRoom-Container'>
           <Button variant="text"
                   id="QuickRoom-LoginButton"
                   onClick={()=>{
                  const ele=document.getElementById("QuickRoom-Login-Div")
                  if(ele){ ele.style.position="fixed";
                  ele.classList.remove("Hide");
                   }
                  //const ele2=document.getElementById("QuickRoom-LoginButton").style.display="none";
                  
                   }
                  }
           >Quick Room</Button>
           <div className="Hide Show-Login" id="QuickRoom-Login-Div" >

           <TextField
          id="QuickRoom-Login"
          label="Quick Room ID"
          type="search"
          variant="standard"
          className="QuickRoom-Login"
        />
        <TextField
          id="QuickRoom--UsersName-Login"
          label="User Name"
          type="search"
          variant="standard"
          className="QuickRoom-Login"
        />
         <Button variant="contained"
         id="QuickLogin-Button"
   className="LoginSubmit"
   onClick={(e) => {
    var id = document.getElementById("QuickRoom-Login");
    if(id) id=id.value;
    var name= document.getElementById("QuickRoom--UsersName-Login");
    if(name) name= name.value;
    if(id.length<1 || id.length>20)  document.getElementById("Login-HelperText-QuickRoom").innerHTML="Length Of Room Id should be >1 and <21";
    else if(name.length<1 || name.length>20)  document.getElementById("Login-HelperText-QuickRoom").innerHTML="Length Of User Name should be >1 and <28";
    else
    createQuickRoom(e);
  }}
  sx={{
    width:'120px' , height:'60px'
  }}
   >Join Quick room</Button>
   <p id="Login-HelperText-QuickRoom"></p>
          </div>
           </div>
           <div className='SavedRoom-Container'>

           <Button variant="text"
           id="SavedRoom-LoginButton"
           onClick={()=>{
           
            const ele=document.getElementById("SavedRoom-Login-Div").classList.add("Show");
            
                  const ele2=document.getElementById("SavedRoom-LoginButton").style.display="none";
             }
            }
           >Saved Room</Button>
            <div className="Hide" id="SavedRoom-Login-Div">
           <TextField
          id="SavedRoom-Login"
          label="Saved Room ID"
          type="search"
          variant="standard"
          className="SavedRoom-Login"
        />  </div>
           </div>
           </div>
       </div>
       
   </div>
   <div className="LoginSubmit-Div">
   <Button variant="contained"
   className="LoginSubmit"
   onClick={(e) => {
    
    if(UserName.length<1 || UserName.length>20)  document.getElementById("Login-HelperText-Overall").innerHTML="Length Of UserName should be >1 and <21";
    else if(Password.length<1 || Password.length>20)  document.getElementById("Login-HelperText-Overall").innerHTML="Length Of Password should be >1 and <28";
    else
    submitLogin(e);
  }}
   >Login</Button>
</div>
<p id="Login-HelperText-Overall"></p>
<Button variant="contained" className="SignUp-Button"
onClick = {()=>{
  window.location.replace("/SignUp");
}}
sx={{
 marginTop:'4vh'
}}
>SignUp
</Button>
</div>
  );
}

export default Login;
