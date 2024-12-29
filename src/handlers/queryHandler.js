const geminiApi = require('../geminiApi');

const processQuery = async (bot, msg, query) => {
  try {
    await bot.sendChatAction(msg.chat.id, 'typing');

    const sentMsg = await bot.sendMessage(msg.chat.id, "🤔 Thinking...", {
      reply_to_message_id: msg.message_id
    });

    const response = await geminiApi.generateResponse(query);
    
    await bot.editMessageText(response, {
      chat_id: msg.chat.id,
      message_id: sentMsg.message_id,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    });
  } catch (error) {
    console.error('Error processing query:', error);
    await bot.sendMessage(
      msg.chat.id, 
      "Sorry, I encountered an error while processing your request.",
      { reply_to_message_id: msg.message_id }
    );
  }
};

module.exports = { processQuery };