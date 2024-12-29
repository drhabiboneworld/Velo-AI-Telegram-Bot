require('dotenv').config();

const MESSAGES = {
  WELCOME: "✨ <b>Welcome to Velora AI!</b> ✨\n\n" +
    "🤖 I'm your AI assistant powered by Gemini\n\n" +
    "Quick Commands:\n" +
    "📝 /ask - Ask me anything\n" +
    "💭 /reply - Chat mode (DM only)\n\n" +
    "Let's begin our conversation! 🚀",
  REPLY_MODE_DM_ONLY: "ℹ️ Reply mode only works in private chat!\n👉 Please message me directly @${botUsername} to use this feature",
  REPLY_MODE_ON: "✨ Reply mode is now ON. Chat with me directly!",
  REPLY_MODE_OFF: "Reply mode is now OFF. Use /ask command to ask questions"
};

module.exports = {
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  GEMINI_API_KEYS: process.env.GEMINI_API_KEYS.split(','),
  ADMIN_ID: parseInt(process.env.ADMIN_ID),
  BLOCKED_USERS: process.env.BLOCKED_USERS ? process.env.BLOCKED_USERS.split(',').map(id => parseInt(id.trim())) : [],
  DONATION_URL: "https://superprofile.bio/vp/64188fab190024001f59f638",
  SOURCE_CODE_URL: "https://gplinks.co/velora",
  MESSAGES
};