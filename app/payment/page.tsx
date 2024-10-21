'use client'

import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentDashboard from '@/components/payment-dashboard';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { FC } from 'react';

const stripePromise: Promise<Stripe | null> = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

const PaymentPage: FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 py-4 shadow-md">
        <div className="container mx-auto px-4">
          <Link href="/" className="text-orange-500 hover:text-orange-400 flex items-center">
            <ChevronLeft className="mr-2" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Payment Dashboard</h1>
        <p className="text-lg text-gray-300 text-center mb-8 max-w-2xl mx-auto">
          Welcome to your payment dashboard. Here you can manage your tuition payments, 
          including deposits, monthly installments, and full tuition payments.
        </p>
        <Elements stripe={stripePromise}>
          <PaymentDashboard />
        </Elements>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold">Code School of Guam</h3>
              <p className="text-sm text-gray-400">Empowering Guam&apos;s tech future</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/#about" className="text-sm text-gray-400 hover:text-white">About</Link>
              <Link href="/#curriculum" className="text-sm text-gray-400 hover:text-white">Courses</Link>
              <Link href="/#contact" className="text-sm text-gray-400 hover:text-white">Contact</Link>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-4 text-center">
            <p className="text-sm text-gray-400">&copy; 2024 Code School of Guam. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PaymentPage;
