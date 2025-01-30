const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const {validateEditProfileData}= require("../utils/validation")

profileRouter.get("/profile/view", userAuth, async (req,res)=>{
    try {
      
    
    // const cookies = req.cookies;
  
    // const {token} = cookies;
    // validate my token
    // if(!token){
      // throw new Error("Invalid Token");
    // }
  
    // const decodedMessage = await jwt.verify(token,"DEV@Tinder$790")
    // console.log(decodedMessage);
    // const {_id} = decodedMessage;
    // console.log("logged In user is :" + _id);
  
    const user = req.user;
    // if(!user){
    //   throw new Error("User does not exist");
    // }
  
    // console.log(cookies);
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR :"+ err.message)
  }
    
   })

   profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    try {
      if(!validateEditProfileData(req)){
        throw new Error("Invalid Edit Request");
      };
      const loggedInUser = req.user;
       
      Object.keys(req.body).forEach((key)=> (loggedInUser[key] = req.body[key]));
       
      await loggedInUser.save();
      
      res.json({message:`${loggedInUser.firstName},Your Profile updated successfuly`,
        data: loggedInUser,
    });
    } catch (err) {
      res.status(400).send("ERROR :"+ err.message)
    }
   })



module.exports = profileRouter;