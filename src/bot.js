const TelegramBot = require('node-telegram-bot-api');
const http = require('http');
const { TELEGRAM_BOT_TOKEN } = require('./config');
const handlers = require('./handlers');
const { handleError } = require('./utils/errorHandler');
const { handlePremium, handlePremiumCallback } = require('./handlers/premiumHandler');

// Validate required environment variables
if (!TELEGRAM_BOT_TOKEN) {
  console.error('ERROR: TELEGRAM_BOT_TOKEN is required!');
  process.exit(1);
}

// Single bot instance
let bot = null;
let isShuttingDown = false;

// Create HTTP server for health checks and webhooks
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200);
    res.end('OK');
  } else if (req.url === '/oxapay/callback' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        // Handle OxaPay callback
        if (data.status === 'completed') {
          const { userId, plan, duration } = data.metadata;
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + duration);
          
          await createSubscription(userId, plan, expiresAt);
          await bot.sendMessage(userId, MESSAGES.PAYMENT_SUCCESS);
        }
        res.writeHead(200);
        res.end('OK');
      } catch (error) {
        console.error('Webhook error:', error);
        res.writeHead(500);
        res.end('Error');
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

// Try different ports if 8080 is in use
const startServer = (port = 8080) => {
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying ${port + 1}`);
      startServer(port + 1);
    }
  });

  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

startServer();

const cleanup = async () => {
  if (bot && !isShuttingDown) {
    isShuttingDown = true;
    console.log('Stopping bot...');
    try {
      await bot.stopPolling();
      bot = null;
      console.log('Bot stopped successfully');
    } catch (error) {
      console.error('Error stopping bot:', error);
    }
    isShuttingDown = false;
  }
};

const startBot = async () => {
  await cleanup();

  try {
    console.log('Starting Telegram bot...');
    bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { 
      polling: {
        params: {
          timeout: 30,
          allowed_updates: ["message", "callback_query"]
        },
        interval: 2000
      }
    });

    bot.on('polling_error', (error) => {
      console.error('Polling error:', error.message);
      if (error.code === 'ETELEGRAM' && error.message.includes('Conflict')) {
        console.log('Detected polling conflict, cleaning up...');
        cleanup().catch(console.error);
      }
    });
    
    bot.on('error', handleError);

    await bot.setMyCommands([
      { command: 'start', description: 'Start the bot' },
      { command: 'ask', description: 'Ask a question' },
      { command: 'reply', description: 'Toggle reply mode (on/off)' },
      { command: 'premium', description: 'Upgrade to Premium' }
    ]);

    // Register command handlers
    bot.onText(/^\/start(?:@\w+)?$/, msg => handlers.handleStart(bot, msg));
    bot.onText(/^\/ask(?:@\w+)?(?:\s+(.+))?$/, (msg, match) => handlers.handleAskCommand(bot, msg, match));
    bot.onText(/^\/reply(?:@\w+)?(?:\s+(on|off))?$/, (msg, match) => handlers.handleReplyMode(bot, msg, match));
    bot.onText(/^\/premium(?:@\w+)?$/, msg => handlePremium(bot, msg));
    
    // Handle callback queries for premium
    bot.on('callback_query', query => {
      if (query.data.startsWith('premium_')) {
        handlePremiumCallback(bot, query);
      }
    });
    
    // Handle regular messages (for reply mode)
    bot.on('message', msg => {
      if (!msg.text?.startsWith('/')) {
        handlers.handleMessage(bot, msg);
      }
    });

    console.log('Bot started successfully!');
  } catch (error) {
    console.error('Error starting bot:', error);
    await cleanup();
  }
};

process.on('SIGINT', async () => {
  await cleanup();
  server.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await cleanup();
  server.close();
  process.exit(0);
});

process.on('uncaughtException', async (error) => {
  console.error('Uncaught Exception:', error);
  await cleanup();
  server.close();
  process.exit(1);
});

startBot().catch(console.error);