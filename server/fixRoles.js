const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/quickdesk');

const User = require('./models/User');

async function fixRoles() {
  try {
    console.log('Connecting to database...');
    
    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users:`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.displayName} (${user.email}) - Role: ${user.role}`);
    });
    
    if (users.length > 0) {
      // Make first user Admin
      const firstUser = users[0];
      firstUser.role = 'Admin';
      await firstUser.save();
      console.log(`✅ Made ${firstUser.email} an Admin`);
      
      // Find agent account and make it Support Agent
      const agentUser = users.find(u => u.email.includes('agent'));
      if (agentUser) {
        agentUser.role = 'Support Agent';
        await agentUser.save();
        console.log(`✅ Made ${agentUser.email} a Support Agent`);
      }
    }
    
    console.log('\n✅ Roles fixed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixRoles();