const { MESSAGES, DONATION_URL, SOURCE_CODE_URL } = require('../config');
const { checkUser } = require('../utils/userCheck');

const handleStart = async (bot, msg) => {
  if (!await checkUser(bot, msg)) return;

  const keyboard = {
    inline_keyboard: [
      [
        { text: '🎁 Support Development', url: DONATION_URL },
        { text: '📱 Source Code', url: SOURCE_CODE_URL }
      ],
      [
        { text: '📢 Join Channel', url: 'https://t.me/VeloAI' }
      ]
    ]
  };

  await bot.sendMessage(msg.chat.id, MESSAGES.WELCOME, {
    parse_mode: 'HTML',
    reply_markup: keyboard
  });
};

module.exports = { handleStart };