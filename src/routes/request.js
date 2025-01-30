const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth");

requestRouter.post("/sendConnectionRequest", userAuth, async(req,res)=>{
    const user = req.user;
    // Sending connection Request
    console.log("Sending a connection Request");
    res.send(user.firstName +" Send the connection Request");
    
   })
  

module.exports = requestRouter;