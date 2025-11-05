require('dotenv').config();
const mongoose = require('mongoose');
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

const fixUsers = async () => {
  try {
    await connectDB();

    // Update user@quickdesk.com display name
    await User.findOneAndUpdate(
      { email: 'user@quickdesk.com' },
      { displayName: 'End User', role: 'End User' }
    );

    // Clean up duplicate agent account if exists
    const duplicateAgent = await User.findOne({ 
      displayName: 'support agent',
      role: 'End User'
    });
    
    if (duplicateAgent) {
      await User.deleteOne({ _id: duplicateAgent._id });
      console.log('🗑️ Removed duplicate agent account');
    }

    // List all users to verify
    const users = await User.find({}).select('displayName email role').sort('email');
    console.log('\n👥 All Users:');
    users.forEach(user => {
      console.log(`  - ${user.displayName} (${user.role}) - ${user.email}`);
    });

    console.log('\n✅ User accounts fixed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fixUsers();