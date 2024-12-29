const { processQuery } = require('./queryHandler');
const { checkUser } = require('../utils/userCheck');

const handleAskCommand = async (bot, msg, match) => {
  if (!await checkUser(bot, msg)) return;

  const query = match[1];
  if (!query) {
    await bot.sendMessage(msg.chat.id, "Please provide a question after /ask");
    return;
  }

  await processQuery(bot, msg, query);
};

module.exports = { handleAskCommand };