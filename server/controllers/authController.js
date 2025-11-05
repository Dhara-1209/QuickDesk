// server/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user with role request
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  // Get registration data from the request body
  const { 
    name, 
    email, 
    password, 
    requestedRole = 'End User',
    agentJustification = '',
    adminCode = ''
  } = req.body;

  try {
    // Check if a user with that email already exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Check if this is the first user (should be Admin)
    const userCount = await User.countDocuments();
    const isFirstUser = userCount === 0;

    let actualRole = 'End User';
    let roleStatus = 'active';
    let roleRequestedAt = null;

    // Determine role based on request and validation
    if (isFirstUser) {
      // First user becomes Admin automatically
      actualRole = 'Admin';
      roleStatus = 'active';
    } else if (requestedRole === 'Admin') {
      // Admin role requires special access code AND optional email validation
      if (!adminCode) {
        return res.status(400).json({ msg: 'Admin access code is required' });
      }
      
      // Check if admin code matches (primary or backup)
      const validAdminCodes = [
        process.env.ADMIN_CODE,
        process.env.ADMIN_CODE_BACKUP
      ].filter(code => code); // Remove any undefined codes
      
      if (!validAdminCodes.includes(adminCode)) {
        return res.status(400).json({ msg: 'Invalid admin code' });
      }
      
      // Optional: Validate admin email domain (uncomment if needed)
      // const adminEmailDomain = process.env.ADMIN_EMAIL_DOMAIN;
      // if (adminEmailDomain && !email.endsWith(adminEmailDomain)) {
      //   return res.status(400).json({ 
      //     msg: `Admin accounts must use company email (${adminEmailDomain})` 
      //   });
      // }
      
      actualRole = 'Admin';
      roleStatus = 'active';
    } else if (requestedRole === 'Support Agent') {
      // Agent role requires justification and approval
      if (!agentJustification || agentJustification.trim().length < 10) {
        return res.status(400).json({ 
          msg: 'Agent justification is required (minimum 10 characters)' 
        });
      }
      actualRole = 'End User'; // Start as End User until approved
      roleStatus = 'pending';
      roleRequestedAt = new Date();
    } else {
      // Regular End User
      actualRole = 'End User';
      roleStatus = 'active';
    }

    // Create new user
    user = new User({
      displayName: name,
      email,
      password,
      role: actualRole,
      requestedRole: requestedRole,
      roleStatus: roleStatus,
      agentJustification: agentJustification,
      roleRequestedAt: roleRequestedAt,
    });

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    await user.save();

    // Create a JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role,
        requestedRole: user.requestedRole,
        roleStatus: user.roleStatus,
        displayName: user.displayName,
        email: user.email,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5d' },
      (err, token) => {
        if (err) throw err;
        
        // Send response with role status information
        res.status(201).json({ 
          token,
          roleStatus: roleStatus,
          message: roleStatus === 'pending' 
            ? 'Account created! Your agent request is pending admin approval.'
            : roleStatus === 'active' && requestedRole === 'Support Agent'
            ? 'Account created with agent access!'
            : 'Account created successfully!'
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};


// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // If credentials are correct, create and return a JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role,
        requestedRole: user.requestedRole,
        roleStatus: user.roleStatus,
        displayName: user.displayName,
        email: user.email,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const { displayName, email, bio, avatar } = req.body;

  try {
    // Check if email is being changed and if it's already taken
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: 'Email already in use' });
      }
    }

    // Find and update the user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update fields if provided
    if (displayName !== undefined) user.displayName = displayName;
    if (email !== undefined) user.email = email;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    // Return user data without password
    const userResponse = await User.findById(user.id).select('-password');
    res.json(userResponse);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Export all functions
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};