import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post(
  '/',
  bodyParser.raw({ type: 'application/json' }),
  (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error('⚠️ Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // ✅ Log the event type and data
    console.log('🔔 Received event:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('✅ Payment successful!');
      console.log('Session:', session);
    }

    res.status(200).json({ received: true });
  }
);

export default router;
