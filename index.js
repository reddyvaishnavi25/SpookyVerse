const express = require("express");
const { mongoose } = require("mongoose");
const cors = require("cors");
<<<<<<< HEAD
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv").config();

const app = express();

app.use(
  cors({
=======
const bcrypt = require("bcryptjs"); 
const dotenv=require("dotenv").config()
const cookieParser=require("cookie-parser")
require('dotenv').config();

const app = express();
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

app.use(cors({
>>>>>>> origin/vaishnavi_BE
    credentials: true,
    origin: "http://localhost:3001", // Specify your frontend origin
  })
);
app.use(express.json()); // Parse JSON payloads
<<<<<<< HEAD
=======
 
app.use("/api/friends", require("./routes/friendRoutes"));

mongoose.connect(process.env.MONGO_URL)
.then(()=>{console.log("Database connected")})
.catch((err)=>{console.log(`database not connected`,err)})
>>>>>>> origin/vaishnavi_BE

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(`database not connected`, err);
  });

app.use("/", require("./routes/authRoutes")); // Routes for authentication (login, register)
app.use("/api/friends", require("./routes/friendRoutes")); // Routes for friends (send-request, accept)

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
