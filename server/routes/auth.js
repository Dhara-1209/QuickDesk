const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// @desc    Register a new user
router.post('/register', registerUser);

// @desc    Login user
router.post('/login', loginUser);

// @desc    Get user profile
// @route   GET /api/auth/profile
router.get('/profile', protect, getUserProfile);

// @desc    Update user profile
// @route   PUT /api/auth/profile
router.put('/profile', protect, updateUserProfile);

module.exports = router;