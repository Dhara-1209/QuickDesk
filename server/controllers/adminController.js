// server/controllers/adminController.js
const User = require('../models/User');
const Ticket = require('../models/Ticket');

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin only)
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;

    // Validate role
    const validRoles = ['End User', 'Support Agent', 'Admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ msg: 'Invalid role' });
    }

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update the role
    user.role = role;
    await user.save();

    // Return user without password
    const userResponse = await User.findById(id).select('-password');
    res.json(userResponse);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Assign ticket to agent (Admin only)
// @route   PUT /api/admin/tickets/:id/assign
// @access  Private (Admin only)
const assignTicketToAgent = async (req, res) => {
  try {
    const { assignedAgent } = req.body;
    const { id } = req.params;

    // Check if ticket exists
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ msg: 'Ticket not found' });
    }

    // Check if assigned agent exists and is a Support Agent
    const agent = await User.findById(assignedAgent);
    if (!agent) {
      return res.status(404).json({ msg: 'Agent not found' });
    }

    if (agent.role !== 'Support Agent') {
      return res.status(400).json({ msg: 'User is not a Support Agent' });
    }

    // Update ticket
    ticket.assignedAgent = assignedAgent;
    ticket.status = 'In Progress';
    ticket.updatedAt = Date.now();
    await ticket.save();

    // Return updated ticket with populated user and agent
    const updatedTicket = await Ticket.findById(id)
      .populate('user', 'displayName email')
      .populate('assignedAgent', 'displayName email');

    res.json(updatedTicket);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Ticket not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Get pending role requests (Admin only)
// @route   GET /api/admin/role-requests
// @access  Private (Admin only)
const getPendingRoleRequests = async (req, res) => {
  try {
    const pendingRequests = await User.find({ 
      roleStatus: 'pending' 
    }).select('-password').sort({ roleRequestedAt: -1 });
    
    res.json(pendingRequests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Approve or reject role request (Admin only)
// @route   PUT /api/admin/role-requests/:id
// @access  Private (Admin only)
const handleRoleRequest = async (req, res) => {
  try {
    const { action } = req.body; // 'approve' or 'reject'
    const { id } = req.params;

    // Validate action
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ msg: 'Invalid action. Use "approve" or "reject"' });
    }

    // Find the user with pending request
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.roleStatus !== 'pending') {
      return res.status(400).json({ msg: 'No pending role request for this user' });
    }

    // Handle the request
    if (action === 'approve') {
      user.role = user.requestedRole;
      user.roleStatus = 'active';
      user.roleApprovedBy = req.user.id;
      user.roleApprovedAt = new Date();
    } else {
      user.roleStatus = 'rejected';
      user.requestedRole = 'End User';
    }

    await user.save();

    // Return updated user without password
    const userResponse = await User.findById(id).select('-password');
    res.json({
      user: userResponse,
      message: action === 'approve' 
        ? `${user.displayName} has been promoted to ${user.role}`
        : `Role request for ${user.displayName} has been rejected`
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  assignTicketToAgent,
  getPendingRoleRequests,
  handleRoleRequest,
}; 