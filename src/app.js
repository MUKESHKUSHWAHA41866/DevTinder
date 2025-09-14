const express = require("express");
const connectDB = require("./config/database")
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors")
require('dotenv').config();

require("./utils/cronJob.js");


// app.use(cors({
//    origin: "http://localhost:5173",
//    credentials: true,
// }));
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      return callback(null, true); // allow all origins
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment.js");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
 
 connectDB()
  .then(()=>{
    console.log("Database connection established...");

    app.listen(process.env.PORT,()=> {
      console.log("Server is successfully listing on port 7777...");
      
   });
   
    
}).catch(err=>{
   console.error("Database cannot be connected");
   
})
