import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import {
  CUSTOM_PAYMENT_LIMITS,
  PAYMENT_OPTIONS,
  isFixedPaymentOption,
  sanitizePaymentDescription,
} from '@/lib/payment-options';

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-09-30.acacia',
});

export async function POST(req: Request) {
  try {
    const { paymentOption, customAmount, customDescription } = await req.json();

    let amount: number;
    let paymentType: string;

    if (isFixedPaymentOption(paymentOption)) {
      const option = PAYMENT_OPTIONS[paymentOption];
      amount = option.amount;
      paymentType = option.description;
    } else if (paymentOption === 'other') {
      amount = Number(customAmount);
      paymentType = sanitizePaymentDescription(customDescription);
    } else {
      return NextResponse.json(
        { error: 'Invalid payment option' },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(amount) ||
      !Number.isInteger(amount) ||
      amount < CUSTOM_PAYMENT_LIMITS.min ||
      amount > CUSTOM_PAYMENT_LIMITS.max
    ) {
      return NextResponse.json(
        {
          error: `Invalid amount. Payments must be between $${CUSTOM_PAYMENT_LIMITS.min} and $${CUSTOM_PAYMENT_LIMITS.max}.`,
        },
        { status: 400 }
      );
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      // Payment method types - can include more types if needed
      payment_method_types: ['card'],
      description: `Payment for ${paymentType}`,
      metadata: {
        paymentType,
        paymentOption,
      },
    });

    // Return the client secret and payment intent ID to the client
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount,
      paymentType,
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    
    // Return a more detailed error message
    return NextResponse.json(
      { 
        error: 'Failed to create payment intent',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
