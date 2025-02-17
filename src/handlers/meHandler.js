const { MESSAGES } = require('../config');
const { isAdmin, isPremium, checkUser } = require('../utils/userCheck');
const { getUserUsage } = require('../utils/userCheck');

const handleMe = async (bot, msg) => {
  if (!await checkUser(bot, msg)) return;

  const userId = msg.from.id;
  let status = '🆓 Free User';
  
  if (isAdmin(userId)) {
    status = '👑 Admin';
  } else if (isPremium(userId)) {
    status = '💎 Premium User';
  }

  const { used, total } = getUserUsage(userId);
  const remaining = total - used;

  const statusMessage = MESSAGES.USER_STATUS
    .replace('${status}', status)
    .replace('${used}', used)
    .replace('${total}', total)
    .replace('${remaining}', remaining);

  await bot.sendMessage(msg.chat.id, statusMessage, {
    parse_mode: 'HTML',
    reply_to_message_id: msg.message_id
  });
};

module.exports = { handleMe };