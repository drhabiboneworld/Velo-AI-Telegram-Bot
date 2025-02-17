const { handleStart } = require('./startHandler');
const { handleAskCommand } = require('./askHandler');
const { handleReplyMode } = require('./replyHandler');
const { handleMessage } = require('./messageHandler');
const { handleStats } = require('./statsHandler');

// Export all handlers
module.exports = {
  handleStart,
  handleAskCommand,
  handleReplyMode,
  handleMessage,
  handleStats
};