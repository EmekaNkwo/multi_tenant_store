"use client";

import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/lib/stripe";
import { loadStripe } from "@stripe/stripe-js";

import { toast } from "sonner";

export function CheckoutButton({ cartItems }: { cartItems: any[] }) {
  const handleCheckout = async () => {
    try {
      const { sessionId } = await createCheckoutSession(cartItems);
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );

      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          toast.error("Checkout Error");
        }
      }
    } catch (error) {
      toast.error("Checkout Failed");
    }
  };

  return (
    <Button onClick={handleCheckout} size="lg" className="w-full mt-6">
      Proceed to Checkout
    </Button>
  );
}
