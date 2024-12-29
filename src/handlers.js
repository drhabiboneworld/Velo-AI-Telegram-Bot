const { handleStart } = require('./handlers/startHandler');
const { handleAskCommand } = require('./handlers/askHandler');
const { handleReplyMode } = require('./handlers/replyHandler');
const { handleMessage } = require('./handlers/messageHandler');

module.exports = {
  handleStart,
  handleAskCommand,
  handleReplyMode,
  handleMessage
};