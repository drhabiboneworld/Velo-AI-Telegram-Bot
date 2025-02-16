const { ADMIN_IDS, BLOCKED_USERS, PREMIUM_USERS, USAGE_LIMITS, MESSAGES } = require('../config');

// Store daily usage counts
const userUsage = new Map();

// Reset usage counts at midnight
setInterval(() => {
  const now = new Date();
  if (now.getHours() === 0 && now.getMinutes() === 0) {
    userUsage.clear();
  }
}, 60000); // Check every minute

const isAdmin = (userId) => ADMIN_IDS.includes(userId);
const isBlocked = (userId) => BLOCKED_USERS.includes(userId);
const isPremium = (userId) => PREMIUM_USERS.includes(userId);

const checkUsageLimit = (userId) => {
  const limit = isPremium(userId) ? USAGE_LIMITS.PREMIUM : USAGE_LIMITS.FREE;
  const usage = userUsage.get(userId) || 0;
  return usage < limit;
};

const incrementUsage = (userId) => {
  const currentUsage = userUsage.get(userId) || 0;
  userUsage.set(userId, currentUsage + 1);
};

// Check if user is blocked and handle usage limits
const checkUser = async (bot, msg) => {
  const userId = msg.from.id;
  
  if (isBlocked(userId)) {
    return false;
  }

  // Skip usage check for admins
  if (isAdmin(userId)) {
    return true;
  }

  if (!checkUsageLimit(userId)) {
    await bot.sendMessage(
      msg.chat.id,
      MESSAGES.LIMIT_REACHED,
      { reply_to_message_id: msg.message_id }
    );
    return false;
  }

  incrementUsage(userId);
  return true;
};

module.exports = {
  isAdmin,
  isBlocked,
  isPremium,
  checkUser
};