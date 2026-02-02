const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config(); // Load environment variables

const app = express();
app.use(express.json());
app.use(cors());

// --- Database Connection (Fixed for Cloud) ---
// Use environment variable for Cloud DB, fallback to Localhost for development
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mfa-app';

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- User Schema ---
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  secretPattern: [{
    cellIndex: { type: Number, required: true },
    imageHash: { type: String, required: true }
  }]
});

const User = mongoose.model('User', UserSchema);

// --- Register Route ---
app.post('/register', async (req, res) => {
  console.log("📝 Register Attempt:", req.body.email);
  const { email, password, secretPattern } = req.body;

  if (!email || !password || !secretPattern || secretPattern.length === 0) {
    return res.json({ status: 'error', error: 'Missing fields or empty pattern' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({ 
      email, 
      password: hashedPassword, 
      secretPattern 
    });
    
    await newUser.save();
    console.log("✅ User Registered:", email);
    res.json({ status: 'ok' });

  } catch (error) {
    console.error("❌ Register Error:", error);
    if (error.code === 11000) {
      return res.json({ status: 'error', error: 'Email already exists' });
    }
    res.json({ status: 'error', error: 'Server error: ' + error.message });
  }
});

// --- Login Route ---
app.post('/login', async (req, res) => {
  console.log("🔑 Login Attempt:", req.body.email);
  const { email, password, secretPattern } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ status: 'error', error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ status: 'error', error: 'Invalid Password' });
    }

    if (!user.secretPattern || user.secretPattern.length === 0) {
      return res.json({ status: 'error', error: 'No pattern found. Please register again.' });
    }

    // Comparison Logic
    const dbPattern = [...user.secretPattern].sort((a, b) => a.cellIndex - b.cellIndex);
    const inputPattern = [...secretPattern].sort((a, b) => a.cellIndex - b.cellIndex);

    if (dbPattern.length !== inputPattern.length) {
      return res.json({ status: 'error', error: 'Wrong number of images selected' });
    }

    let isMatch = true;
    for (let i = 0; i < dbPattern.length; i++) {
      if (dbPattern[i].cellIndex !== inputPattern[i].cellIndex || 
          dbPattern[i].imageHash !== inputPattern[i].imageHash) {
        isMatch = false; 
        break;
      }
    }

    if (isMatch) {
      console.log("✅ Login Success");
      return res.json({ status: 'ok', token: 'fake-jwt-token-123' });
    } else {
      console.log("❌ Pattern Mismatch");
      return res.json({ status: 'error', error: 'Wrong Image Pattern Selected' });
    }

  } catch (err) {
    console.error("❌ Login Server Error:", err);
    res.json({ status: 'error', error: 'Internal Server Error' });
  }
});

// --- Serve React Frontend ---
// This handles the "Monolithic" deployment
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// --- Start Server ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});