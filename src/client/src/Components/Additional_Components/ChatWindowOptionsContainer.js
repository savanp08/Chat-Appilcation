import * as React from 'react';
import './ChatWindowOptions.css';
import ChatWindow_AddMember from './ChatWindow_AddMember';
import ChatWindow_RemoveMember from './ChatWindow_RemoveMember';



const ChatWindowOptionsContainer = ({SelectedOption,Members,ActiveRoomId}) =>{
    console.log("Room Id Passed to CHat Window Options Container is ->",ActiveRoomId);
  if(SelectedOption==="Search"){
     var x = document.getElementById('ChatSearchBarContainer');
     if(x) x.classList.remove('Hide');
  }
  else{
    var x = document.getElementById('ChatSearchBarContainer');
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

const MembersList = Members;
    console.log("In Member Open Options->");
    console.log("Members passed to Open Options in Member Section are->",Members);
    console.log("IN Open _> Selcted Option is ",SelectedOption);

    return(
<div className='MemberOptions-Wrapper' id="MemberOptions-Wrapper" >
      <div className={ "ChatWindow-AddMember-Container" +(SelectedOption==="Add Member"? "" : " Hide") }>
        <ChatWindow_AddMember  ActiveRoomId={ActiveRoomId} Members={MembersList}   />
      </div>
      <div className={ "ChatWindow-RemoveMember-Container" +(SelectedOption==="Remove Member"? "" : " Hide") }>
       <ChatWindow_RemoveMember ActiveRoomId={ActiveRoomId} Members={Members} />
      </div>
    </div>
    );
};


export default ChatWindowOptionsContainer;