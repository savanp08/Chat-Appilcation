import mongoose from "mongoose";


const RoomSchemax = new mongoose.Schema({
    RoomId:{
        type:String,
        default:"GuestId",
        required:true,
        unique:true,
        minlength:1
    },
    Name:{
        type:String,
        default:"Guest",
        required:true,
        unique:false,
        minlength:1
    },
    Members:[
        {
            UserId:{
                type:String,
                required:true,
                unique:false,
                minlength:1
            },
            Name:{
                type:String,
                required:true,
                unique:false,
                minlength:1
            },
            RoomId:{
                type:String,
                default:"RoomId",
                 required:false,
                 unique:false,
                 minlength:1
            },
        }
    ],
    Messages:[{
        RoomId:{
            type:String,
            default:"RoomId",
             required:false,
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
           type:String,
           required:true,
           unique:false,
           minlength:1,
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
       },
       Media:{
        type:String
       }
    }
   
    ],

    Posts:[
        {
            PostId:{
                type:String,
                unique:true,
                required:false,
            },
            PostText:{
                type:String,
                required:false,
                unique:false,
                minlength:1,
                default:""
            },
            TimeStamp:{
                type:String,
                required:true,
                unique:false,
                default:"",
                minlength:1
            },
            Sender:{
                  type:String,
                  unique:false,
                  default:"",
                  minlength:1,
                  required:true
            },
            Media:{
                type:[String]
            },
            RoomId:{
                type:String,
            default:"RoomId",
             required:false,
             unique:false,
             minlength:1
            }
        }
    ],
     Queries:[
         {
            QueryId:{
                type:String,
                unique:true,
                required:false,
            },
            QueryText:{
                type:String,
                required:false,
                unique:false,
                minlength:1,
                default:""
            },
            TimeStamp:{
                type:String,
                required:true,
                unique:false,
                default:"",
                minlength:1
            },
            Sender:{
                  type:String,
                  unique:false,
                  default:"",
                  minlength:1,
                  required:true
            },
            Media:{
                Type:String,
                unique:false,
                required:false
            },
            RoomId:{
                type:String,
            default:"RoomId",
             required:false,
             unique:false,
             minlength:1
            }
         }
     ],
    RoomType:{
        type:String,
        required:true,
        unique:false,
        minlength:3,
    },
    
},{timestamps:true} );

const RoomSchema= mongoose.model("roomschemas",RoomSchemax);
export default RoomSchema;