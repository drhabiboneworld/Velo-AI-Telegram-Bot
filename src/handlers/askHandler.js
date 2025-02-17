const { processQuery } = require('./queryHandler');
const { checkUser } = require('../utils/userCheck');

const handleAskCommand = async (bot, msg, match) => {
  // First check if user is allowed
  const isAllowed = await checkUser(bot, msg);
  if (!isAllowed) return;

  // Extract query from the command
  const query = match ? match[1] : null;
  
  // If no query is provided, prompt the user
  if (!query) {
    await bot.sendMessage(
      msg.chat.id, 
      "Please provide your question after /ask\nExample: /ask what is the weather today?",
      { reply_to_message_id: msg.message_id }
    );
    return;
  }

  // Process the query
  await processQuery(bot, msg, query);
};

module.exports = { handleAskCommand };