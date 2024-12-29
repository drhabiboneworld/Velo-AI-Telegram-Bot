const { MESSAGES, DONATION_URL, SOURCE_CODE_URL } = require('../config');
const { isUserBlocked, checkRateLimit } = require('../utils/userChecks');

const handleStart = async (bot, msg) => {
  if (isUserBlocked(msg.from.id) || await checkRateLimit(bot, msg)) {
    return;
  }

  const keyboard = {
    inline_keyboard: [
      [
        { text: '🎁 Support Development', url: DONATION_URL },
        { text: '📱 Source Code', url: SOURCE_CODE_URL }
      ]
    ]
  };

  await bot.sendMessage(msg.chat.id, MESSAGES.WELCOME, {
    parse_mode: 'HTML',
    reply_markup: keyboard
  });
};

module.exports = { handleStart };