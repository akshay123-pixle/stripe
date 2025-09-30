import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Hardcoded Checkout Session
export const vCreate = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Test Product",
            },
            unit_amount: 1000, // 1000 cents = $10
          },
          quantity: 1,
        },
      ],
      success_url: "https://example.com/success",
      cancel_url: "https://example.com/cancel",
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Checkout session failed" });
  }
};
