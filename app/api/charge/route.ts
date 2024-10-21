import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-09-30.acacia',
});

export async function POST(req: Request) {
  const { paymentMethodId, amount, paymentType } = await req.json();

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      description: `Payment for ${paymentType}`,
      return_url: 'https://codeschoolofguam.com/payment-success', // Replace with your success page URL
    });

    return NextResponse.json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    // Capture error details from Stripe and handle different cases
    let errorMessage = 'An error occurred while processing the payment.';
    let errorCode = 'payment_error';

    if (error.raw) {
      // Handle specific error types from Stripe
      switch (error.raw.code) {
        case 'card_declined':
          errorMessage = 'Your card was declined. Please try another card.';
          errorCode = 'card_declined';
          break;
        case 'insufficient_funds':
          errorMessage = 'Insufficient funds. Please check your balance or use a different card.';
          errorCode = 'insufficient_funds';
          break;
        case 'incorrect_cvc':
          errorMessage = 'The CVC number you entered is incorrect.';
          errorCode = 'incorrect_cvc';
          break;
        case 'expired_card':
          errorMessage = 'Your card has expired. Please try another card.';
          errorCode = 'expired_card';
          break;
        default:
          errorMessage = error.raw.message || errorMessage;
      }
    }

    // Return the error to the client with detailed information
    return NextResponse.json({ success: false, error: errorMessage, code: errorCode }, { status: 400 });
  }
}
