const { handleStart } = require('./startHandler');
const { handleAskCommand } = require('./askHandler');
const { handleReplyMode } = require('./replyHandler');
const { handleMessage } = require('./messageHandler');

module.exports = {
  handleStart,
  handleAskCommand,
  handleReplyMode,
  handleMessage
};