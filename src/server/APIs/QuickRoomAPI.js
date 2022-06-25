import express from 'express';
import RoomSchema from '../Schemas/RoomSchema.js';
import MessageSchema from '../Schemas/MessageSchema.js';
import mongoose from 'mongoose';
import Pusher from 'pusher';
import dotenv from 'dotenv';
import QuickRoomSchema from '../Schemas/QuickRoomSchema.js';

const QuickRoomRouter = express.Router();
dotenv.config();
const pusher = new Pusher({
  appId: process.env.appId,
  key: process.env.key,
  secret: process.env.secret,
  cluster: process.env.cluster,
  useTLS: true
});


QuickRoomRouter.post('/Message/add/:RoomId', async (req,response)=> { console.log(req.body.Sender);
  try{
    //console.log("Message addd tried",req.body);
  const RoomId=req.body.RoomId;
  var NewMessage = req.body;
await QuickRoomSchema.findOneAndUpdate(
    {RoomId:RoomId},
   {$push:{ Messages : NewMessage } } 
)
.then(res => {
 response.send(NewMessage);
 // console.log("New Message added to Room",NewMessage,res) 
})
.catch(err => {
console.log(err);
response.status(400).send(err);
});
}
catch(error){
  response.status(400).send(err)
  console.log(error); 
}
});

QuickRoomRouter.put('/Message/update/:RoomId/:MessageId',async (request,response)=>{
  const RoomId = request.params.RoomId;
 await QuickRoomSchema.updateOne({RoomId:RoomId},{$set: {Messages : req.body.Messages}})
  .then(res=>{
    // console.log({RoomId}  );   
     response.status(200).json("Updated Donation Form");
  })
  .catch(error=>{
     console.log("error while updating Donations"); 
     console.log(error);
     response.send(err);
  })
 
});

QuickRoomRouter.get('/Message/load/:RoomId', async (req,response)=>{  
    try { const RoomId = req.params.RoomId;
        const Rooms= await QuickRoomSchema.find({RoomId:RoomId},{Messages :1, _id : 0});
        console.log("Messages GET request tried of room",RoomId);
      //  console.log(Rooms[0]["Messages"]);
        response.status(200).json(Rooms[0]["Messages"]);
    } catch (error) { 
      console.log("GET request failed");
        console.log({error});
        response.status(404).json(error);
    }   
} );

QuickRoomRouter.get('/Members/load/:RoomId',async(req,response)=>{
  const RoomId = req.params.RoomId;
  try{ var flag=true;
      var Members=[];
       await QuickRoomSchema.find({RoomId:RoomId},{Members:1, _id:0})
       .then(res=>{
       // console.log("Members found in room",RoomId ,"are",res[0]["Members"]);
       response.status(200).send(res[0]["Members"]);
      })
      .catch(err=>{ flag=false;
        console.log("error in loading members of room", RoomId,err);
        response.status(400).send(err);
      });
     
  }catch(err){ 
    console.log(err);
    response.status(404).send(err);
  }
})

QuickRoomRouter.post('/create/Room/:UserId', async (req,res)=>{  
    try {const UserId = req.body.UserId;
      const NewRoomId= req.body.RoomId;
      const TempMembers=req.body.Members;
      var NewRoomMembers = []
      TempMembers.forEach(ele=>{
        var temp=ele;
        temp.RoomId=NewRoomId;
        NewRoomMembers.push(temp);
      //  console.log(temp);
      });
        const NewQuickRoomSchema= new QuickRoomSchema( {
          RoomId :  NewRoomId,
          Name: req.body.Name,
          Members: NewRoomMembers,
          Messages:[],
          RoomType:req.body.RoomType
        });
     //  console.log(NewQuickRoomSchema,req.body);
         await NewQuickRoomSchema.save();
        console.log("New Room Created");
      //  console.log(NewQuickRoomSchema);
        res.status(200).json(NewQuickRoomSchema);
    } catch (error) { 
      console.log("GET request failed");
        console.log({error});
        res.status(404).json(error);
    }   
} );

