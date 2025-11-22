const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Correct imports (match lowercase filenames)
const User = require('../models/user');
const auth = require('../middleware/auth');


// =====================
// REGISTER USER
// =====================
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // check if email exists
    let u = await User.findOne({ email });
    if (u) return res.status(400).json({ msg: 'User already exists' });

    // create hashed password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // create user
    const user = new User({ name, email, password: hash });
    await user.save();

    // JWT token
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).send("Server error");
  }
});


// =====================
// LOGIN USER
// =====================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log("LOGIN BODY RECEIVED:", req.body);

  try {
    let u = await User.findOne({ email });

    console.log("FOUND USER ->", u ? u.email : "No user in DB");

    if (!u) return res.status(400).json({ msg: "Invalid credentials" });

    const match = await bcrypt.compare(password, u.password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    const payload = { user: { id: u.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).send("Server error");
  }
});


// =====================
// GET LOGGED-IN USER
// =====================
router.get('/me', auth, async (req, res) => {
  try {
    const u = await User.findById(req.user.id).select('-password');
    res.json(u);
  } catch (err) {
    res.status(500).send("Server error");
  }
});


module.exports = router;
