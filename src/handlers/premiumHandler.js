const { MESSAGES, PREMIUM_PLANS } = require('../config');
const { createPayment } = require('../services/oxapay');
const { getSubscription } = require('../services/supabase');

const handlePremium = async (bot, msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Check if user already has an active subscription
  const subscription = await getSubscription(userId);
  if (subscription && subscription.status === 'active' && new Date(subscription.expires_at) > new Date()) {
    const expiryDate = new Date(subscription.expires_at).toLocaleDateString();
    await bot.sendMessage(
      chatId,
      `You already have an active premium subscription until ${expiryDate}!`,
      { parse_mode: 'HTML' }
    );
    return;
  }

  // Create inline keyboard with premium plans
  const keyboard = {
    inline_keyboard: [
      [{
        text: `Monthly - $${PREMIUM_PLANS.MONTHLY.price}`,
        callback_data: `premium_monthly`
      }],
      [{
        text: `6 Months - $${PREMIUM_PLANS.SEMIANNUAL.price}`,
        callback_data: `premium_semiannual`
      }],
      [{
        text: `Yearly - $${PREMIUM_PLANS.ANNUAL.price}`,
        callback_data: `premium_annual`
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
    const [_, plan] = query.data.split('_');
    const userId = query.from.id;

    // First, answer the callback query immediately to prevent timeout
    await bot.answerCallbackQuery(query.id);

    // Send processing message
    const processingMsg = await bot.sendMessage(
      query.message.chat.id,
      MESSAGES.PAYMENT_PROCESSING
    );

    const payment = await createPayment(userId, plan);
    
    if (payment && payment.payment_url) {
      const keyboard = {
        inline_keyboard: [[
          { text: '💳 Pay Now', url: payment.payment_url }
        ]]
      };

      // Update the processing message instead of editing the original
      await bot.editMessageText(
        `Great choice! Click below to complete your payment:`,
        {
          chat_id: query.message.chat.id,
          message_id: processingMsg.message_id,
          reply_markup: keyboard,
          parse_mode: 'HTML'
        }
      );
    } else {
      throw new Error('Failed to create payment');
    }
  } catch (error) {
    console.error('Premium payment error:', error);
    
    // Try to send a new message if editing fails
    try {
      await bot.sendMessage(
        query.message.chat.id,
        MESSAGES.PAYMENT_FAILED
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