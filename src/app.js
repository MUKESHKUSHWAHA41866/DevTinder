 const express = require("express");

 const app = express();

 app.use("/", (req,res)=>{
    res.send("Hello  word hhhh ");
 }); 

 app.use("/hello", (req,res)=>{
    res.send("Hello from the server hwllo! ");
 }); 

 app.use("/test", (req,res)=>{
    res.send("Hello from the server! ");
 });

 app.listen(3000,()=> {
    console.log("Server is successfully listing on port 3000...");
    
 });
 