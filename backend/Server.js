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

app.listen(5000, () => console.log("Server running on port 5000"));
