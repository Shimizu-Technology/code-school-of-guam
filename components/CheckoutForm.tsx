// components/CheckoutForm.tsx
"use client"

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { StripeCardElement, PaymentMethodResult } from "@stripe/stripe-js"
import { useState, FormEvent } from "react"

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    if (!stripe || !elements) {
      setError("Stripe.js has not loaded yet. Please wait and try again.")
      setLoading(false)
      return
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setError("Card details are missing. Please try again.")
      setLoading(false)
      return
    }

    // Create Payment Method
    const {
      error: stripeError,
      paymentMethod,
    }: PaymentMethodResult = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement as StripeCardElement,
    })

    if (stripeError) {
      setError(stripeError.message || "An error occurred during card validation.")
      setLoading(false)
      return
    }

    // Call backend to create a PaymentIntent
    const response = await fetch("/api/charge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentMethodId: paymentMethod?.id,
        amount,
        paymentType,
      }),
    })
    const paymentResponse = await response.json()

    if (paymentResponse.success) {
      onSuccess()
    } else {
      switch (paymentResponse.code) {
        case "card_declined":
          setError("Your card was declined. Please try another card.")
          break
        case "insufficient_funds":
          setError("Insufficient funds. Please check your balance or try a different card.")
          break
        case "incorrect_cvc":
          setError("The CVC number you entered is incorrect.")
          break
        case "expired_card":
          setError("Your card has expired. Please use a different card.")
          break
        case "processing_error":
          setError("There was an issue processing your payment. Please try again.")
          break
        default:
          setError("Payment failed. Please try again.")
      }
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Card Element */}
      <div className="bg-gray-800 p-4 rounded-md">
        <CardElement
          options={{ style: { base: { color: "#ffffff" } } }}
        />
      </div>

      {/* Error Message */}
      {error && <div className="text-red-500 text-sm">{error}</div>}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Processing..." : `Pay $${amount}`}
      </button>
    </form>
  )
}
