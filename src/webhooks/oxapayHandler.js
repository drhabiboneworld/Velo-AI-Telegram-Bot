const express = require('express');
const bodyParser = require('body-parser');
const { createSubscription } = require('../services/supabase');
const { OXAPAY_MERCHANT_API } = require('../config');
const { verifyPayment } = require('../services/oxapay');

const router = express.Router();
router.use(bodyParser.json());

router.post('/callback', async (req, res) => {
  try {
    const { payment_id, status, metadata } = req.body;
    
    // Verify the payment with OxaPay
    const paymentStatus = await verifyPayment(payment_id);
    
    if (paymentStatus.status === 'completed') {
      const { userId, plan, duration } = metadata;
      
      // Calculate expiration date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + duration);
      
      // Create or update subscription in Supabase
      await createSubscription(userId, plan, expiresAt.toISOString());
      
      // Send success message to user
      global.bot.sendMessage(userId, 
        '🎉 Thank you for upgrading to Premium!\n\n' +
        'Your premium features are now active. Enjoy enhanced limits and features!'
      );
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('OxaPay webhook error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;