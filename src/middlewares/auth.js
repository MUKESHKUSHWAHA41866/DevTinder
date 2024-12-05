 const adminAuth = (req,res,next)=>{
    console.log("Admin auth is geting checked");
    
    const token = "xyz";
   const isAdminAuthorized = token == "xyz";
   if ( !isAdminAuthorized) {
    res.status(401).send("Unauthorized request")
   } else {
    next();
   }
   }

   const userAuth = (req,res,next)=>{
    console.log("Admin auth is geting checked");
    
    const token = "xyzss";
   const isAdminAuthorized = token == "xyz";
   if ( !isAdminAuthorized) {
    res.status(401).send("Unauthorized request")
   } else {
    next();
   }
   }

   module.exports = {adminAuth,userAuth}