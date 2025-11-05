0// server/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Each email must be unique
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['End User', 'Support Agent', 'Admin'], // Defines the possible roles
    default: 'End User', // Sets the default role for new users
  },
  requestedRole: {
    type: String,
    enum: ['End User', 'Support Agent', 'Admin'],
    default: 'End User', // Role the user requested during signup
  },
  roleStatus: {
    type: String,
    enum: ['active', 'pending', 'rejected'],
    default: 'active', // Status of role request
  },
  agentJustification: {
    type: String,
    default: '', // Why they want to be an agent
  },
  roleRequestedAt: {
    type: Date,
    default: null, // When they requested the role
  },
  roleApprovedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, // Admin who approved the role
  },
  roleApprovedAt: {
    type: Date,
    default: null, // When role was approved
  },
  bio: {
    type: String,
    default: '', // Optional bio field
  },
  avatar: {
    type: String,
    default: '', // Optional avatar URL field
  },
  // You can add more fields here later, like a profile picture URL
}, {
  timestamps: true // Automatically adds 'createdAt' and 'updatedAt' fields
});

module.exports = mongoose.model('User', UserSchema);