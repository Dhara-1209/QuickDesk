const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/quickdesk');

const Ticket = require('./models/Ticket');
const User = require('./models/User');

setTimeout(async () => {
  try {
    const tickets = await Ticket.find({});
    const users = await User.find({});
    
    console.log('📊 Database Status:');
    console.log('📋 Tickets:', tickets.length);
    tickets.forEach(t => console.log('  -', t.subject, '(' + t.status + ')'));
    
    console.log('👥 Users:', users.length);
    users.forEach(u => console.log('  -', u.displayName, '(' + u.role + ')'));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}, 2000);