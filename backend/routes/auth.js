const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// SIGNUP API
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    user = new User({ name, email, password: hashed, role });
    await user.save();

    res.json({ msg: "Account created successfully!",data:{email, role} });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// LOGIN API
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid email" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid password" });


    res.json({ msg: "Login successful", data:{ email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
