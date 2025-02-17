const { MESSAGES } = require('../config');
const { checkUser } = require('../utils/userCheck');
const { scheduleReminder } = require('../utils/scheduler');

const parseTime = (timeStr) => {
  const match = timeStr.match(/^(\d+)(m|h)$/);
  if (!match) return null;

  const [_, value, unit] = match;
  const minutes = unit === 'h' ? parseInt(value) * 60 : parseInt(value);
  return minutes;
};

const handleReminder = async (bot, msg, match) => {
  if (!await checkUser(bot, msg)) return;

  if (!match || !match[1]) {
    await bot.sendMessage(
      msg.chat.id,
      MESSAGES.REMINDER_INVALID,
      { reply_to_message_id: msg.message_id }
    );
    return;
  }

  const parts = match[1].split(' ');
  const timeStr = parts[0];
  const message = parts.slice(1).join(' ');

  if (!message) {
    await bot.sendMessage(
      msg.chat.id,
      MESSAGES.REMINDER_INVALID,
      { reply_to_message_id: msg.message_id }
    );
    return;
  }

  const minutes = parseTime(timeStr);
  if (!minutes) {
    await bot.sendMessage(
      msg.chat.id,
      MESSAGES.REMINDER_INVALID,
      { reply_to_message_id: msg.message_id }
    );
    return;
  }

  if (minutes > 24 * 60) {
    await bot.sendMessage(
      msg.chat.id,
      MESSAGES.REMINDER_TOO_LONG,
      { reply_to_message_id: msg.message_id }
    );
    return;
  }

  const time = minutes >= 60 
    ? `${Math.floor(minutes / 60)}h${minutes % 60 ? ` ${minutes % 60}m` : ''}`
    : `${minutes}m`;

  scheduleReminder(bot, msg.chat.id, msg.from.id, message, minutes);

  await bot.sendMessage(
    msg.chat.id,
    MESSAGES.REMINDER_SET
      .replace('${time}', time)
      .replace('${message}', message),
    { reply_to_message_id: msg.message_id }
  );
};

module.exports = { handleReminder };