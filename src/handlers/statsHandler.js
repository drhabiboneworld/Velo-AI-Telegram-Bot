const { MESSAGES } = require('../config');
const { isAdmin } = require('../utils/userCheck');
const User = require('../models/User');
const Group = require('../models/Group');

const handleStats = async (bot, msg) => {
  if (!isAdmin(msg.from.id)) {
    await bot.sendMessage(msg.chat.id, MESSAGES.UNAUTHORIZED);
    return;
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      blockedUsers,
      premiumUsers,
      activeGroups,
      activeUsers
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isBlocked: true }),
      User.countDocuments({ isPremium: true }),
      Group.countDocuments({ lastActivity: { $gte: today } }),
      User.countDocuments({ lastInteraction: { $gte: today } })
    ]);

    // Get total messages processed today
    const messagesProcessed = await User.aggregate([
      {
        $match: {
          lastUsageReset: { $gte: today }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$dailyUsage' }
        }
      }
    ]);

    const stats = MESSAGES.STATS
      .replace('${totalUsers}', totalUsers)
      .replace('${blockedUsers}', blockedUsers)
      .replace('${premiumUsers}', premiumUsers)
      .replace('${activeGroups}', activeGroups)
      .replace('${activeUsers}', activeUsers)
      .replace('${messagesProcessed}', messagesProcessed[0]?.total || 0);

    await bot.sendMessage(msg.chat.id, stats, {
      parse_mode: 'HTML',
      reply_to_message_id: msg.message_id
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    await bot.sendMessage(
      msg.chat.id,
      '❌ Error fetching statistics. Please try again later.',
      { reply_to_message_id: msg.message_id }
    );
  }
};

module.exports = { handleStats };