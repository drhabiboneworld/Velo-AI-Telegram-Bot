const { ADMIN_IDS, BLOCKED_USERS, USAGE_LIMITS, MESSAGES } = require('../config');
const { getSubscription } = require('../services/supabase');

// In-memory storage for user usage data
const userUsage = new Map();

const isAdmin = (userId) => ADMIN_IDS.includes(userId);
const isBlocked = (userId) => BLOCKED_USERS.includes(userId);

const isPremium = async (userId) => {
  if (isAdmin(userId)) return true; // Admins are always premium
  const subscription = await getSubscription(userId);
  return subscription && 
         subscription.status === 'active' && 
         new Date(subscription.expires_at) > new Date();
};

const resetDailyUsage = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return {
    count: 0,
    lastReset: now.getTime()
  };
};

const checkUsageLimit = async (userId) => {
  if (isAdmin(userId)) return true; // Admins have no limits
  
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  let usage = userUsage.get(userId);
  if (!usage || usage.lastReset < now.getTime()) {
    usage = resetDailyUsage();
    userUsage.set(userId, usage);
  }

  const premium = await isPremium(userId);
  const limit = premium ? USAGE_LIMITS.PREMIUM : USAGE_LIMITS.FREE;

  return usage.count < limit;
};

const incrementUsage = (userId) => {
  if (isAdmin(userId)) return; // Don't track admin usage
  
  let usage = userUsage.get(userId);
  if (!usage) {
    usage = resetDailyUsage();
  }
  usage.count++;
  userUsage.set(userId, usage);
};

const checkUser = async (bot, msg) => {
  const userId = msg.from.id;

  if (isBlocked(userId)) {
    return false;
  }

  if (isAdmin(userId)) {
    return true; // Admins bypass all checks
  }

  const withinLimit = await checkUsageLimit(userId);
  if (!withinLimit) {
    await bot.sendMessage(
      msg.chat.id,
      MESSAGES.LIMIT_REACHED,
      { 
        parse_mode: 'HTML',
        reply_to_message_id: msg.message_id 
      }
    );
    return false;
  }

  incrementUsage(userId);
  return true;
};

// Clean up old usage data every day
setInterval(() => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  for (const [userId, usage] of userUsage.entries()) {
    if (usage.lastReset < now.getTime()) {
      userUsage.set(userId, resetDailyUsage());
    }
  }
}, 24 * 60 * 60 * 1000);

module.exports = {
  isAdmin,
  isPremium,
  checkUser
};