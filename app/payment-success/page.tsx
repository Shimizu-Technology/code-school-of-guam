"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

interface PaymentDetails {
  id: string;
  amount: number;
  status: string;
  created: number;
  paymentType?: string;
}

const PaymentSuccess = () => {
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        // Get payment_intent from URL if available
        const paymentIntentId = searchParams.get('payment_intent');
        
        if (paymentIntentId) {
          // Fetch payment details from your API
          const response = await fetch(`/api/charge`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              paymentIntentId,
            }),
          });
          
          const data = await response.json();
          
          if (data.success && data.paymentIntent) {
            setPaymentDetails({
              id: data.paymentIntent.id,
              amount: data.paymentIntent.amount,
              status: data.paymentIntent.status,
              created: Date.now(),
              paymentType: data.paymentIntent.description || 'Course Payment',
            });
          }
        }
      } catch (error) {
        console.error('Error fetching payment details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [searchParams]);

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 py-4 shadow-md">
        <div className="container mx-auto px-4">
          <Link
            href="/payment"
            className="text-orange-500 hover:text-orange-400 flex items-center transition-colors"
          >
            <ChevronLeft className="mr-2" />
            Back to Payment
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 flex-1 text-center flex flex-col items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl w-full">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Payment Successful!
          </h1>
          
          <div className="mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg text-gray-300 mb-4">
              Thank you for your payment. Your transaction has been processed
              successfully.
            </p>
          </div>

          {loading ? (
            <div className="animate-pulse flex flex-col space-y-4">
              <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6 mx-auto"></div>
            </div>
          ) : paymentDetails ? (
            <div className="bg-gray-700 rounded-md p-4 mb-6 text-left">
              <h2 className="text-xl font-semibold mb-4 text-center">Payment Receipt</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment ID:</span>
                  <span className="font-mono">{paymentDetails.id.substring(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="font-semibold">${paymentDetails.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Date:</span>
                  <span>{formatDate(paymentDetails.created)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-500 font-semibold">
                    {paymentDetails.status === 'succeeded' ? 'Paid' : paymentDetails.status}
                  </span>
                </div>
                {paymentDetails.paymentType && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Payment For:</span>
                    <span>{paymentDetails.paymentType}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-yellow-400 mb-6">
              Payment confirmed, but details are not available.
            </p>
          )}

          <p className="text-gray-400 mb-8">
            You can now proceed with your course registration or return to the home page.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Link to home */}
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md bg-orange-600 px-6 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Return Home
            </Link>
            {/* Email receipt button */}
            <button
              onClick={() => alert('Receipt email functionality will be implemented soon!')}
              className="inline-flex items-center justify-center rounded-md bg-gray-700 px-6 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Email Receipt
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            &copy; 2024 Code School of Guam. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default PaymentSuccess
