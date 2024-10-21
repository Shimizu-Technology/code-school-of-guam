'use client';

import React, { useState } from 'react';
import CheckoutForm from './CheckoutForm';

const PaymentDashboard: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState<number | null>(null);
  const [description, setDescription] = useState<string>('Payment for Other'); // Default description
  const [showForm, setShowForm] = useState(false);

  const paymentOptions = [
    { type: 'Deposit', amount: 1000 },
    { type: 'Monthly Installment', amount: 2500 },
    { type: 'Full Tuition', amount: 10000 },
    { type: 'Other', amount: null }, // Added "Other" option
  ];

  const handlePaymentSelect = (type: string) => {
    setSelectedPayment(type);
    setShowForm(true);
    if (type !== 'Other') {
      setCustomAmount(null); // Reset custom amount if "Other" is not selected
      setDescription(`Payment for ${type}`); // Default description for non-Other options
    } else {
      setDescription('Payment for Other'); // Reset description for "Other"
    }
  };

  const handleCustomAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(Number(event.target.value));
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value || 'Payment for Other'); // Use 'Payment for Other' as fallback
  };

  const handlePaymentSuccess = () => {
    alert('Payment successful!');
    setShowForm(false);
    setSelectedPayment(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Select Payment Option</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {paymentOptions.map((option) => (
          <button
            key={option.type}
            onClick={() => handlePaymentSelect(option.type)}
            className={`p-4 rounded-md transition-colors ${
              selectedPayment === option.type
                ? 'bg-orange-600 text-white'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            <h3 className="font-semibold">{option.type}</h3>
            {option.amount !== null && <p className="text-lg">${option.amount}</p>}
          </button>
        ))}
      </div>

      {selectedPayment === 'Other' && (
        <div className="mb-8 text-center"> {/* Centering the custom amount input */}
          <label htmlFor="custom-amount" className="block text-lg font-semibold mb-2">
            Enter custom amount:
          </label>
          <input
            type="number"
            id="custom-amount"
            value={customAmount || ''}
            onChange={handleCustomAmountChange}
            className="p-2 w-full bg-gray-800 text-white rounded-md"
            placeholder="Enter amount in USD"
          />
          <label htmlFor="description" className="block text-lg font-semibold mt-4">
            Enter description (optional):
          </label>
          <input
            type="text"
            id="description"
            value={description === 'Payment for Other' ? '' : description} // Show empty when default description
            onChange={handleDescriptionChange}
            className="p-2 w-full bg-gray-800 text-white rounded-md"
            placeholder="Enter description (e.g., partial payment)"
          />
        </div>
      )}

      {showForm && selectedPayment && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Make Payment: {selectedPayment}</h3>
          <CheckoutForm
            amount={
              selectedPayment === 'Other'
                ? customAmount || 0 // Use custom amount if "Other" is selected
                : paymentOptions.find((option) => option.type === selectedPayment)?.amount || 0
            }
            paymentType={description} // Pass the description to the CheckoutForm
            onSuccess={handlePaymentSuccess}
          />
        </div>
      )}
    </div>
  );
};

export default PaymentDashboard;
