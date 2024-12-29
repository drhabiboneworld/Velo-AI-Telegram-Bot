const { isUserBlocked, checkRateLimit } = require('../utils/userChecks');
const { processQuery } = require('./queryHandler');

const handleAskCommand = async (bot, msg, match) => {
  if (isUserBlocked(msg.from.id) || await checkRateLimit(bot, msg)) {
    return;
  }

  const query = match[1];
  if (!query) {
    await bot.sendMessage(msg.chat.id, "Please provide a question after /ask");
    return;
  }

  await processQuery(bot, msg, query);
};

module.exports = { handleAskCommand };