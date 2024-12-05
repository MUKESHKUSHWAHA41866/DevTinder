 const express = require("express");

 const app = express();

//  app.get("/user/:userId/:name/:password",(req, res)=>{
//    console.log(req.params);
   
//    res.send({firstName: "Mukesh",lastName: "kushwaha"})
//  })

// app.use("/routes", rH, [rh2, rh3], rh4, rh5);

app.use("/user", (req,res,next) =>{
  console.log("Handleing the route user!!");
  next();
  
},
(req,res,next)=>{
  console.log("Handling 2 route");
  next();
},
(req,res,next)=>{
  console.log("Handleing 3 routes");
  res.send("Hello mukesh")
})
  

 app.listen(777,()=> {
    console.log("Server is successfully listing on port 7777...");
    
 });
 