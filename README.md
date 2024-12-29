# 🤖 Velora AI - Telegram Bot

A powerful Telegram bot powered by Google's Gemini AI, offering intelligent conversations and assistance.

[![Telegram Bot](https://img.shields.io/badge/Telegram-Bot-blue?logo=telegram)](https://t.me/VeloraAIbot)
[![Node.js](https://img.shields.io/badge/Node.js-v16+-green?logo=node.js)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## ✨ Features

- 🧠 Powered by Google's Gemini AI
- 💬 Natural conversation capabilities
- ⚡ Fast response times
- 🔄 Reply mode for seamless chat
- ⏱️ Smart rate limiting
- 🛡️ Spam protection

## 🚀 Try the Bot

You can try the bot right now by messaging [@VeloraAIbot](https://t.me/VeloraAIbot) on Telegram!

## 🛠️ Development

### Prerequisites

- Node.js 16 or higher
- A Telegram Bot Token
- Google Gemini API Key(s)

### Environment Variables

Create a `.env` file with:

```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
GEMINI_API_KEYS=your_gemini_api_key1,your_gemini_api_key2
ADMIN_ID=your_telegram_user_id
BLOCKED_USERS=comma_separated_user_ids
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/afxz/Velora-AI-Telegram-Bot.git
cd Velora-AI-Telegram-Bot
```

2. Install dependencies
```bash
npm install
```

3. Start the bot
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## 🚀 Deployment

The bot can be deployed to any Node.js hosting platform that supports:
- Node.js 16 or higher
- Environment variables
- Long-running processes

## 📝 Commands

- `/start` - Start the bot
- `/ask` - Ask a question
- `/reply` - Toggle reply mode (on/off)

## ⚡ Rate Limiting

The bot implements smart rate limiting to prevent abuse:
- Initial 3-second cooldown between messages
- Exponential backoff for repeated spam
- Automatic blocking after excessive spam
- 24-hour reset period for good behavior

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💖 Support Development

If you find this bot useful, consider supporting its development:
- Star ⭐ this repository
- Share with friends
- [Buy me a coffee](https://superprofile.bio/vp/64188fab190024001f59f638)
