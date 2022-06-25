import express from 'express';
import MessageSchema from '../Schemas/MessageSchema.js';


const MessageRouter = express.Router();

MessageRouter.post('/add', async (req,res)=> {
  try{
    const MessageId=req.body.MessageId;
    const RoomId= req.body.RoomId;
    const MessageText=req.body.MessageText; 
    const TimeStamp=Date.now();
    const Sender=req.body.Sender;    
   const NewMessage = new MessageSchema({ 
     MessageId:req.body.MessageId,
     RoomId: req.body.RoomId,
     MessageText:req.body.MessageText,
     TimeStamp:Date.now(),
     Sender:req.body.Sender
});
  await NewMessage.save()
  .then(() => {res.json(NewMessage ); console.log("New Message added to Room",RoomId) })
.catch(err => res.status(400).json('Error: ' + err));
  }
  catch(error){
    console.log(error);
  }
});

MessageRouter.put('/update/:UserName',async (request,response)=>{
  const UserName = request.params.UserName;
 await Message.updateOne({UserName},{$set: request.body})
  .then(response=>{
     console.log({UserName}  );   
  })
  .catch(error=>{
     console.log("error while updating Donations"); 
     console.log(error);
  })
  response.status(200).json("Updated Donation Form");
});

MessageRouter.get('/New/:RoomId', async (req,res)=>{  
       const RoomId=req.params.RoomId;
       const MessagesList=await MessageSchema.find({RoomId : RoomId}).then((items)=>res.json(items))
       .catch(err=>{
         console.log("Error while fetching Message from new Message Collection", error);

       });
       MessageSchema.deleteMany({RoomId : RoomId})
       .then(()=>{
         console.log("Deleted Messages of Room ",RoomId);
       })
       .catch(err=>{
         console.log("Error While Deleting Messges from New Messages Schema");
       })
} );

export default MessageRouter;                                                                