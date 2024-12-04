 const express = require("express");

 const app = express();

 app.use("/user", (req,res)=>{
   res.send("Hello from the server! ");
});

 app.get("/user",(req, res)=>{
   res.send({firstName: "Mukesh",lastName: "kushwaha"})
 })
 app.post("/user",(req, res)=>{
   res.send("Data successfully save to the database")
 })

 app.use("/test", (req,res)=>{
    res.send("Hello from the server! ");
 });
 app.delete("/user",(req, res)=>{
   res.send("Delete data successfully")
 })
  

 app.listen(7777,()=> {
    console.log("Server is successfully listing on port 7777...");
    
 });
 