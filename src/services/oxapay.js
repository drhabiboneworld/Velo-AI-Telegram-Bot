const axios = require('axios');
const { OXAPAY_MERCHANT_API } = require('../config');

const OXAPAY_API_URL = 'https://api.oxapay.com/merchants';

// Create a payment request
const createPayment = async (userId, plan) => {
  try {
    const payload = {
      merchant: OXAPAY_MERCHANT_API,
      amount: plan.price.toString(),
      currency: 'USD',
      order_id: `${userId}_${plan.id}_${Date.now()}`,
      description: plan.description,
      success_url: `https://t.me/VeloAIbot?start=payment_success_${userId}`,
      cancel_url: `https://t.me/VeloAIbot?start=payment_cancelled`
    };

    console.log('Creating payment with payload:', {
      ...payload,
      merchant: '***' // Hide API key in logs
    });

    const response = await axios.post(`${OXAPAY_API_URL}/request`, payload);

    console.log('OxaPay response:', response.data);

    if (!response.data || !response.data.status) {
      throw new Error('Invalid response from OxaPay');
    }

    return response.data;
  } catch (error) {
    console.error('OxaPay payment creation error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Check payment status
const checkPaymentStatus = async (paymentId) => {
  try {
    const response = await axios.post(`${OXAPAY_API_URL}/status`, {
      merchant: OXAPAY_MERCHANT_API,
      payment_id: paymentId
    });

    return response.data;
  } catch (error) {
    console.error('OxaPay status check error:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = {
  createPayment,
  checkPaymentStatus
};