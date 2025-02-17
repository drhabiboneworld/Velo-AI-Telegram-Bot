const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');
const { scheduleCleanup } = require('./cleanup');

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      // Add MongoDB optimization options
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
      compressors: ['zlib'],
      zlibCompressionLevel: 6
    });
    
    // Create indexes for better query performance
    const User = require('../models/User');
    const Group = require('../models/Group');
    
    await Promise.all([
      // User indexes
      User.collection.createIndex({ userId: 1 }, { unique: true }),
      User.collection.createIndex({ lastInteraction: 1 }),
      User.collection.createIndex({ isPremium: 1 }),
      User.collection.createIndex({ isBlocked: 1 }),
      
      // Group indexes
      Group.collection.createIndex({ groupId: 1 }, { unique: true }),
      Group.collection.createIndex({ lastActivity: 1 })
    ]);

    // Schedule database cleanup
    scheduleCleanup();
    
    console.log('MongoDB connected and optimized successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Optimize MongoDB connection
mongoose.set('bufferCommands', false); // Disable buffering
mongoose.set('autoIndex', false); // Disable automatic index creation

module.exports = { connectDB };