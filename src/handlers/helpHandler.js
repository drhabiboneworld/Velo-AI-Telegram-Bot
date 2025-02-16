const { MESSAGES } = require('../config');
const { checkUser } = require('../utils/userCheck');

const handleHelp = async (bot, msg) => {
  if (!await checkUser(bot, msg)) return;

  await bot.sendMessage(msg.chat.id, MESSAGES.HELP, {
    parse_mode: 'HTML',
    reply_to_message_id: msg.message_id
  });
};

module.exports = { handleHelp };