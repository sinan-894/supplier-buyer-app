const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const app = express();



app.use(cors({
  origin: "http://localhost:3001",   // <-- frontend URL
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// DB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/authdb")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.listen(5000, () => console.log("Server running on port 5000"));