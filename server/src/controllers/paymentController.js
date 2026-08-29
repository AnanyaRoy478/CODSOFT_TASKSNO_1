import Stripe from "stripe";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createCheckoutSession(req, res) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) return res.status(500).json({ message: "Stripe is not configured" });

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart?.items?.length) return res.status(400).json({ message: "Your cart is empty" });

    for (const item of cart.items) {
      if (!item.product || item.quantity > item.product.stock) {
        return res.status(400).json({ message: `Insufficient stock for ${item.product?.name || "an item"}` });
      }
    }

    const amount = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const order = await Order.create({
      user: req.user._id,
      items: cart.items.map(item => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.image,
        price: item.product.price,
        quantity: item.quantity
      })),
      amount,
      currency: "usd"
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: cart.items.map(item => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.product.name, images: item.product.image ? [item.product.image] : [] },
          unit_amount: Math.round(item.product.price * 100)
        },
        quantity: item.quantity
      })),
      success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      customer_email: req.user.email,
      metadata: { orderId: order._id.toString() }
    });

    order.stripeSessionId = session.id;
    await order.save();
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function stripeWebhook(req, res) {
  try {
    const signature = req.headers["stripe-signature"];
    const event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      if (orderId) {
        const order = await Order.findById(orderId);
        if (order) {
          order.paymentStatus = "paid";
          order.status = "paid";
          await order.save();
          await Cart.findOneAndUpdate({ user: order.user }, { $set: { items: [] } });
        }
      }
    }

    res.json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
}
