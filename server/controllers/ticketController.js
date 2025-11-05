// server/controllers/ticketController.js
const Ticket = require('../models/Ticket');
const User = require('../models/User');

// @desc    Get all tickets for the logged-in user
// @route   GET /api/tickets
// @access  Private
const getTickets = async (req, res) => {
  try {
    // We get the user from the protect middleware
    const tickets = await Ticket.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get a single ticket by ID
// @route   GET /api/tickets/:id
// @access  Private
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('user', 'displayName email')
      .populate('responses.user', 'displayName email');
    
    if (!ticket) {
      return res.status(404).json({ msg: 'Ticket not found' });
    }

    // Check if the user owns this ticket or is an admin/agent
    if (ticket.user._id.toString() !== req.user.id && 
        !['Support Agent', 'Admin'].includes(req.user.role)) {
      return res.status(401).json({ msg: 'Not authorized to view this ticket' });
    }

    res.json(ticket);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Ticket not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Create a new ticket
// @route   POST /api/tickets
// @access  Private
const createTicket = async (req, res) => {
  const { subject, description, category } = req.body;

  // Basic validation
  if (!subject || !description || !category) {
    return res.status(400).json({ msg: 'Please include all fields' });
  }

  try {
    const newTicket = new Ticket({
      subject,
      description,
      category,
      user: req.user.id, // Assign the logged-in user
    });

    const ticket = await newTicket.save();
    res.status(201).json(ticket);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a ticket
// @route   PUT /api/tickets/:id
// @access  Private
const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ msg: 'Ticket not found' });
    }

    // Check if the user owns this ticket or is an admin/agent
    if (ticket.user.toString() !== req.user.id && 
        !['Support Agent', 'Admin'].includes(req.user.role)) {
      return res.status(401).json({ msg: 'Not authorized to update this ticket' });
    }

    const { subject, description, category, status, priority } = req.body;

    // Create update object with only provided fields
    const updateFields = {};
    if (subject !== undefined) updateFields.subject = subject;
    if (description !== undefined) updateFields.description = description;
    if (category !== undefined) updateFields.category = category;
    if (status !== undefined) updateFields.status = status;
    if (priority !== undefined) updateFields.priority = priority;

    // Add updatedAt timestamp
    updateFields.updatedAt = Date.now();

    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    ).populate('user', 'displayName email');

    res.json(updatedTicket);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Ticket not found' });
    }
    res.status(500).send('Server Error');
  }
};

// --- Add this new function ---
// @desc    Get all tickets for agents/admins
// @route   GET /api/tickets/all
// @access  Private (Support Agent, Admin)
const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({}).populate('user', 'displayName email').sort({ createdAt: -1 });
    // .populate('user', 'displayName email') will fetch the user's name and email along with the ticket
    res.json(tickets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Add response to a ticket
// @route   POST /api/tickets/:id/responses
// @access  Private (Support Agent, Admin)
const addTicketResponse = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ msg: 'Please provide a response message' });
    }

    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ msg: 'Ticket not found' });
    }

    // Only admins and support agents can add responses
    if (!['Support Agent', 'Admin'].includes(req.user.role)) {
      return res.status(403).json({ msg: 'Not authorized to add responses' });
    }

    // Add the new response
    const newResponse = {
      user: req.user.id,
      message: message.trim(),
      createdAt: new Date(),
    };

    ticket.responses.push(newResponse);
    await ticket.save();

    // Populate the ticket with user details and response user details
    const updatedTicket = await Ticket.findById(req.params.id)
      .populate('user', 'displayName email')
      .populate('responses.user', 'displayName email');

    res.json(updatedTicket);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Ticket not found' });
    }
    res.status(500).send('Server Error');
  }
};

// --- Make sure to export all functions ---
module.exports = {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  getAllTickets, // <-- Add this
  addTicketResponse, // <-- Add this new one
};