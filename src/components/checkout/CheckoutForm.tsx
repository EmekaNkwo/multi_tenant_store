"use client";

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createOrder } from "@/actions/orders";

const clientSecret = "";
export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart, items } = useCart();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      // Create payment method
      const cardElement = elements.getElement(CardElement)!;
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name,
          email,
          address: {
            line1: address,
          },
        },
      });

      if (error) {
        throw error;
      }

      // Confirm payment
      const { error: confirmError } = await stripe.confirmCardPayment(
        clientSecret || "",
        {
          payment_method: paymentMethod.id,
        }
      );

      if (confirmError) {
        throw confirmError;
      }

      // Create order in database
      await createOrder({
        items,
        total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        customerName: name,
        customerEmail: email,
        shippingAddress: address,
        storeId: "",
      });

      // Clear cart
      clearCart();

      // Redirect to success page
      router.push("/orders?success=true");
    } catch (error: any) {
      toast.error(error.message || "Could not complete payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block mb-2 font-medium">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>

      <div>
        <label htmlFor="email" className="block mb-2 font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>

      <div>
        <label htmlFor="address" className="block mb-2 font-medium">
          Shipping Address
        </label>
        <textarea
          id="address"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
          rows={3}
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">Payment Details</label>
        <div className="border rounded-md p-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={!stripe || loading}>
        {loading ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  );
}
