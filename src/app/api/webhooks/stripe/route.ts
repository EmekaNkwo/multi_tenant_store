import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/db";
import Order from "@/app/api/models/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      case "transfer.created":
        await handleTransferCreated(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  await connectDB();

  const order = await Order.findOne({
    paymentIntentId: session.payment_intent,
  });
  if (!order) return;

  order.status = "processing";
  await order.save();
}

async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
) {
  await connectDB();

  const order = await Order.findOne({ paymentIntentId: paymentIntent.id });
  if (!order) return;

  order.status = "completed";
  await order.save();

  // Create transfer to merchant
  const transfer = await stripe.transfers.create({
    amount: calculatePayoutAmount(order.total),
    currency: "usd",
    destination: order.store.stripeAccountId,
    description: `Payout for order ${order.orderId}`,
  });

  // Save transfer details
  order.transferId = transfer.id;
  await order.save();
}

async function handleTransferCreated(transfer: Stripe.Transfer) {
  await connectDB();

  const order = await Order.findOne({ transferId: transfer.id });
  if (!order) return;

  order.payoutStatus = "completed";
  await order.save();
}

function calculatePayoutAmount(total: number): number {
  const platformFeePercentage = Number(process.env.PLATFORM_FEE_PERCENT || 10);
  const platformFee = total * (platformFeePercentage / 100);
  return Math.round(total - platformFee);
}
