require('dotenv').config();

const MESSAGES = {
  WELCOME: "✨ <b>Welcome to Velora AI!</b> ✨\n\n" +
    "🤖 I'm your AI assistant powered by Gemini\n\n" +
    "Quick Commands:\n" +
    "📝 /ask - Ask me anything\n" +
    "💭 /reply - Chat mode (DM only)\n" +
    "💎 /premium - Upgrade to Premium\n\n" +
    "Usage Limits:\n" +
    "🆓 Free Plan: 20 messages/day\n" +
    "💎 Premium Plan: 200 messages/day\n\n" +
    "Premium Plans:\n" +
    "💳 Monthly - $2/month\n" +
    "💳 6 Months - $10 (Save 17%)\n" +
    "💳 Yearly - $20 (Save 33%)\n\n" +
    "Use /premium to upgrade and get:\n" +
    "✨ Higher daily message limit\n" +
    "🚀 Priority response handling\n" +
    "💫 Extended context memory\n\n" +
    "Join our channel for updates: @VeloAI\n\n" +
    "Let's begin our conversation! 🚀",
  REPLY_MODE_DM_ONLY: "ℹ️ Reply mode only works in private chat!\n👉 Please message me directly @${botUsername} to use this feature",
  REPLY_MODE_ON: "✨ Reply mode is now ON. Chat with me directly!",
  REPLY_MODE_OFF: "Reply mode is now OFF. Use /ask command to ask questions",
  MESSAGE_TOO_LONG: "⚠️ Message is too long. Please try a shorter message.",
  LIMIT_REACHED: "⚠️ Daily limit reached!\n\n💎 Upgrade to Premium to get:\n- 200 messages per day\n- Priority response handling\n- Extended context memory\n\nUse /premium to upgrade!",
  UNAUTHORIZED: "⚠️ You are not authorized to use this command.",
  PREMIUM_PLANS: "💎 <b>Premium Plans</b>\n\n" +
    "Choose your premium plan:\n\n" +
    "1️⃣ Monthly Plan - $2/month\n" +
    "2️⃣ 6 Months Plan - $10 (Save 17%)\n" +
    "3️⃣ Yearly Plan - $20 (Save 33%)\n\n" +
    "Benefits:\n" +
    "✨ 200 messages per day\n" +
    "🚀 Priority response handling\n" +
    "💫 Extended context memory\n\n" +
    "Click the buttons below to upgrade:",
  PAYMENT_INSTRUCTIONS: "💳 <b>Payment Instructions</b>\n\n" +
    "1. Click the 'Pay Now' button below to make the payment\n" +
    "2. Your premium access will be activated automatically after payment\n\n" +
    "⚠️ If automatic activation doesn't work:\n" +
    "Send your payment proof to @nvkio for manual verification\n\n" +
    "Your selected plan: ${planName}\n" +
    "Amount: $${price}",
  PAYMENT_SUCCESS: "🎉 Thank you for upgrading to Premium!\n\nYour premium features are now active. Enjoy enhanced limits and features!",
  PAYMENT_FAILED: "❌ Payment failed. Please try again or contact @nvkio for support."
};

// Parse IDs from env vars
const ADMIN_IDS = process.env.ADMIN_ID ? 
  process.env.ADMIN_ID.split(',').map(id => parseInt(id.trim())) : 
  [];

const BLOCKED_USERS = process.env.BLOCKED_USERS ?
  process.env.BLOCKED_USERS.split(',').map(id => parseInt(id.trim())) :
  [];

// Premium plans configuration with direct payment links
const PREMIUM_PLANS = {
  MONTHLY: {
    id: 'monthly',
    name: 'Monthly Premium',
    price: 2,
    duration: 30, // days
    description: 'Monthly Premium Plan',
    payment_url: 'https://oxapay.com/pay/31173867'
  },
  SEMIANNUAL: {
    id: 'semiannual',
    name: '6 Months Premium',
    price: 10,
    duration: 180, // days
    description: '6 Months Premium Plan',
    payment_url: 'https://oxapay.com/pay/24372024'
  },
  ANNUAL: {
    id: 'annual',
    name: 'Annual Premium',
    price: 20,
    duration: 365, // days
    description: 'Annual Premium Plan',
    payment_url: 'https://oxapay.com/pay/47226401'
  }
};

// Usage limits
const USAGE_LIMITS = {
  FREE: 20,
  PREMIUM: 200
};

module.exports = {
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  GEMINI_API_KEYS: process.env.GEMINI_API_KEYS ? process.env.GEMINI_API_KEYS.split(',') : [],
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,
  OXAPAY_MERCHANT_API: process.env.OXAPAY_MERCHANT_API,
  ADMIN_IDS,
  BLOCKED_USERS,
  PREMIUM_PLANS,
  USAGE_LIMITS,
  SOURCE_CODE_URL: "https://droplink.co/velo",
  MESSAGES
};
