const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    unique: true
  },
  username: String,
  firstName: String,
  lastName: String,
  isPremium: {
    type: Boolean,
    default: false
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  dailyUsage: {
    type: Number,
    default: 0
  },
  lastUsageReset: {
    type: Date,
    default: Date.now
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  lastInteraction: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  // Add MongoDB optimization options
  minimize: true, // Remove empty objects
  versionKey: false, // Remove __v field
  // Add TTL index for automatic cleanup of old documents
  expires: 60 * 60 * 24 * 30 // 30 days
});

// Add compound indexes for better query performance
userSchema.index({ isPremium: 1, isBlocked: 1, lastInteraction: -1 });
userSchema.index({ lastUsageReset: 1, dailyUsage: 1 });

module.exports = mongoose.model('User', userSchema);