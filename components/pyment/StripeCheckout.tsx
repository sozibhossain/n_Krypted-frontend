"use client";

import React, { useEffect, useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface StripeCheckoutProps {
  userId: string;
  bookingId: string;
  amount: number;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ userId, bookingId, amount }) => {
  console.log("StripeCheckout", { userId, bookingId, amount });
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  // Mutation for creating payment intent
  const createPaymentIntent = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/create-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, bookingId, price:amount }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
    },
    onError: (error: Error) => {
      setMessage("Failed to create payment. Please try again.");
      toast.error(error.message);
    },
  });

  // Mutation for confirming payment
  const confirmPayment = useMutation({
    mutationFn: async (paymentIntentId: string) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/confirm-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentIntentId }),
      });

      if (!response.ok) {
        throw new Error("Failed to confirm payment");
      }

      return response.json();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    // Only trigger the mutation if clientSecret is not already set
    if (!clientSecret && createPaymentIntent.status !== "pending") {
      createPaymentIntent.mutate();
    }
  }, [clientSecret, createPaymentIntent.status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    setMessage("");

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message || "Payment failed");
      toast.error(error.message);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage("Payment succeeded!");
      toast.success("Payment succeeded!");
      confirmPayment.mutate(paymentIntent.id);
    } else {
      setMessage(`Payment status: ${paymentIntent?.status}`);
      toast.info(`Payment status: ${paymentIntent?.status}`);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg bg-white shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Complete Your Payment</h2>
      {clientSecret && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <PaymentElement />
          <button
            type="submit"
            disabled={!stripe || loading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>
      )}
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
};

export default StripeCheckout;

