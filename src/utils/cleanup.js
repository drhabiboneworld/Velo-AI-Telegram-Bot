const User = require('../models/User');
const Group = require('../models/Group');

// Cleanup thresholds
const INACTIVE_USER_DAYS = 30; // Remove users inactive for 30 days
const INACTIVE_GROUP_DAYS = 7;  // Remove groups inactive for 7 days

const cleanupDatabase = async () => {
  try {
    const inactiveUserDate = new Date();
    inactiveUserDate.setDate(inactiveUserDate.getDate() - INACTIVE_USER_DAYS);

    const inactiveGroupDate = new Date();
    inactiveGroupDate.setDate(inactiveGroupDate.getDate() - INACTIVE_GROUP_DAYS);

    // Remove inactive non-premium users
    const { deletedCount: deletedUsers } = await User.deleteMany({
      isPremium: false,
      isBlocked: false,
      lastInteraction: { $lt: inactiveUserDate }
    });

    // Remove inactive groups
    const { deletedCount: deletedGroups } = await Group.deleteMany({
      lastActivity: { $lt: inactiveGroupDate }
    });

    console.log(`Cleanup completed: Removed ${deletedUsers} inactive users and ${deletedGroups} inactive groups`);
  } catch (error) {
    console.error('Database cleanup error:', error);
  }
};

// Schedule cleanup to run daily at 3 AM
const scheduleCleanup = () => {
  const now = new Date();
  const night = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1, // tomorrow
    3, // 3 AM
    0,
    0
  );
  
  const timeToNextRun = night.getTime() - now.getTime();
  
  // Schedule first run
  setTimeout(() => {
    cleanupDatabase();
    // Then schedule to run every 24 hours
    setInterval(cleanupDatabase, 24 * 60 * 60 * 1000);
  }, timeToNextRun);
};

module.exports = { scheduleCleanup };