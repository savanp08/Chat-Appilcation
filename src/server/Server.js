import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import RoomRouter from './APIs/RoomAPI.js';
import RoomSchema from './Schemas/RoomSchema.js';
import UserRouter from './APIs/UserAPI.js';
import QuickRoomRouter from './APIs/QuickRoomAPI.js';
import { Server } from "socket.io";
import { createServer } from 'http';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import * as path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';


dotenv.config();

const expressServer = express();
const port = process.env.PORT || 5000;

expressServer.use(cors({
   // origin:["write allowed urls here"]
}));
expressServer.use(express.json());
expressServer.use(bodyParser.json());
expressServer.use(bodyParser.urlencoded({ extended: true }));
expressServer.use('/Server/Rooms',RoomRouter);
   expressServer.use('/Server/QuickRoom',QuickRoomRouter);
const httpServer = expressServer.listen(port, ()=>{
    console.log("Server connected to Port" ,port);
}); 
  
const DbUri = process.env.DBURI;
//console.log("DB URI IS: FROM process.env.DBURI ->",process.env.DBURI, "And process.env.DbUri",process.env.DbUri)
mongoose.connect(DbUri || process.env.DbUri,
    {
        useNewUrlParser: true,  
    useUnifiedTopology: true
    }
    )
.catch((error) => {
    console.log(error.message);
});

//console.log("All environment Variables ->",process.env)

const DBconnection = mongoose.connection;


const io = new Server(httpServer, { 
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
 });
const appRouter = express.Router();
const RoomsData= new Map();
const UserData = new Map();
const socketData = new Map();
const UsersCount = new Map();
var count=0; 
    io.on("connection", (socket) => {   
         socket.on('connect', data=>{
            
            
         }) 

        console.log(socket.id); 
        console.log("Socket Connection" ,count++);
         socket.on("joinRoom",roomIds=>{
            console.log("User ",roomIds.at(-1),"sent",roomIds);
             socket.join(roomIds);
             if(Array.isArray(roomIds)){
                if(UserData.has(roomIds.at(-1)) && !socketData.has(socket.id)){
            UsersCount.set(roomIds.at(-1),UsersCount.get(roomIds.at(-1))+1);
                }
            else UsersCount.set(roomIds.at(-1),1);
                socketData.set(socket.id,roomIds.at(-1));
                
               if(UserData.has(roomIds.at(-1))){
                for(var i=0;i<roomIds.length-1;i++){
                    UserData.get(roomIds.at(-1)).push(roomIds[i])
                    UserData.set(roomIds.at(-1),UserData.get(roomIds.at(-1)));
                }
               }
               else UserData.set(roomIds.at(-1),roomIds.slice(0,-1));
               for(var i=0;i<roomIds.length-1;i++){
                console.log(roomIds[i],"->",RoomsData.get(roomIds[i]));
                if(RoomsData.has(roomIds[i]) && RoomsData.get(roomIds[i]) && Array.isArray(RoomsData.get(roomIds[i]))){
                    RoomsData.get(roomIds[i]).push(roomIds.at(-1))
                    RoomsData.set(roomIds[i], RoomsData.get(roomIds[i]) )
                } 
                else{ 
                    RoomsData.set(roomIds[i],[roomIds.at(-1)]);
                }
                console.log(roomIds[i],"->",RoomsData.get(roomIds[i]));
               }
               console.log("->>>",[roomIds.at(-1)]);
               roomIds.forEach(roomId=>{
                io.to(roomId).emit("connected",roomIds.at(-1));
                if(RoomsData.get(roomId))
                io.to(roomIds.at(-1)).emit("MemberStatusResponse",RoomsData.get(roomId));
               })
             }
             else console.log("!!!!!!!!!!!!!!!! Received RoomIds not Array!!!!!!!!!!",roomIds);
            console.log("User ",socketData.get(socket.id)," joined in Rooms", UserData.get(roomIds.at(-1)))
            console.log("socketId - UserId",socketData);
            console.log("UserId  -Rooms",UserData);
            console.log("RoomId - Users",RoomsData);
            console.log("USers count",UsersCount);
            const rooms = io.of("/").adapter.rooms; 
            console.log(rooms);
         }); 
         socket.on('disconnect',function(data){
            console.log("Socket USer Disconnected :" , socketData.get(socket.id)); 
            UsersCount.set(socketData.get(socket.id),UsersCount.get(socketData.get(socket.id))-1)

            if(UsersCount.has(socketData.get(socket.id))){console.log("Users count has user ",UsersCount.get(socketData.get(socket.id))===0,UsersCount.get(socketData.get(socket.id)));
                if(UsersCount.get(socketData.get(socket.id))===0){console.log("Single COunt of User ",UsersCount.get(socketData.get(socket.id)),"left so deleting->",UsersCount.has(socketData.get(socket.id)));
                if(UserData.has(socketData.get(socket.id))){ console.log("Inside room loop->"); console.log(RoomsData,UserData);
                    UserData.get(socketData.get(socket.id)).forEach(roomId=>{
                       if(RoomsData.get(roomId)){ 
                        console.log("Sending User", socketData.get(socket.id) , "Left to Room",roomId,RoomsData.get(roomId));
                        io.to(roomId).emit("disconnected",socketData.get(socket.id));
                        const index = RoomsData.get(roomId).indexOf(socketData.get(socket.id));
                        if(index>-1){ 
                           // console.log("debug->",RoomsData.get(roomId),"->",RoomsData.get(roomId).splice(index,1),"for",socketData.get(socket.id),index)
                       RoomsData.get(roomId).splice(index,1)
                        }
                        if(RoomsData.get(roomId) && Array.isArray(RoomsData.get(roomId)) && RoomsData.get(roomId).length===0) RoomsData.delete(roomId);
                       }  
                    })  
                    UserData.delete(socketData.get(socket.id));
                    UsersCount.delete(socketData.get(socket.id))
                    socketData.delete(socket.id);
                    console.log("socketId - UserId",socketData);
                    console.log("UserId  -Rooms",UserData); 
                    console.log("RoomId - Users",RoomsData);
                    console.log("USers count",UsersCount);
                    const rooms = io.of("/").adapter.rooms;
                    console.log(rooms);
                }
                
               
            }
             
             
        }
       
         })

         socket.on("MemberStatus",data=>{
            console.log("RoomId - UserIds",RoomsData);
            console.log("Sending Active Members List ",RoomsData.get(data),"For Room",data);
            io.to(data).emit("MemberStatusResponse",RoomsData.get(data));
         })
      });  

  
    

  
