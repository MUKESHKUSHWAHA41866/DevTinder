 const express = require("express");

 const app = express();
const {adminAuth, userAuth} = require("./middlewares/auth")

 app.use("/admin",adminAuth )
//  app.use("/user",userAuth )
 
app.post("/user/login", (req,res)=>{
  res.send("User logged in successfully")
})
 app.get("/user",userAuth, (req,res)=>{
  res.send("user Data Sent");
 })
 
app.get("/admin/getAllData", (req,res,next) =>{
    res.send("All Data Sent")
})
 
 

 app.listen(777,()=> {
    console.log("Server is successfully listing on port 7777...");
    
 });
 