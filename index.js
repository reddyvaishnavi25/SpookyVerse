const express = require("express");
const mongoose = require("mongoose"); // Fixed the import
const cors = require("cors");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv").config(); // Only need this once
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3001", // Specify your frontend origin
  })
);
app.use(express.json()); // Parse JSON payloads

// Import routes
app.use("/api/friends", require("./routes/friendRoutes"));
app.use("/", require("./routes/authRoutes"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("Database not connected", err);
  });

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Fixed the template literal
});
