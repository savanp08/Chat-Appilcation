import React, { useState,useEffect } from "react";
import './Posts.css'
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';



const Post = ({Media,Sender,PostText,TimeStamp,PostId}) => {


const [slide,setslide] = useState(0);
  useEffect(()=>{
    var x = document.getElementById(`Post-Media-Element-${PostId}-${slide}`)
    console.log("element to be scrolled to",x);
        var container = document.getElementById(`Post-MediaHolder-${PostId}`);
        if(x)
      var len=x.offsetLeft;
        container.scrollLeft=len;
  },[slide])


  var MediaArr = Media;
  if(!MediaArr) MediaArr=[];
  console.log(MediaArr)
    return(
<div className="Post-Wrapper">
   
        
        <div className="Post-Content">
            <div className="Post-AvatarAndNameWrapper">
            <img className="Post-Sender-ProfilePic" src="https://previews.123rf.com/images/grandeduc/grandeduc1603/grandeduc160300008/54330729-reaper-moon-rising-3d-render-of-cratered-skull-moon-in-night-sky.jpg" alt="FTLI"    >
                
            </img>
            <p className="Post-Sender-Name">
            {Sender}
        </p>
        </div>
            <div className="Post-TextAndMediaAndName-Holder">
           
            <div className="Post-TextAndMedia-Holder" >
                <div className="Post-MediaHolder" id={`Post-MediaHolder-${PostId}`} >
               <ChevronLeftIcon 
               sx={{
                position:'absolute', justifySelf:'end' , color:'white' , marginLeft:'0px' , 
                alignSelf:'center' , width:60 , height:50 , cursor:'pointer'
               }}
               onClick={(e)=>{
                var media = document.getElementById(`Post-MediaHolder-${PostId}`);
                if(media)  media = media.getElementsByClassName("Post-Media-Element");
                console.log("media in post->",media.length);
                if(slide===0) setslide(media.length-1);
                else
                setslide((slide-1));
               }}
               />
               {
                MediaArr.map((img,index)=>(<img className="Post-Media-Element" id={`Post-Media-Element-${PostId}-${index}`} src={img} key={index} alt="Error" /> ))
               }
               <ChevronRightIcon 
               sx={{
                position:'absolute', justifySelf:'end' , color:'white' , marginLeft:'295px' , 
                alignSelf:'center' , width:60 , height:50 , cursor:'pointer'
               }}
               onClick ={(e)=>{
                var media = document.getElementById(`Post-MediaHolder-${PostId}`);
                console.log(`Post-MediaHolder-${PostId}`,media);

                if(media)  media = media.getElementsByClassName("Post-Media-Element");
                console.log("media in post->",media.length);
                setslide((slide+1)%media.length);
               }}
               />
                 
                </div>
                
                <p className="PostText">{PostText}</p>
                </div>
            </div>
        </div>
        <p className="Post-TimeStamp"></p>
   
</div>
    )

}

export default Post;