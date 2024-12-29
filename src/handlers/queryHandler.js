const geminiApi = require('../geminiApi');
const { MESSAGES } = require('../config');

const MAX_MESSAGE_LENGTH = 4096; // Telegram's message length limit

// Split text into chunks that respect Telegram's message length limit
const splitMessage = (text) => {
  const chunks = [];
  let currentChunk = '';

  const paragraphs = text.split('\n\n');

  for (const paragraph of paragraphs) {
    if ((currentChunk + '\n\n' + paragraph).length <= MAX_MESSAGE_LENGTH) {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
      }
      currentChunk = paragraph;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
};

const processQuery = async (bot, msg, query) => {
  try {
    const sentMsg = await bot.sendMessage(msg.chat.id, "🤔 Thinking...", {
      reply_to_message_id: msg.message_id
    });

    const response = await geminiApi.generateResponse(query);
    
    // Handle long messages by splitting them
    if (response.length > MAX_MESSAGE_LENGTH) {
      const chunks = splitMessage(response);
      
      // Delete the "Thinking..." message
      await bot.deleteMessage(msg.chat.id, sentMsg.message_id);
      
      // Send each chunk as a separate message
      for (let i = 0; i < chunks.length; i++) {
        await bot.sendMessage(msg.chat.id, chunks[i], {
          parse_mode: 'HTML',
          disable_web_page_preview: true,
          reply_to_message_id: i === 0 ? msg.message_id : undefined // Only reply to original message for first chunk
        });
      }
    } else {
      // For short messages, just edit the "Thinking..." message
      await bot.editMessageText(response, {
        chat_id: msg.chat.id,
        message_id: sentMsg.message_id,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      });
    }
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