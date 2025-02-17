const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  groupId: {
    type: Number,
    required: true,
    unique: true
  },
  title: String,
  memberCount: Number,
  joinedAt: {
    type: Date,
    default: Date.now
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  // Add MongoDB optimization options
  minimize: true, // Remove empty objects
  versionKey: false, // Remove __v field
  // Add TTL index for automatic cleanup of old documents
  expires: 60 * 60 * 24 * 7 // 7 days
});

// Add indexes for better query performance
groupSchema.index({ lastActivity: -1 });
groupSchema.index({ joinedAt: -1 });

module.exports = mongoose.model('Group', groupSchema);