"use client"

import React, { useState } from "react"
import CheckoutForm from "./CheckoutForm"
import {
  CUSTOM_PAYMENT_LIMITS,
  PAYMENT_OPTIONS,
  PaymentOption,
} from "@/lib/payment-options"

const PaymentDashboard: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentOption | null>(null)
  const [customAmount, setCustomAmount] = useState<number | null>(null)
  const [description, setDescription] = useState<string>("")
  const [showForm, setShowForm] = useState(false)

  const paymentOptions = [
    { key: "deposit" as const, type: PAYMENT_OPTIONS.deposit.label, amount: PAYMENT_OPTIONS.deposit.amount },
    { key: "monthlyInstallment" as const, type: PAYMENT_OPTIONS.monthlyInstallment.label, amount: PAYMENT_OPTIONS.monthlyInstallment.amount },
    { key: "fullTuition" as const, type: PAYMENT_OPTIONS.fullTuition.label, amount: PAYMENT_OPTIONS.fullTuition.amount },
    { key: "other" as const, type: "Other", amount: null },
  ]

  const handlePaymentSelect = (option: PaymentOption) => {
    setSelectedPayment(option)
    setShowForm(true)

    if (option !== "other") {
      setCustomAmount(null)
      setDescription("")
    } else {
      setDescription("")
    }
  }

  const handleCustomAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(event.target.value)
    setCustomAmount(Number.isFinite(value) ? value : null)
  }

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value)
  }

  const handlePaymentSuccess = () => {
    // You could redirect to /payment-success or show a toast instead of alert
    alert("Payment successful!")
    setShowForm(false)
    setSelectedPayment(null)
  }

  return (
    <div className="max-w-2xl mx-auto text-white">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
        Select a Payment Option
      </h2>
      <p className="text-slate-300 text-center mb-6">
        For enrolled students only. Choose an approved option below or use
        &quot;Other&quot; for an agreed custom payment.
      </p>

      {/* Payment Option Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {paymentOptions.map((option) => {
          const isSelected = selectedPayment === option.key
          return (
            <button
              key={option.key}
              onClick={() => handlePaymentSelect(option.key)}
              className={`p-4 rounded-md transition-colors ${
                isSelected
                  ? "bg-ruby-600 text-white"
                  : "bg-slate-800 hover:bg-slate-700"
              }`}
            >
              <h3 className="font-semibold mb-1">{option.type}</h3>
              {option.amount !== null && (
                <p className="text-lg">${option.amount}</p>
              )}
            </button>
          )
        })}
      </div>

      {/* Custom Amount & Description Fields */}
      {selectedPayment === "other" && (
        <div className="mb-8 text-center">
          <label
            htmlFor="custom-amount"
            className="block text-lg font-semibold mb-2"
          >
            Enter custom amount:
          </label>
          <input
            type="number"
            id="custom-amount"
            min={CUSTOM_PAYMENT_LIMITS.min}
            max={CUSTOM_PAYMENT_LIMITS.max}
            step={1}
            value={customAmount || ""}
            onChange={handleCustomAmountChange}
            className="p-2 w-full md:max-w-sm bg-slate-800 text-white rounded-md"
            placeholder={`Enter $${CUSTOM_PAYMENT_LIMITS.min}-$${CUSTOM_PAYMENT_LIMITS.max}`}
          />

          <label
            htmlFor="description"
            className="block text-lg font-semibold mt-4"
          >
            Enter description (optional):
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            className="p-2 w-full md:max-w-sm bg-slate-800 text-white rounded-md"
            placeholder="e.g., partial payment"
          />
        </div>
      )}

      {/* Checkout Form */}
      {showForm && selectedPayment && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-center">
            Make Payment: {paymentOptions.find((opt) => opt.key === selectedPayment)?.type}
          </h3>
          <CheckoutForm
            displayAmount={
              selectedPayment === "other"
                ? customAmount || 0
                : paymentOptions.find((opt) => opt.key === selectedPayment)
                    ?.amount || 0
            }
            paymentOption={selectedPayment}
            customAmount={customAmount || undefined}
            customDescription={description}
            onSuccess={handlePaymentSuccess}
          />
        </div>
      )}
    </div>
  )
}

export default PaymentDashboard
