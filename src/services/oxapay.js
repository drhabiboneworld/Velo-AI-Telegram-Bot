const axios = require('axios');
const { OXAPAY_MERCHANT_API, PREMIUM_PLANS } = require('../config');

const OXAPAY_API_URL = 'https://api.oxapay.com/merchants';

const createPayment = async (userId, plan) => {
  try {
    const planConfig = PREMIUM_PLANS[plan.toUpperCase()];
    if (!planConfig) {
      throw new Error('Invalid plan selected');
    }

    const response = await axios.post(`${OXAPAY_API_URL}/request`, {
      merchant: OXAPAY_MERCHANT_API,
      amount: planConfig.price,
      currency: 'USD',
      order_id: `${userId}_${planConfig.id}_${Date.now()}`,
      description: planConfig.description,
      callback_url: `${process.env.WEBHOOK_URL}/oxapay/callback`,
      success_url: `https://t.me/VeloAIbot?start=payment_success`,
      cancel_url: `https://t.me/VeloAIbot?start=payment_cancelled`,
      metadata: {
        userId: userId,
        plan: planConfig.id,
        duration: planConfig.duration
      }
    });

    return response.data;
  } catch (error) {
    console.error('OxaPay payment creation error:', error);
    throw error;
  }
};

const verifyPayment = async (paymentId) => {
  try {
    const response = await axios.post(`${OXAPAY_API_URL}/status`, {
      merchant: OXAPAY_MERCHANT_API,
      payment_id: paymentId
    });

    return response.data;
  } catch (error) {
    console.error('OxaPay payment verification error:', error);
    throw error;
  }
};

module.exports = {
  createPayment,
  verifyPayment
};