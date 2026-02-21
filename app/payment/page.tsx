"use client"

import { loadStripe, Stripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import PaymentDashboard from "@/components/payment-dashboard"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { FC } from "react"

const stripePromise: Promise<Stripe | null> = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
)

const PaymentPage: FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-slate-800 py-4 shadow-md">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="text-ruby-500 hover:text-ruby-400 flex items-center transition-colors"
          >
            <ChevronLeft className="mr-2" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-center">
          Payment Dashboard
        </h1>
        <p className="text-lg text-slate-300 text-center mb-8 max-w-2xl mx-auto">
          Manage your tuition payments below—choose your payment option (deposit,
          monthly installment, or full tuition) or enter a custom amount if
          needed.
        </p>

        <Elements stripe={stripePromise}>
          <PaymentDashboard />
        </Elements>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold">Code School of Guam</h3>
              <p className="text-sm text-slate-400">
                Empowering Guam&apos;s tech future
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/#about"
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                About
              </Link>
              <Link
                href="/#curriculum"
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Courses
              </Link>
              <Link
                href="/#contact"
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-700 pt-4 text-center">
            <p className="text-sm text-slate-400">
              &copy; 2025 Code School of Guam. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PaymentPage
