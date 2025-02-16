const TelegramBot = require('node-telegram-bot-api');
const http = require('http');
const { TELEGRAM_BOT_TOKEN } = require('./config');
const {
  handleStart,
  handleAskCommand,
  handleReplyMode,
  handleMessage,
  handleReminder,
  handleBroadcast,
  handleHelp
} = require('./handlers');
const { handleError } = require('./utils/errorHandler');
const { setupScheduler } = require('./utils/scheduler');

// Single bot instance
let bot = null;
let isShuttingDown = false;

// Create HTTP server for health checks
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200);
    res.end('OK');
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(8080, () => {
  console.log('Health check server listening on port 8080');
});

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
    bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { 
      polling: {
        params: {
          timeout: 30,
          limit: 100
        },
        interval: 2000
      }
    });

    // Initialize scheduler
    setupScheduler(bot);

    bot.on('polling_error', (error) => {
      if (error.code === 'ETELEGRAM' && error.message.includes('Conflict')) {
        console.log('Detected polling conflict, cleaning up...');
        cleanup().catch(console.error);
      } else {
        console.error('Polling error:', error.message);
      }
    });
    
    bot.on('error', handleError);

    await bot.setMyCommands([
      { command: 'start', description: 'Start the bot' },
      { command: 'ask', description: 'Ask a question' },
      { command: 'reply', description: 'Toggle reply mode (on/off)' },
      { command: 'rem', description: 'Set a reminder (e.g., /rem 2h meeting)' },
      { command: 'help', description: 'Show all commands' }
    ]);

    // Register command handlers with improved regex patterns
    bot.onText(/^\/(start|help)(?:@\w+)?$/, msg => {
      if (msg.text.startsWith('/help')) {
        handleHelp(bot, msg);
      } else {
        handleStart(bot, msg);
      }
    });
    
    bot.onText(/^\/ask(?:@\w+)?(?:\s+(.+))?$/, (msg, match) => handleAskCommand(bot, msg, match));
    bot.onText(/^\/reply(?:@\w+)?(?:\s+(.+))?$/, (msg, match) => handleReplyMode(bot, msg, match));
    bot.onText(/^\/rem(?:@\w+)?(?:\s+(.+))?$/, (msg, match) => handleReminder(bot, msg, match));
    
    // Broadcast commands
    bot.onText(/^\/broadcast_(dm|groups|all)(?:@\w+)?$/, (msg, match) => handleBroadcast(bot, msg, match[1]));

    // Handle regular messages (for reply mode)
    bot.on('message', msg => {
      if (!msg.text?.startsWith('/')) {
        handleMessage(bot, msg);
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