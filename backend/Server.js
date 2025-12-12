const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors({ origin: ['http://localhost:5173','http://localhost:3000'], credentials: true }));
app.use(express.json());

// connect to mongodb
const MONGO = process.env.MONGO || 'mongodb://127.0.0.1:27017/supplierBuyerDB';

mongoose.connect("mongodb://127.0.0.1:27017/supplier_buyer")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

<<<<<<< HEAD
app.listen(5000, () => console.log("Server running on port 5000"));
=======

// mount routes
app.use('/api/listings', require('./routes/listings'));
// ... auth routes (ensure /api/auth/login & /api/auth/signup exist and return token with user id)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on', PORT));
>>>>>>> aa8d49a65b94169ea9934f86694a1d618f2d06c6
