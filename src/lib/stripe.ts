import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function createCheckoutSession(cartItems: any[]) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            description: item.description || "",
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity || 1,
      })),
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    });

    if (!session.id) {
      throw new Error("Failed to create checkout session");
    }

    return { sessionId: session.id };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw new Error("Failed to create checkout session");
  }
}

// Create Express account
export const createConnectedAccount = async (email: string) => {
  return stripe.accounts.create({
    type: "express",
    email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });
};

// Create account link for onboarding
export const createAccountLink = (accountId: string) => {
  return stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.NEXTAUTH_URL}/merchant/dashboard`,
    return_url: `${process.env.NEXTAUTH_URL}/merchant/dashboard`,
    type: "account_onboarding",
  });
};

export const createStripeAccount = async (email: string) => {
  const account = await createConnectedAccount(email);
  const accountLink = await createAccountLink(account.id);
  return { url: accountLink.url };
};
