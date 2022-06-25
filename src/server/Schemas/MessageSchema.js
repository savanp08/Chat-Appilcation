import mongoose from "mongoose";
import express from "express";

const MessageSchemax = new mongoose.Schema({
    RoomId:{
        type:String,
        default:"RoomId",
         required:true,
         unique:false,
         minlength:1
    },
    MessageId:{
        type:String,
        default:"MessageId",
        required:true,
        unique:false,
        minlength:1
    },
   Sender:{
       type:Boolean,
       required:true,
       unique:false,
       minlength:3,
       default:false
   }, 
   TimeStamp:{
       type:Date,
       required:true, 
       unique:false,
       default:Date.now()
   },
  
   MessageText:{
    type:String,
    default:"Undefined",
     required:true,
     unique:false,
     minlength:1
   }
},{timestamps:true});
MessageSchemax.index({createdAt: 1},{expireAfterSeconds: 60*60*24*30});
const MessageSchema= mongoose.model("messageschema",MessageSchemax);
export default MessageSchema;