const schedule = require('node-schedule');
const { MESSAGES } = require('../config');

// Store scheduled jobs
const jobs = new Map();

const setupScheduler = (bot) => {
  // Clean up expired jobs every hour
  schedule.scheduleJob('0 * * * *', () => {
    const now = Date.now();
    for (const [jobId, job] of jobs.entries()) {
      if (job.nextInvocation() === null) {
        jobs.delete(jobId);
      }
    }
  });
};

const scheduleReminder = (bot, chatId, userId, message, minutes) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes);

  const jobId = `${chatId}_${userId}_${Date.now()}`;
  const job = schedule.scheduleJob(date, async () => {
    try {
      await bot.sendMessage(
        chatId,
        MESSAGES.REMINDER_NOTIFY
          .replace('${message}', message),
        {
          parse_mode: 'HTML',
          reply_markup: {
            reply_to_message: userId
          }
        }
      );
    } catch (error) {
      console.error('Failed to send reminder:', error);
    } finally {
      jobs.delete(jobId);
    }
  });

  jobs.set(jobId, job);
};

module.exports = { setupScheduler, scheduleReminder };