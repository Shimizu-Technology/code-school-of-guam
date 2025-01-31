"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"

const PaymentSuccess = () => {
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
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Payment Successful!
        </h1>
        <p className="text-lg text-gray-300 mb-4 max-w-xl">
          Thank you for your payment. Your transaction has been processed
          successfully.
        </p>
        <p className="text-gray-400 max-w-xl">
          You can now proceed with your course registration or view your
          dashboard for more information.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          {/* Link to registration or main site */}
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-orange-600 px-6 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Return Home
          </Link>
          {/* Example link to a dashboard or next steps */}
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md bg-gray-700 px-6 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-gray-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Go to Dashboard
          </Link>
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
