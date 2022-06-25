import express, { response } from 'express';
import RoomSchema from '../Schemas/RoomSchema.js';
import MessageSchema from '../Schemas/MessageSchema.js';
import mongoose from 'mongoose';
import Pusher from 'pusher';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer';
// import { path } from 'path';
// import { domainToASCII } from 'url';
// const parser = new DatauriParser();

// const formatBufferTo64 = file =>
//   parser.format(path.extname(file.originalname).toString(), file.buffer)


const RoomRouter = express.Router();
dotenv.config();

const pusher = new Pusher({
  appId: process.env.appId,
  key: process.env.key,
  secret: process.env.secret,
  cluster: process.env.cluster,
  useTLS: true
});

cloudinary.config({ 
  cloud_name: process.env.cloud_name ,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});
const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/jpg'];
const storage  = multer.memoryStorage();

//   const storage = multer.diskStorage({   
//     destination: function(req, file, cb) { 
//        cb(null, '../client/Test_Images');    
//     },
//     filename: function (req, file, cb) { 
//        cb(null , file.originalname);   
//     }
//  });
const multerUpload = multer({ 
  storage : storage,
  fileFilter: function(req, file, cb) {
      if (ALLOWED_FORMATS.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Not supported file type!'), false);
      }
    }
});




RoomRouter.post('/Message/add/:RoomId',  multerUpload.single("image") , async (req,response)=> { 
  try{console.log("Message addd tried",req.body);

    const RoomId=req.body.RoomId;
    var NewMessage = req.body;
    console.log("In Message Add API->",req.files,req.file);
    const files = [req.file];
 if(req.file && files.length>0){
  await addMedia(files).then(async (res)=>{
      console.log("image of message reponse->",res);
      NewMessage.Media = res[0];
      await RoomSchema.findOneAndUpdate(
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
   })
   .catch(async (err)=>{
       console.log("eror while uploading image of message->",err);
       response.status(400).send(err);
   })
   }
    else{
  await RoomSchema.findOneAndUpdate(
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
  }
  catch(error){
    response.status(400).send(err)
    console.log(error); 
  }
});

RoomRouter.put('/Message/update/:RoomId/:MessageId',async (request,response)=>{
  const RoomId = request.params.RoomId;
 await Room.updateOne({RoomId:RoomId},{$set: {Messages : req.body.Messages}})
  .then(response=>{
     console.log({RoomId}  );   
     response.status(200).json("Updated Donation Form");
  })
  .catch(error=>{
     console.log("error while updating Donations"); 
     console.log(error);
     res.status(400).send(err);
  })
 
});

RoomRouter.get('/Message/load/:RoomId', async (req,res)=>{  
    try { const RoomId = req.params.RoomId;
        const Rooms= await RoomSchema.find({RoomId:RoomId},{Messages :1, _id : 0});
        console.log("Messages GET request tried of room",RoomId);
     //   console.log(Rooms[0]["Messages"]);
        res.status(200).json(Rooms[0]["Messages"]);
    } catch (error) { 
      console.log("GET request failed");
        console.log({error});
        res.status(404).json(error);
    }    
} );

RoomRouter.get('/Members/load/:RoomId',async(req,response)=>{
  const RoomId = req.params.RoomId;
  console.log("Members load tried for room",RoomId);
  try{ var flag=true;
      var Members=[];
       await RoomSchema.find({RoomId:RoomId},{Members:1, _id:0})
      .then(res=>{
     //   console.log("Members found in room",RoomId ,"are",res[0]["Members"]);
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

RoomRouter.post('/Room/create/:UserId', async (req,res)=>{  
    try {const UserId = req.body.UserId;
      const NewRoomId= req.body.RoomId;
      const TempMembers=req.body.Members;
      var NewRoomMembers = []
      TempMembers.forEach(ele=>{ 
        var temp=ele;
        temp.RoomId=NewRoomId;
        NewRoomMembers.push(temp);
       // console.log(temp);
      });
        const NewRoomSchema= new RoomSchema( {
          RoomId :  NewRoomId,
          Name: req.body.Name,
          Members: NewRoomMembers,
          Messages:[],
          RoomType:req.body.RoomType
        });
       console.log(NewRoomSchema,req.body);
         await NewRoomSchema.save();
        console.log("New Room Created");
      //  console.log(NewRoomSchema);
        res.status(200).json(NewRoomSchema);
    } catch (error) { 
      console.log("GET request failed");
        console.log({error});
        res.status(404).json(error);
    }   
} );

RoomRouter.post('/Room/add/User/:RoomId', async (req,response)=>{  
  
    try{ const RoomId = req.params.RoomId;
    const NewMember = { 
        UserId:req.body.UserId,
        Name: req.body.Name,
        RoomId:RoomId
   }; 
   console.log("Add user tried",req.params.RoomId,NewMember.UserId);
   //console.log(req.body);
    await RoomSchema.find({RoomId : RoomId, Members:{ $elemMatch : {UserId : NewMember.UserId}}})
   .then(async (res)=>{
   if(res.length>0){
     console.log("User Already Exists",NewMember.UserId);
     response.status(401).send(`User Already Exists with UserId : ${NewMember.UserId}`);
   }
   else{
   console.log("No User Found So Inserting->",res,NewMember.UserId);
     await RoomSchema.updateOne(
         {RoomId:RoomId , Members: { $not :{ $elemMatch : {UserId : NewMember.UserId }} } },
         {$push : { Members : NewMember }}
     )
     .then(() => {response.status(200).send(NewMember ); console.log("New User added to Room",{RoomId}) })
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

RoomRouter.get('/Room/load/:UserId', async (req,response)=>{  
  try { const RoomId = req.params.UserId;
      var Rooms=[];
      console.log("Room List Load tried",RoomId);
      const qid = { "Members.UserId" : RoomId};
     // console.log(qid);
     const ans= await RoomSchema.find({Members : { $elemMatch: { UserId : RoomId }}},{RoomId : 1,Name:1, _id :0})
      .then((res,err)=>{
      //  console.log("Rooms response is",res);
        response.status(200).send(res);
      })
      .catch(err=>{
        console.log("Error finding Rooms ",err);
        response.status(400).send(err);
      });
      console.log("GET request tried");
      console.log(ans); 
     
  } catch (error) { 
    console.log("GET request failed");
      console.log({error});
      response.status(404).json(error);
  }   
} );

 

RoomRouter.post('/Room/Delete/Member/:RoomId/:UserId', async(req,response)=>{
  console.log("Delete USer req tried");
const UserId = req.params.UserId, RoomId = req.params.RoomId;
 

  console.log("In Delete Member Section of Delete Memeber API call->",UserId);
    const count= await RoomSchema.find({RoomId : RoomId, Members:{ $elemMatch : {UserId : UserId}}});
   if(count.length==0){
     console.log("User doesn't Exists in quick room",UserId);
     response.status(404).send("Not Found");
   }
   else{
   console.log(count,UserId);
     await RoomSchema.findOneAndUpdate(
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

RoomRouter.post("/Room/SaveRoom/:RoomId", async(req,response)=>{
const RoomId=req.params.RoomId;
const Room=RoomSchema.findOneAndUpdate({RoomId:RoomId},{RoomType:"saved"});
response.send("Tried");
});


RoomRouter.get('/GetFullRooms/:UserName', async( req, response)=>{
  const UserName = req.params.UserName;
  await RoomSchema.find({Members:{$elemMatch :{UserId : UserName}}})
  .then(res=>{
    console.log("Full User Rooms Data Fetched ->",UserName);
    response.status(200).send(res);
  })
  .catch(err=>{
   console.log("error in fetching full user's rooms data->",err);
   res.status(400).send(err);
  })
} )

async function addMedia(files){
  return new Promise((resolve,reject)=>{
   try{
  var it=0;
  var count=files.length;
  var MediaLinks=[];
  files.forEach(async(file)=>{ ++it;

    
    const encoded = file.buffer.toString('base64'); 
   // console.log("Base64 ->",encoded);
    if(encoded){
      const ext = file.mimetype.substring(6);
      const dataUri = "data:" + "image/" + ext + ";" + "base64" + "," + encoded;
     
    await cloudinary.uploader.upload(dataUri  ,{ folder : "Chat-App" } ) 
    .then(res=>{
    //  console.log("Added New Image",res);
       MediaLinks.push(res.secure_url);
       --count;
    })
    .catch(err=>{
      console.log("Error While uploading image to cloudinary",err);
    })
  }
  if(count===0){
  console.log("Uploaded Links->",MediaLinks);
   resolve(MediaLinks);
  }
  else if(it===files.length && count>0){
    console.log("error while uplaodng pic->");
    reject("err");
  }
    });
  }
  catch(err){
    reject("Error",err);
    console.log("error while uploading pic ",err);
  }
  
  })
}


RoomRouter.post('/add/Post/:RoomId' , multerUpload.array("image",8),   async(req, response)=>{
 // console.log(req);
 // console.log("Rest of Data->",req.body); 
  //console.log(req.body.Sender); 
 // console.log("Trying to Upload image ->",req.files);
  const RoomId = req.body.RoomId;
  var NewPost = {
    Sender:req.body.Sender,
    PostText:req.body.PostText, 
    Media:[],
    PostId:new mongoose.Types.ObjectId().toString(), 
    RoomId:req.body.RoomId,
    TimeStamp: Date.now().toString()
  }
  const files = req.files;
 if(files && files.length>0){
   addMedia(files).then(async (res)=>{
    console.log("response from promise is ->",res);
    NewPost.Media = res; 
  //  console.log("New Post about to be Inserted is ->",NewPost);
    await RoomSchema.updateOne({RoomId : RoomId}, {$push : {Posts : NewPost}})
  .then(result=>{   
   // console.log("Added New Post->",result);  
   console.log("Added New Post->");
    response.status(200).send("Success");  
  })  
  .catch(err=>{ 
    console.log("error while adding new Post",err); 
    response.status(400).send(err); 
  }) 
  }).catch(err=>{console.log(err); 
    response.status(400).send(err); 
  } 
    ); 
 } 
else{ 
  console.log("error: req.files is null or undefined");
  
 // console.log("New Post about to be Inserted is ->",NewPost);
    await RoomSchema.updateOne({RoomId : RoomId}, {$push : {Posts : NewPost}})
  .then(result=>{
  //  console.log("Added New Post->",result);
  console.log("Added New Post->");
    response.status(200).send("Success");
  })
  .catch(err=>{
    console.log("error while adding new Post",err);
    response.status(400).send(err);
  })
}
});







RoomRouter.get('/load/Posts/:RoomId' ,async(req, response)=>{

  const RoomId=req.params.RoomId;
  console.log("ftech posts tried",RoomId);
  RoomSchema.find({RoomId : RoomId},{Posts:1 , _id:0})
  .then(result=>{
   // console.log("Fetched Posts from Room ",RoomId,result[0].Posts);
    response.status(200).send(result[0].Posts);
  })
  .catch(err=>{
    console.log("Error while loading posts of room",RoomId,err);
    response.status(400).send(err);
  })
} )


RoomRouter.post('/add/Query/:RoomId', async(req, response)=>{
  const RoomId=req.params.RoomId;
  const NewQuery = req.body.Query;
  RoomSchema.updateOne({RoomId : RoomId}, {$push : {Queries : NewQuery}})
  .then(result=>{
    console.log("Added New Query->",result);
    response.status(200).send("Success");
  })
  .catch(err=>{
    console.log("error while adding new Query",err);
    res.status(400).send(err);
  })
})
RoomRouter.get('/load/Queries/:RoomId' ,async(req, response)=>{
  const RoomId=req.params.RoomId;
  RoomSchema.find({RoomId : RoomId},{Queries:1 , _id:0})
  .then(result=>{
    console.log("Fetched Queries from Room ",RoomId,result);
    response.status(200).send(result);
  })
  .catch(err=>{
    console.log("Error while loading Queries of room",RoomId,err);
    response.status(400).send(err);
  })
} )







export default RoomRouter;  








