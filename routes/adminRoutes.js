const express = require('express');
const { isAuthenticated, isRole } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

router.get('/analytics', isAuthenticated, isRole('ADMIN'), async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.status(200).json({ userCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// router.get('/users', isAuthenticated, isRole('ADMIN'), async (req, res) => {
//   try {
//     const users = await User.find().select('-password');
//     res.status(200).json(users);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch users' });
//   }
// });

// router.delete('/users/:id', isAuthenticated, isRole('ADMIN'), async (req, res) => {
//   try {
//     await User.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: 'User deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to delete user' });
//   }
// });

module.exports = router;
