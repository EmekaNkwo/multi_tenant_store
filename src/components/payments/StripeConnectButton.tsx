"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { createStripeAccount } from "@/lib/stripe";

export function StripeConnectButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setLoading(true);
      const { url } = await createStripeAccount(userId);

      if (url) {
        window.location.href = url;
      } else {
        toast.error("Could not connect to Stripe. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleConnect}
      disabled={loading}
      className="bg-[#635bff] hover:bg-[#4a42d6]"
    >
      {loading ? "Connecting..." : "Connect with Stripe"}
    </Button>
  );
}
