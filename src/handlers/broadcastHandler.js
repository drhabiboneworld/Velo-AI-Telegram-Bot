const { checkAdmin } = require('../utils/adminCheck');
const { MESSAGES } = require('../config');

const handleBroadcast = async (bot, msg, type) => {
  if (!await checkAdmin(bot, msg)) return;

  // Check if command is a reply to a message
  if (!msg.reply_to_message) {
    await bot.sendMessage(
      msg.chat.id,
      "Please reply to the message you want to broadcast",
      { reply_to_message_id: msg.message_id }
    );
    return;
  }

  const broadcastMessage = msg.reply_to_message.text;
  const chats = new Set(); // Store unique chat IDs

  try {
    // Get all chats where bot has received messages
    const updates = await bot.getUpdates();
    updates.forEach(update => {
      if (update.message) {
        const chatId = update.message.chat.id;
        const chatType = update.message.chat.type;

        if (type === 'dm' && chatType === 'private') {
          chats.add(chatId);
        } else if (type === 'groups' && ['group', 'supergroup'].includes(chatType)) {
          chats.add(chatId);
        } else if (type === 'all') {
          chats.add(chatId);
        }
      }
    });

    // Send broadcast
    let successCount = 0;
    for (const chatId of chats) {
      try {
        await bot.sendMessage(chatId, broadcastMessage, { parse_mode: 'HTML' });
        successCount++;
      } catch (error) {
        console.error(`Failed to send broadcast to ${chatId}:`, error.message);
      }
    }

    await bot.sendMessage(
      msg.chat.id,
      MESSAGES.BROADCAST_SENT.replace('${count}', successCount),
      { reply_to_message_id: msg.message_id }
    );
  } catch (error) {
    console.error('Broadcast error:', error);
    await bot.sendMessage(
      msg.chat.id,
      "Failed to send broadcast message",
      { reply_to_message_id: msg.message_id }
    );
  }
};

module.exports = { handleBroadcast };