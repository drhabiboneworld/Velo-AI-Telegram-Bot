require('dotenv').config();

const MESSAGES = {
  WELCOME: "✨ <b>Welcome to Velora AI!</b> ✨\n\n" +
    "🤖 I'm your AI assistant powered by Gemini\n\n" +
    "Quick Commands:\n" +
    "📝 /ask - Ask me anything\n" +
    "💭 /reply - Chat mode (DM only)\n" +
    "⏰ /rem - Set a reminder (e.g., /rem 2h meeting)\n" +
    "❓ /help - Show all commands\n\n" +
    "Plans:\n" +
    "🆓 Free - Limited responses per day\n" +
    "💎 Premium - Extended usage limits\n\n" +
    "Join our channel for updates: @VeloAI\n\n" +
    "Let's begin our conversation! 🚀",
  REPLY_MODE_DM_ONLY: "ℹ️ Reply mode only works in private chat!\n👉 Please message me directly @${botUsername} to use this feature",
  REPLY_MODE_ON: "✨ Reply mode is now ON. Chat with me directly!",
  REPLY_MODE_OFF: "Reply mode is now OFF. Use /ask command to ask questions",
  MESSAGE_TOO_LONG: "⚠️ Message is too long. Please try a shorter message.",
  HELP: "🤖 <b>Available Commands:</b>\n\n" +
    "🔹 /start - Start the bot\n" +
    "🔹 /ask - Ask me anything\n" +
    "🔹 /reply - Toggle reply mode (DM only)\n" +
    "🔹 /rem - Set a reminder (max 24h)\n" +
    "   Example: /rem 2h meeting\n\n" +
    "<b>Admin Commands:</b>\n" +
    "🔸 /broadcast_dm - Broadcast to DMs\n" +
    "🔸 /broadcast_groups - Broadcast to groups\n" +
    "🔸 /broadcast_all - Broadcast to all\n\n" +
    "<b>Usage Limits:</b>\n" +
    "Free Users: 20 responses/day\n" +
    "Premium Users: 200 responses/day\n\n" +
    "💎 For premium access, contact @nvkio",
  REMINDER_SET: "⏰ Reminder set for ${time}!\nI'll remind you: ${message}",
  REMINDER_TOO_LONG: "⚠️ Maximum reminder duration is 24 hours!",
  REMINDER_INVALID: "⚠️ Invalid reminder format!\nExample: /rem 2h meeting",
  BROADCAST_SENT: "✅ Broadcast sent to ${count} chats",
  LIMIT_REACHED: "⚠️ Daily limit reached!\nContact @nvkio to upgrade to premium.",
  REMINDER_NOTIFY: "⏰ <b>Reminder!</b>\n\n${message}"
};

// Parse IDs from env vars
const ADMIN_IDS = process.env.ADMIN_ID.split(',').map(id => parseInt(id.trim()));
const BLOCKED_USERS = process.env.BLOCKED_USERS ? 
  process.env.BLOCKED_USERS.split(',').map(id => parseInt(id.trim())) : 
  [];
const PREMIUM_USERS = process.env.PREMIUM_USERS ?
  process.env.PREMIUM_USERS.split(',').map(id => parseInt(id.trim())) :
  [];

// Usage limits
const USAGE_LIMITS = {
  FREE: 20,
  PREMIUM: 200
};

module.exports = {
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  GEMINI_API_KEYS: process.env.GEMINI_API_KEYS.split(','),
  ADMIN_IDS,
  BLOCKED_USERS,
  PREMIUM_USERS,
  USAGE_LIMITS,
  DONATION_URL: "https://superprofile.bio/vp/64188fab190024001f59f638",
  SOURCE_CODE_URL: "https://gplinks.co/velora",
  MESSAGES
};