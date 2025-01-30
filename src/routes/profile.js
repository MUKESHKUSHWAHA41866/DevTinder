const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth");

profileRouter.get("/profile", userAuth, async (req,res)=>{
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

module.exports = profileRouter;