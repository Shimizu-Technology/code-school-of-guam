// components/CheckoutForm.tsx
"use client"

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import {
  StripeCardElement,
  PaymentMethodResult,
  StripePaymentElementOptions,
  PaymentIntentResult
} from "@stripe/stripe-js"
import { useState, FormEvent, useEffect } from "react"
import { useRouter } from "next/navigation"

interface CheckoutFormProps {
  amount: number
  paymentType: string
  onSuccess: () => void
}

export default function CheckoutForm({
  amount,
  paymentType,
  onSuccess,
}: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)
  const [processingTo3DS, setProcessingTo3DS] = useState(false)

  // Create PaymentIntent when component mounts or amount changes
  useEffect(() => {
    if (amount <= 0) return;

    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/create-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount,
            paymentType,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create payment intent");
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId);
      } catch (err) {
        setError("Failed to initialize payment. Please try again.");
        console.error("Error creating payment intent:", err);
      }
    };

    createPaymentIntent();
  }, [amount, paymentType]);

  const handleRedirectCompletion = async (secret: string, intentId: string) => {
    if (!stripe) return;

    setLoading(true);
    const { error, paymentIntent } = await stripe.retrievePaymentIntent(secret);

    if (error) {
      setError(error.message || "Payment failed. Please try again.");
    } else if (paymentIntent.status === "succeeded") {
      // Payment successful
      router.push("/payment-success");
    } else if (paymentIntent.status === "requires_payment_method") {
      setError("Your payment was not successful, please try again.");
    }
    setLoading(false);
  };

  // Check URL for payment_intent_client_secret on mount (for 3DS redirect)
  useEffect(() => {
    if (!stripe) return;

    // Check if we returned from a redirect
    const query = new URLSearchParams(window.location.search);
    const clientSecret = query.get("payment_intent_client_secret");
    const paymentIntentId = query.get("payment_intent");

    if (clientSecret && paymentIntentId) {
      // Handle the redirect completion
      handleRedirectCompletion(clientSecret, paymentIntentId);
    }
  }, [stripe, handleRedirectCompletion]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements || !clientSecret) {
      setError("Payment system is not ready. Please try again.");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card details are missing. Please try again.");
      setLoading(false);
      return;
    }

    // Confirm the payment with the card element
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: 'Code School Student', // Ideally collect this from the user
        },
      },
      return_url: `${window.location.origin}/payment-success`,
    });

    if (error) {
      // Show error to customer
      if (error.type === "card_error" || error.type === "validation_error") {
        setError(error.message || "An error occurred with your card.");
      } else {
        setError("An unexpected error occurred.");
      }
      setLoading(false);
    } else if (paymentIntent) {
      // Handle next steps based on PaymentIntent status
      if (paymentIntent.status === "succeeded") {
        // Payment succeeded
        router.push("/payment-success");
      } else if (paymentIntent.status === "requires_action") {
        // 3D Secure is required
        setProcessingTo3DS(true);
        // The payment requires additional actions, Stripe.js will handle the redirect
      } else {
        // Other statuses: requires_payment_method, processing, etc.
        setError(`Payment status: ${paymentIntent.status}. Please try again.`);
        setLoading(false);
      }
    }
  };

  if (processingTo3DS) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ruby-500 mx-auto mb-4"></div>
        <p className="text-white">Redirecting to secure payment page...</p>
        <p className="text-slate-400 text-sm mt-2">Please do not close this window.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Card Element */}
      <div className="bg-slate-800 p-4 rounded-md">
        <CardElement
          options={{
            style: {
              base: {
                color: "#ffffff",
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                  color: "#aab7c4"
                }
              },
              invalid: {
                color: "#fa755a",
                iconColor: "#fa755a"
              }
            }
          }}
        />
      </div>

      {/* Error Message */}
      {error && <div className="text-red-500 text-sm">{error}</div>}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || loading || !clientSecret}
        className="w-full bg-ruby-600 text-white py-2 px-4 rounded-md hover:bg-ruby-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Processing..." : `Pay $${amount}`}
      </button>
      
      <p className="text-slate-400 text-xs text-center mt-4">
        Your payment is secure. We use Stripe for secure payment processing.
      </p>
    </form>
  )
}
