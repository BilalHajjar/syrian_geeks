const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');  
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (password !== user.password) {  
        return res.status(400).json({ error: 'Invalid credentials' });
      }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }  
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
