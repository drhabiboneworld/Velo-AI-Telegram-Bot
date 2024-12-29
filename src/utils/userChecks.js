const { BLOCKED_USERS } = require('../config');
const rateLimit = require('./rateLimit');

const isUserBlocked = (userId) => {
  return BLOCKED_USERS.includes(userId);
};

const checkRateLimit = async (bot, msg) => {
  const userId = msg.from.id;
  const chatId = msg.chat.id;
  
  if (rateLimit.isRateLimited(userId)) {
    const info = rateLimit.getRateLimitInfo(userId);
    if (info.isLimited && info.shouldNotify) {
      // Update the last notified duration
      rateLimit.lastNotifiedDuration.set(userId, info.timeLeft);
      
      await bot.sendMessage(
        chatId,
        `⚠️ You are temporarily rate limited for ${info.timeLeft} minute(s).\n\n` +
        `⏳ If you continue to spam, the cooldown will increase to ${info.nextBanDuration} minutes.\n\n` +
        `🔄 The cooldown timer will reset after 24 hours of good behavior.`,
        { reply_to_message_id: msg.message_id }
      );
    }
    return true;
  }
  return false;
};

module.exports = {
  isUserBlocked,
  checkRateLimit
};