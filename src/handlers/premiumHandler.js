const { MESSAGES, PREMIUM_PLANS } = require('../config');
const { createSubscription } = require('../services/supabase');

const handlePremium = async (bot, msg) => {
  const chatId = msg.chat.id;

  // Create inline keyboard with premium plans
  const keyboard = {
    inline_keyboard: [
      [{
        text: `Monthly - $${PREMIUM_PLANS.MONTHLY.price}`,
        callback_data: 'premium_MONTHLY'
      }],
      [{
        text: `6 Months - $${PREMIUM_PLANS.SEMIANNUAL.price}`,
        callback_data: 'premium_SEMIANNUAL'
      }],
      [{
        text: `Yearly - $${PREMIUM_PLANS.ANNUAL.price}`,
        callback_data: 'premium_ANNUAL'
      }]
    ]
  };

  await bot.sendMessage(
    chatId,
    MESSAGES.PREMIUM_PLANS,
    {
      parse_mode: 'HTML',
      reply_markup: keyboard
    }
  );
};

const handlePremiumCallback = async (bot, query) => {
  try {
    console.log('Received callback data:', query.data);

    if (!query.data || !query.data.includes('_')) {
      console.error('Invalid callback data format:', query.data);
      throw new Error('Invalid callback data format');
    }

    const [prefix, action] = query.data.split('_');
    
    if (prefix !== 'premium') {
      console.error('Invalid callback prefix:', prefix);
      throw new Error('Invalid callback prefix');
    }

    // Handle the initial premium button click from start message
    if (action === 'START') {
      await bot.answerCallbackQuery(query.id);
      return handlePremium(bot, { chat: { id: query.message.chat.id } });
    }

    console.log('Looking up plan with key:', action);
    console.log('Available plans:', Object.keys(PREMIUM_PLANS));

    const planConfig = PREMIUM_PLANS[action];
    if (!planConfig) {
      console.error('Plan not found for key:', action);
      throw new Error(`Plan not found: ${action}`);
    }

    // Answer the callback query immediately
    await bot.answerCallbackQuery(query.id);

    // Create payment keyboard with direct payment link
    const keyboard = {
      inline_keyboard: [[
        { text: '💳 Pay Now', url: planConfig.payment_url }
      ]]
    };

    // Update the message with payment instructions and link
    const paymentInstructions = MESSAGES.PAYMENT_INSTRUCTIONS
      .replace('${planName}', planConfig.name)
      .replace('${price}', planConfig.price);

    await bot.editMessageText(
      paymentInstructions,
      {
        chat_id: query.message.chat.id,
        message_id: query.message.message_id,
        reply_markup: keyboard,
        parse_mode: 'HTML'
      }
    );
  } catch (error) {
    console.error('Premium payment error:', error);
    try {
      // Send a more detailed error message in development
      const errorMessage = process.env.NODE_ENV === 'development' 
        ? `${MESSAGES.PAYMENT_FAILED}\n\nDebug: ${error.message}`
        : MESSAGES.PAYMENT_FAILED;

      await bot.editMessageText(
        errorMessage,
        {
          chat_id: query.message.chat.id,
          message_id: query.message.message_id,
          parse_mode: 'HTML'
        }
      );
    } catch (sendError) {
      console.error('Failed to send error message:', sendError);
    }
  }
};

module.exports = {
  handlePremium,
  handlePremiumCallback
};