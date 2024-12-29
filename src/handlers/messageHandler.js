const { isUserBlocked, checkRateLimit } = require('../utils/userChecks');
const { replyModeUsers } = require('./replyHandler');
const { processQuery } = require('./queryHandler');

const handleMessage = async (bot, msg) => {
  if (isUserBlocked(msg.from.id) || await checkRateLimit(bot, msg)) {
    return;
  }

  if (replyModeUsers.has(msg.from.id) && msg.chat.type === 'private') {
    await processQuery(bot, msg, msg.text);
  }
};

module.exports = { handleMessage };