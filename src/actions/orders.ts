"use server";

import { connectDB } from "@/lib/db";
import Order from "@/app/api/models/Order";
import { getCurrentUser } from "../lib/auth";
import { stripe } from "@/lib/stripe";

export async function createOrder(orderData: {
  items: {
    productId: string;
    quantity: number;
    price: number;
    name: string;
  }[];
  total: number;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  storeId: string;
}) {
  await connectDB();

  const user = await getCurrentUser();

  const order = new Order({
    user: user?.id || null,
    store: orderData.storeId,
    items: orderData.items.map((item) => ({
      product: item.productId,
      quantity: item.quantity,
      price: item.price,
    })),
    total: orderData.total,
    customerName: orderData.customerName,
    customerEmail: orderData.customerEmail,
    shippingAddress: orderData.shippingAddress,
    status: "pending",
  });

  await order.save();

  // Create Stripe Payment Intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(orderData.total * 100),
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

export async function updateOrderStatus(
  orderId: string,
  status: "completed" | "cancelled"
) {
  await connectDB();
  return Order.findByIdAndUpdate(orderId, { status }, { new: true });
}
