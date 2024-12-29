const { ADMIN_IDS, BLOCKED_USERS } = require('../config');

const isAdmin = (userId) => ADMIN_IDS.includes(userId);
const isBlocked = (userId) => BLOCKED_USERS.includes(userId);

// Check if user is blocked, silently ignore if they are
const checkUser = async (bot, msg) => {
  if (isBlocked(msg.from.id)) {
    return false;
  }
  return true;
};

module.exports = { isAdmin, isBlocked, checkUser };