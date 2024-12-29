const { MESSAGES } = require('../config');
const { checkUser } = require('../utils/userCheck');

// Store reply mode users
const replyModeUsers = new Set();

const handleReplyMode = async (bot, msg, match) => {
  if (!await checkUser(bot, msg)) return;

  const mode = match[1]?.toLowerCase();
  
  if (!mode || !['on', 'off'].includes(mode)) {
    await bot.sendMessage(msg.chat.id, "Please specify 'on' or 'off' after /reply");
    return;
  }

  // Check if not in DM
  if (msg.chat.type !== 'private') {
    const botUsername = (await bot.getMe()).username;
    await bot.sendMessage(
      msg.chat.id, 
      MESSAGES.REPLY_MODE_DM_ONLY.replace('${botUsername}', botUsername)
    );
    return;
  }

  if (mode === 'on') {
    replyModeUsers.add(msg.from.id);
    await bot.sendMessage(msg.chat.id, MESSAGES.REPLY_MODE_ON);
  } else {
    replyModeUsers.delete(msg.from.id);
    await bot.sendMessage(msg.chat.id, MESSAGES.REPLY_MODE_OFF);
  }
};

module.exports = { 
  handleReplyMode,
  replyModeUsers
};