DBconnection.once('open',   ()=> {
    console.log(`Data Base Connection Established Successfully`);
   

 const DBchange = DBconnection.collection('roomschemas');
 const changeStream = DBchange.watch();

 changeStream.on('change', (change)=>{
     console.log("Change detected in mongoDB",change);
     if(change.operationType==='update'){
         console.log("change In Update section");
         const updatedDataType=change.updateDescription.updatedFields;
        
         const DataTypeKeys=Object.keys(updatedDataType);
         console.log(DataTypeKeys);
         var DataType = DataTypeKeys[0];
         if(DataTypeKeys.length>1 && DataType[0]==='u') DataType=DataTypeKeys[1];
         console.log(DataType);
         var changedData = updatedDataType[DataType];
         console.log(changedData);
         if(Array.isArray(changedData) && changedData.length==1) changedData=changedData[0];
         if(!Array.isArray(changedData)){
             if(Object.keys(changedData).length>=3){  
             console.log("In insert section"); 
            
                const RoomId = changedData.RoomId;
                io.to(RoomId).emit("update",changedData);
                console.log("sending socket data to Room->",RoomId,changedData);
                if(DataType.length>2 && DataType[2]==='m'){
                    const UserName = changedData.UserId;
                 io.to(UserName).emit("insert",{RoomId :RoomId});
                }
             
         }
        else{
            //updated room name or other properties with sub objects size less than 3
        }
        }
         else{
             console.log("In delete section");
             
         }
     }
     else if(change.operationType==='insert'){
            console.log("Room inserted");
            const RoomId = change.fullDocument.RoomId;
                io.to(RoomId).emit("insert",change.fullDocument);
                change.fullDocument.Members.forEach(mem=>{
                    io.to(mem.UserId).emit("insert",change.fullDocument);
                })
     }
     else{
         console.log("room deleted");
     }
 })
  
 const QuickDBchange = DBconnection.collection('quickroomschemas');
 const quickChangeStream = QuickDBchange.watch();

 quickChangeStream.on('change',(change)=>{
     console.log("Change detected in Quick Collection",change);
     if(change.operationType==='update'){
         console.log("change In Update section");
         const updatedDataType=change.updateDescription.updatedFields;
        
         const DataTypeKeys=Object.keys(updatedDataType);
         console.log(DataTypeKeys);
         var DataType = DataTypeKeys[0];
         if(DataTypeKeys.length>1 && DataType[0]==='u') DataType=DataTypeKeys[1];
         console.log(DataType);
         var changedData = updatedDataType[DataType];
         console.log(changedData);
         if(Array.isArray(changedData) && changedData.length==1) changedData=changedData[0];
         if(!Array.isArray(changedData)){
             if(Object.keys(changedData).length>=3){  
             console.log("In insert section");
               
                const RoomId = changedData.RoomId;
                io.to(RoomId).emit("update",changedData);
                console.log("sending socket data to Room->",RoomId,changedData);
               if(DataType.length>2 && DataType[2]==='m'){
                const UserName = changedData.UserId;
                 io.to(UserName).emit("insert",{RoomId :RoomId});
               }
         }
        else{
            //updated room name or other properties with sub objects size less than 3
        }
        }
         else{
             console.log("In delete section");
             
         }
     }
     else if(change.operationType==='insert'){
            console.log("Room inserted");
            const RoomId = change.fullDocument.RoomId;
            io.to(RoomId).emit("insert",change.fullDocument);
     }
     else{
         console.log("room deleted");
     }
  })
}
);

expressServer.use('/Server/Auth',UserRouter); 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
if(process.env.NODE_ENV === 'production'){
    expressServer.use(express.static(path.join(__dirname,"../","client/build")));
}
expressServer.use(express.static(path.join(__dirname,"../","client/build")));
//console.log(path.join(__dirname,"../","client/build"));

expressServer.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
