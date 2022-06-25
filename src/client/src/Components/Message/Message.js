import React from 'react'
 import './Message.css'

const Message = ({own,Img,Name,MessageText,TimeStamp,Media}) =>{  
    var lu=["URNOOB"],mu=["UR NOOB"],Mssg = "";
   console.log("Debug-> Msg->",own,Name);
   
return(
    <div className={"Message-Over-Wrapper" +(own===true? " Own"  : "")} >
    <div className={"Message-Wrapper" +(own===true? " Own"  : "")}>
        <div className={"Message"+(own===true? " Own"  : "")}>
            <div className="Sender-Image-Wrapper close">
            <img className="Sender-Image" src ="https://previews.123rf.com/images/grandeduc/grandeduc1603/grandeduc160300008/54330729-reaper-moon-rising-3d-render-of-cratered-skull-moon-in-night-sky.jpg" alt="Not Loaded"></img>
            </div>
            <div className='MessageComponent-ContentWrapper' id="MessageComponent-ContentWrapper">
            <div className="Sender-Name-wrapper close">
            <p className={"Sender-Name" +(own===true? " Own"  : "")}>{Name}</p>
            </div>
                <div className={'Message-MediaWrapper'+(Media? "" : " Hide") } id="Message-MediaWrapper">
                <img className='Message-Media' src={Media} alt=""  />
                </div>
            <div className="Text_Wrapper">
            
            <div className="Message-Text-wrapper close">
            <div className={"Message-Text" +(own===true? " Own"  : "")}> {MessageText} </div>
            </div>
            <div className="TimeStamp-wrapper close">
            <p className="TimeStamp">{TimeStamp}</p>
            </div>
            </div>
            </div>
        </div>
    </div>
    </div>
);  

 }


 export default Message;