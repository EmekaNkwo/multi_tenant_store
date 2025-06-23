import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/db";
import { getAuthenticatedUser } from "../../../lib/auth";

import Product from "@/app/api/models/Product";
import Order from "@/app/api/models/Order";
import Cart from "@/app/api/models/Cart";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { cartItems } = await req.json();
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectDB();

    // Fetch full product details
    const productIds = cartItems.map((item: any) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    // Calculate total amount
    let total = 0;
    const lineItems = [];

    for (const item of cartItems) {
      const product = products.find((p) => p._id.toString() === item.productId);
      if (!product) continue;

      total += product.price * item.quantity;

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.title,
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      });
    }

    // Create order record
    const order = new Order({
      userId: user.id,
      storeId: products[0].storeId, // All products should be from same store
      items: cartItems.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: products.find((p) => p._id.toString() === item.productId)?.price,
      })),
      total,
      status: "pending",
    });

    await order.save();

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/orders?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart?canceled=true`,
      metadata: {
        userId: user.id,
        orderId: order._id.toString(),
      },
    });

    // Clear user's cart
    await Cart.findOneAndUpdate({ userId: user.id }, { $set: { items: [] } });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Checkout failed" },
      { status: 500 }
    );
  }
}
