"use server";

import { createStripeAccount } from "@/lib/stripe";
import { getCurrentUser } from "../lib/auth";
import { connectDB } from "@/lib/db";
import Order from "@/app/api/models/Order";
import Store from "@/app/api/models/Store";

export async function createCheckoutSession(cartItems: any[]) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Authentication required");

  // Create order in database
  await connectDB();
  const order = new Order({
    userId: user.id,
    items: cartItems,
    total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    status: "pending",
  });

  await order.save();

  // Create Stripe Checkout session
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })),
    mode: "payment",
    success_url: `${process.env.NEXTAUTH_URL}/orders?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
    metadata: {
      userId: user.id,
      orderId: order._id.toString(),
    },
  });

  return { sessionId: session.id };
}

export async function connectStripeAccount(userId: string) {
  const { url } = await createStripeAccount(userId);

  // Update user with Stripe account ID
  await connectDB();
  await Store.findOneAndUpdate(
    { owner: userId },
    { $set: { stripeAccountId: "acct_..." } } // Will be set after onboarding
  );

  return { url };
}

export async function createPaymentIntent(cartItems: any[]) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Authentication required");

  // Create order in database
  await connectDB();
  const order = new Order({
    userId: user.id,
    items: cartItems,
    total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    status: "pending",
  });

  await order.save();

  // Create Stripe Payment Intent
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.total * 100),
    currency: "usd",
    metadata: {
      orderId: order._id.toString(),
    },
  });

  return {
    orderId: order._id.toString(),
    clientSecret: paymentIntent.client_secret,
  };
}
