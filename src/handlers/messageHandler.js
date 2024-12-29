const { replyModeUsers } = require('./replyHandler');
const { processQuery } = require('./queryHandler');
const { checkUser } = require('../utils/userCheck');

const handleMessage = async (bot, msg) => {
  if (!await checkUser(bot, msg)) return;
  
  if (replyModeUsers.has(msg.from.id) && msg.chat.type === 'private') {
    await processQuery(bot, msg, msg.text);
  }
};

module.exports = { handleMessage };