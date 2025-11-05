const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateUserRole,
  assignTicketToAgent,
  getPendingRoleRequests,
  handleRoleRequest,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('Admin'));

// @desc    Get all users
// @route   GET /api/admin/users
router.get('/users', getAllUsers);

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
router.put('/users/:id/role', updateUserRole);

// @desc    Assign ticket to agent
// @route   PUT /api/admin/tickets/:id/assign
router.put('/tickets/:id/assign', assignTicketToAgent);

// @desc    Get pending role requests
// @route   GET /api/admin/role-requests
router.get('/role-requests', getPendingRoleRequests);

// @desc    Approve or reject role request
// @route   PUT /api/admin/role-requests/:id
router.put('/role-requests/:id', handleRoleRequest);

module.exports = router; 