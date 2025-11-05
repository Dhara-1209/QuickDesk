require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const createEndUser = async () => {
  try {
    await connectDB();

    // Check if user@quickdesk.com already exists
    const existingUser = await User.findOne({ email: 'user@quickdesk.com' });
    
    if (existingUser) {
      console.log('✅ user@quickdesk.com already exists:', existingUser.displayName);
      return;
    }

    // Create the user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const newUser = new User({
      displayName: 'End User',
      email: 'user@quickdesk.com',
      password: hashedPassword,
      role: 'End User',
    });

    await newUser.save();
    console.log('✅ Created user@quickdesk.com successfully!');

    // List all users to verify
    const users = await User.find({}).select('displayName email role');
    console.log('\n👥 All Users:');
    users.forEach(user => {
      console.log(`  - ${user.displayName} (${user.role}) - ${user.email}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createEndUser();