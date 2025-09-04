const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { default: mongoose } = require("mongoose");
const sendEmail = require("../utils/sendEmail");
// const ConnectionRequestModel = require("../models/connectionRequest");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req,res)=>{
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        console.log("route hit", { status, toUserId, fromUserId: req.user?._id });
        const allowedStatus = ["ignored","interested"];
        if(!allowedStatus.includes(status)){
            console.log("blocked: invalid status");
            return res
            .status(400)
            .json({ message: "Invalid status type: " + status});
        }
        const toUser = await User.findById(toUserId);
        if(!toUser) {
            console.log("blocked: toUser not found");
            return res.status(400).json({ message: "User not found"});
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId,toUserId},
                {fromUserId: toUserId,toUserId: fromUserId},
            ],
           
        });

        if(existingConnectionRequest){
             console.log("blocked: connection already exists");
            return res.status(400)
            .send({message: "Connection Request Already Exists!!"});
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });
console.log("about to send email");
        const data = await connectionRequest.save();
       try {
  const emailRes = await sendEmail.run(
    "A new friend request from " + status + " "+ req.user.firstName,
    req.user.firstName + " is " + status + " in " + toUser.firstName
  );
  console.log("emailRes:", emailRes);
} catch (e) {
  console.error("sendEmail failed:", e);
}
        
        res.json({
            message: req.user.firstName + " is " + status + " in " + toUser.firstName,
            data,
        });
    } catch (err) {
        console.error("route error:", err);
        res.status(400).send("ERROR :"+ err.message)
    }
    
   })

requestRouter.post("/request/review/:status/:requestId",
    userAuth, async (req,res) =>{
        try {
             
            const loggedInUser = req.user;
            const {status,requestId} = req.params;
            // console.log(loggedInUser);
            // console.log(status);
            // console.log(requestId);
            
            

            const allowedStatus = ["accepted", "rejected"];
            if(!allowedStatus.includes(status)){
                return res.status(400).json({ message: "Status not allowed! "});
            }
            // console.log(allowedStatus);
            

            const connectionRequest = await ConnectionRequest.findOne({
                _id: requestId,
                toUserId: loggedInUser._id,
                status: "interested",
            });
            console.log(connectionRequest);
            console.log(loggedInUser.id);
            
            
            if(!connectionRequest){
                return res
                .status(404)
                .json({ message: "Connection request not found"});
            }

            connectionRequest.status = status;
            const data = await connectionRequest.save();

            res.json({ message: "Connection request " + status, data});
        } catch (err) {
            res.status(400).send("ERROR :"+ err.message)
        }
    }
)

 
 

module.exports = requestRouter;