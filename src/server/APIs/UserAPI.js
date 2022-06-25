import express from 'express';
import {UserSchema} from '../Schemas/UserSchema.js';
import jwt from "jsonwebtoken"; 
import mongoose from 'mongoose';
const UserRouter = express.Router(); 
// JWT token implementation without libraries ->
//https://www.telerik.com/blogs/json-web-token-jwt-implementation-using-nodejs

UserRouter.post("/:UserType/SignUp", async (req, res) => {
 // const UserType = req.params.UserType;
  console.log("req body is->");
  console.log(req.body);
  const UserName = req.body.UserName;
  const Password = req.body.Password;
  if (UserName.length < 1 || Password.length < 1) {
    const resval = "UserName or Password Not Entered";
    console.log("UserName or Password Not Entered");
    res.send(resval);
  } else {
    try {
      const UserName = req.body.UserName;
      const AccessToken = jwt.sign({ UserName }, process.env.AccessToken, {
        expiresIn: "6h"
      });

      console.log(AccessToken);

    //  if (UserType === "User") {
        let Existing = false,
          GenAccTok = false;
        const NewUserLoginData = new UserSchema({
          UserName: req.body.UserName,
          Password: req.body.Password,
          UserId:mongoose.Types.ObjectId()
        });

        await NewUserLoginData.save()
          .then((res) => {
            console.log("USer saved");
          })
          .catch((err) => {
            if (err) {
              Existing = true;
              console.log(Existing);
            }
            const resval = "AccountExists";
            res.send(resval);
            console.log("error at User save");
            console.log(err);
          });
        console.log(Existing);
        if (Existing === false) {
          console.log("Not Existing so gen Tok");
          res.status(202).json({ AccessToken: AccessToken });
        }
    //   } else if (UserType === "Admin") {
    //     console.log("Entered Admin Sign Up");
    //     let Existing = false,
    //       GenAccTok = false;
    //     const NewAdminLoginData = new UserLoginData({
    //       UserName: req.body.UserName,
    //       Password: req.body.Password
    //     });
    //     await NewAdminLoginData.save()
    //       .then((res) => {
    //         console.log("New Admin Added");
    //         console.log(res);
    //       })
    //       .catch((err) => {
    //         if (err) {
    //           Existing = true;
    //           console.log(Existing);
    //         }
    //         const resval = "AccountExists";
    //         res.send(resval);
    //         console.log("error at User save");
    //         console.log(err);
    //       });

    //     if (Existing === false) {
    //       console.log(AccessToken);
    //       res.status(202).json({ AccessToken: AccessToken });
    //     }
    //   }
    } catch (error) {
      console.log(error);
      res.send(error);
      res.end();
    }
  }
});

function fetchToken(UserName) {
  return jwt.sign({ UserName }, process.env.RefreshToken, { expiresIn: "6h" });
}

UserRouter.post("/:UserType/Login", async (req, response) => {
  console.log("req.Body->")
  console.log(req.body);
  var ressent = false; 
  try {
    const UserName = req.body.UserName;
    const password = req.body.Password;
    console.log("now at Login");
   await UserSchema.findOne({UserName:UserName})
   .then(res=>{
    console.log("User Login check->",res);
    if(!res){
      console.log("NO User Found");
      var resval = "User Not Found , SignUp";
      response.status(201).send({
        resval : resval
      });
    }
    else{
      if(res.Password === password){
        console.log("User Found, Password Matched");
      var resval = "Matched";
      var newtoken = fetchToken();
      response.status(201).send({
        resval : resval,
        token : newtoken
      });
      }
      else{
        console.log("User Found but password is wrong");
      var resval = "Not Matched";
      response.status(201).send({
        resval : resval
      });
      }
    }
   })
   .catch(err=>{
    console.log("Error while Login checking user",err);
    response.status(400).send(err);
   })
      
  } catch (err) {
    response.status(400).send(err);
    console.log(err);
  }
});

UserRouter.get("/:UserType/RefreshToken/:UserName", async (req, res) => {
  const UserType = req.params.UserType;
  const UserName = req.params.UserName;
  const AccessToken = fetchToken({ UserName });
  res.status(202).json({ AccessToken: AccessToken });
});

UserRouter.get("/TokenValidate", async (req, res) => {
  console.log("TokenValidate Called->");
console.log(req.headers);
  const HeaderToken = req.headers["authorization"];
  const Token = HeaderToken && HeaderToken.split(" ")[1];
  console.log("This is Acquired Token->");
  console.log(Token);
  if (Token===null) { 
    const resval = "NoTokenFound";
    res.send(resval);
    console.log("Invalid Req, Token Not found Checking Password");
  } else {
    var reftoken = false;

    jwt.verify(Token, process.env.RefreshToken, (err, UserName) => {
      if (err) {
        console.log(err);
        console.log(UserName);
        res.send("TokenExpired");
      } else {
        reftoken = true;
        console.log(UserName);

        console.log(Date.now());
        const resval = "TokenVerified";
        res.send({ resval });

        console.log("Token Verified");
      }
    });
    // if(reftoken===false){
    //   jwt.verify(Token, process.env.AccessToken, (err, UserName) => {
    //     if (err) {
    //         console.log(err);

    //       res.send("TokenExpired");
    //     } else {reftoken=true;
    //       console.log(UserName);
    //       console.log(Date.now());
    //       const resval="TokenVerified";
    //    res.send({resval});

    //       console.log("Token Verified");

    //     }
    //   });
    //   }
  }
});

UserRouter.get("/CheckUser/:UserName", async (req, response) => {
 
  const UserName = req.params.UserName;
  console.log("Checking for user->",UserName);
  const count  =await UserSchema.find({UserName : UserName})
 .then(res=>{
  if(res.length>0){
  console.log("While adding User , Check Success : UserName found->",UserName,res);
  response.status(200).send("Found");
  }
  else{
    console.log("While adding User , Check Failed No UserName found->",UserName,res);
    response.status(400).send("NotFound");
  }
 }).catch(err=>{
    console.log("While adding User , Check Failed , UserName found->",UserName,err);
    response.status(400).send("NotFound");
  })

})



export default UserRouter;

