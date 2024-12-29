const { ADMIN_IDS, MESSAGES } = require('../config');

const isAdmin = (userId) => ADMIN_IDS.includes(userId);

const checkAdmin = async (bot, msg) => {
  if (!isAdmin(msg.from.id)) {
    await bot.sendMessage(msg.chat.id, MESSAGES.UNAUTHORIZED);
    return false;
  }
  return true;
};

module.exports = { isAdmin, checkAdmin };