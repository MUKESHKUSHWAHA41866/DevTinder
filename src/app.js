 const express = require("express");

 const app = express();
 
 app.use("/", (err, req,res, next)=>{
  if(err){
    res.status(500).send("something went wrong")
  }
 })
 
 app.get("/getUserData", (req,res)=>{
  
  try {
    // Logic of DB call and get user data
    throw new Error("dvbzhjf");
    res.send("user Data Sent");
  } catch (err) {
    res.status(500).send("Some Error contact support team");
  }
  
 });
 
 
 

 app.listen(777,()=> {
    console.log("Server is successfully listing on port 7777...");
    
 });
 