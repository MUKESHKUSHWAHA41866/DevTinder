 const express = require("express");

 const app = express();

 app.get("/user/:userId/:name/:password",(req, res)=>{
   console.log(req.params);
   
   res.send({firstName: "Mukesh",lastName: "kushwaha"})
 })
  
  

 app.listen(777,()=> {
    console.log("Server is successfully listing on port 7777...");
    
 });
 