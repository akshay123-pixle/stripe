import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post("/", bodyParser.raw({ type: "application/json" }), (req, res) => {
  console.log("Im into the webhook");
  
  const sig = req.headers["stripe-signature"];
  let event;

  // ✅ Verify the webhook signature
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ Log the type of event received
  console.log("🔔 Stripe webhook received:", event.type);

  // ✅ Handle different event types
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      console.log("✅ Checkout session completed");
      console.log("Session:", session);
      break;
    }

    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      console.log("✅ Payment intent succeeded");
      console.log("PaymentIntent:", paymentIntent);
      break;
    }

    default:
      console.log("ℹ️ Unhandled event type:", event.type);
  }

  // ✅ Always return 200 to Stripe
  res.status(200).json({ received: true });
});

export default router;
