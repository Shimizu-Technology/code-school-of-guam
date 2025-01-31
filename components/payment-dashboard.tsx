"use client"

import React, { useState } from "react"
import CheckoutForm from "./CheckoutForm"

const PaymentDashboard: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [customAmount, setCustomAmount] = useState<number | null>(null)
  const [description, setDescription] = useState<string>("Payment for Other") // Default description
  const [showForm, setShowForm] = useState(false)

  const paymentOptions = [
    { type: "Deposit", amount: 500 },
    { type: "Monthly Installment", amount: 2500 },
    { type: "Full Tuition", amount: 10000 },
    { type: "Other", amount: null },
  ]

  const handlePaymentSelect = (type: string) => {
    setSelectedPayment(type)
    setShowForm(true)

    if (type !== "Other") {
      setCustomAmount(null) // Reset custom amount if "Other" is not selected
      setDescription(`Payment for ${type}`)
    } else {
      setDescription("Payment for Other") // Reset description for "Other"
    }
  }

  const handleCustomAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomAmount(Number(event.target.value))
  }

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value || "Payment for Other")
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
      <p className="text-gray-300 text-center mb-6">
        Click an option below or choose &quot;Other&quot; for a custom amount.
      </p>

      {/* Payment Option Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {paymentOptions.map((option) => {
          const isSelected = selectedPayment === option.type
          return (
            <button
              key={option.type}
              onClick={() => handlePaymentSelect(option.type)}
              className={`p-4 rounded-md transition-colors ${
                isSelected
                  ? "bg-orange-600 text-white"
                  : "bg-gray-800 hover:bg-gray-700"
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
      {selectedPayment === "Other" && (
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
            value={customAmount || ""}
            onChange={handleCustomAmountChange}
            className="p-2 w-full md:max-w-sm bg-gray-800 text-white rounded-md"
            placeholder="Enter amount in USD"
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
            value={description === "Payment for Other" ? "" : description}
            onChange={handleDescriptionChange}
            className="p-2 w-full md:max-w-sm bg-gray-800 text-white rounded-md"
            placeholder="e.g., partial payment"
          />
        </div>
      )}

      {/* Checkout Form */}
      {showForm && selectedPayment && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-center">
            Make Payment: {selectedPayment}
          </h3>
          <CheckoutForm
            amount={
              selectedPayment === "Other"
                ? customAmount || 0
                : paymentOptions.find((opt) => opt.type === selectedPayment)
                    ?.amount || 0
            }
            paymentType={description}
            onSuccess={handlePaymentSuccess}
          />
        </div>
      )}
    </div>
  )
}

export default PaymentDashboard