QuickRoomRouter.post('/add/User/:RoomId', async (req,response)=>{  
  try{ const RoomId = req.params.RoomId;
    const NewMember = { 
        UserId:req.body.UserId,
        Name: req.body.Name,
        RoomId:RoomId
   }; 
 //  console.log(req.body);
    await QuickRoomSchema.find({RoomId : RoomId, Members:{ $elemMatch : {UserId : NewMember.UserId}}})
   .then(async (res)=>{
   if(res.length>0){
     console.log("User Already Exists",NewMember.UserId);
     response.status(401).send(`User Already Exists with UserId : ${NewMember.UserId}`);
   }
   else{
   console.log("No User Found So Inserting->",res,NewMember.UserId);
     await QuickRoomSchema.updateOne(
         {RoomId:RoomId , Members: { $not :{ $elemMatch : {UserId : NewMember.UserId }} } },
         {$push : { Members : NewMember }}
     )
     .then((res) => {response.json(NewMember ); console.log("New User added to Room",RoomId,res) })
   .catch(err => response.status(400).send('Error: ' + err));
     }
    })
    .catch(err=>{
      console.log("error searching for user while inserting",err);
      response.status(400).send(err);
    })
  }
     catch(error){
       console.log(error);
       response.status(400).send(err);
     }
} );

QuickRoomRouter.get('/load/:UserId', async (req,response)=>{  
  try { const RoomId = req.params.UserId;
      var Rooms=[];
      console.log(RoomId);
      const qid = { "Members.UserId" : RoomId};
      console.log(qid);
     const ans= await QuickRoomSchema.find({Members : { $elemMatch: { UserId : RoomId }}},{RoomId : 1, _id :0})
      .then((res,err)=>{
     //   console.log("Rooms response is",res);
        response.status(200).send(res)
      })
      .catch(err=>{
        console.log("Error finding Rooms ",err);
      });
      console.log("GET request tried");
      console.log(ans); 
  } catch (error) { 
    console.log("GET request failed");
      console.log({error});
      response.status(404).json(error);
  }   
} );

QuickRoomRouter.get('/RoomInitial/:RoomId', async(req, response)=>{
  const RoomId = req.params.RoomId;
  console.log("In Initialization of Quick Room->",RoomId);
  await QuickRoomSchema.find({RoomId : RoomId})
  .then(res=>{ console.log(res);
    if(res.length===1){
      console.log("Quick Room check success",RoomId);
      response.status(200).send({
        Status : "Found",
        Rooms:res[0]
      });
    }
    else{
      console.log("Quick Room check failed",RoomId);
    response.send("NotFound");
    }
  })
  .catch(err=>{
   console.log("error in checking for existance of quick room",err);
   response.status(404).send("Error"+err);
  })
 })

QuickRoomRouter.post('/Delete/Member/:RoomId/:UserId', async(req,response)=>{
  console.log("Delete USer req tried");
const UserId = req.params.UserId, RoomId = req.params.RoomId;
 

  console.log("In Delete Member Section of Delete Memeber API call->",UserId);
    const count= await QuickRoomSchema.find({RoomId : RoomId, Members:{ $elemMatch : {UserId : UserId}}});
   if(count.length==0){
     console.log("User doesn't Exists in quick room",UserId);
     response.status(404).send("Not Found");
   }
   else{
   console.log(count,UserId);
     await QuickRoomSchema.findOneAndUpdate(
         {RoomId:RoomId , Members: { $elemMatch : {UserId : UserId }}  },
         {$pull : {Members:{ UserId:UserId }}}
     )
     .then(() =>{
        console.log(UserId,"User removed from Room",RoomId);
        pusher.trigger("delete","Member",{
          UserId:UserId,
          RoomId:RoomId
        });
       response.status(200).send(UserId);
      })
   .catch(err => response.status(400).json('Error: ' + err));
     }
  
});

QuickRoomRouter.post("/SaveRoom/:RoomId", async(req,response)=>{
const RoomId=req.params.RoomId;
const Room= QuickRoomSchema.findOneAndUpdate({RoomId:RoomId},{RoomType:"saved"});
if(Room.RoomType==="saved"){
  console.log("Saved a Room");
  response.status(200);
}
else {
  response.status(400).send("You cannot Access This Room");
}
});








export default QuickRoomRouter;   