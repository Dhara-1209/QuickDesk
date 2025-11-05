const express = require('express');
const router = express.Router();
const {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  getAllTickets, // 1. Import the new controller function
  addTicketResponse, // Import the new response function
} = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorize'); // Import the authorize function

// Route for a user to get their own tickets or create a new one
// Path: /api/tickets/
router.route('/')
  .get(protect, getTickets)
  .post(protect, createTicket);

// 3. Add the new route for admins and agents (MUST come before /:id route)
// Path: /api/tickets/all
router.get(
  '/all',
  protect, // First, check if they are logged in
  authorize('Admin', 'Support Agent'), // Admin and Support Agent users can access all tickets
  getAllTickets
);

// Route for getting or updating a single ticket by ID
// Path: /api/tickets/:id
router.route('/:id')
  .get(protect, getTicketById)
  .put(protect, updateTicket);

// Route for adding responses to a ticket
// Path: /api/tickets/:id/responses
router.post(
  '/:id/responses',
  protect,
  authorize('Admin', 'Support Agent'),
  addTicketResponse
);

module.exports = router;