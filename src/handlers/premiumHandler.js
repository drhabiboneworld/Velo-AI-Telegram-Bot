const { MESSAGES, PREMIUM_PLANS } = require('../config');
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
    const planConfig = PREMIUM_PLANS[plan.toUpperCase()];

    if (!planConfig) {
      throw new Error('Invalid plan selected');
    }

    // Answer the callback query immediately
    await bot.answerCallbackQuery(query.id);

    // Create payment keyboard with direct payment link
    const keyboard = {
      inline_keyboard: [[
        { text: '💳 Pay Now', url: planConfig.payment_url }
      ]]
    };

    // Update the message with payment link
    await bot.editMessageText(
      `Great choice! Click below to complete your payment for the ${planConfig.name}:`,
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