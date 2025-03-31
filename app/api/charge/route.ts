import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-09-30.acacia',
});

/**
 * This endpoint handles payment confirmation and legacy payment creation
 * It can be used in two ways:
 * 1. Confirm an existing payment intent (with paymentIntentId)
 * 2. Create and confirm a new payment intent in one step (with paymentMethodId)
 */
export async function POST(req: Request) {
  try {
    const { paymentMethodId, paymentIntentId, amount, paymentType } = await req.json();

    // Case 1: Confirm an existing payment intent
    if (paymentIntentId) {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        return NextResponse.json({
          success: true,
          paymentIntent: {
            id: paymentIntent.id,
            status: paymentIntent.status,
            amount: paymentIntent.amount / 100, // Convert from cents
          }
        });
      }
      
      // If payment requires confirmation
      if (paymentIntent.status === 'requires_confirmation') {
        const confirmedIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/payment-success`,
        });
        
        return NextResponse.json({
          success: true,
          requiresAction: confirmedIntent.status === 'requires_action',
          clientSecret: confirmedIntent.client_secret,
          paymentIntent: {
            id: confirmedIntent.id,
            status: confirmedIntent.status,
          }
        });
      }
      
      return NextResponse.json({
        success: false,
        error: `Payment is in ${paymentIntent.status} state and cannot be processed`,
        code: 'invalid_state'
      }, { status: 400 });
    }
    
    // Case 2: Create and confirm a new payment intent (legacy flow)
    if (paymentMethodId) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: true,
        description: `Payment for ${paymentType}`,
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/payment-success`,
        metadata: {
          paymentType,
        },
      });

      // Handle different payment intent statuses
      if (paymentIntent.status === 'succeeded') {
        return NextResponse.json({
          success: true,
          clientSecret: paymentIntent.client_secret
        });
      } else if (paymentIntent.status === 'requires_action') {
        return NextResponse.json({
          success: true,
          requiresAction: true,
          clientSecret: paymentIntent.client_secret
        });
      } else {
        return NextResponse.json({
          success: false,
          error: `Payment is in ${paymentIntent.status} state`,
          code: paymentIntent.status
        }, { status: 400 });
      }
    }

    // Neither paymentMethodId nor paymentIntentId provided
    return NextResponse.json({
      success: false,
      error: 'Missing payment information',
      code: 'missing_payment_info'
    }, { status: 400 });
    
  } catch (error: unknown) {
    // Capture error details from Stripe and handle different cases
    let errorMessage = 'An error occurred while processing the payment.';
    let errorCode = 'payment_error';

    if (error instanceof Stripe.errors.StripeError) {
      // Handle specific error types from Stripe
      switch (error.code) {
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
        case 'processing_error':
          errorMessage = 'There was an error processing your payment. Please try again.';
          errorCode = 'processing_error';
          break;
        default:
          errorMessage = error.message || errorMessage;
          errorCode = error.code || errorCode;
      }
    }

    console.error('Payment error:', error);
    
    // Return the error to the client with detailed information
    return NextResponse.json({
      success: false,
      error: errorMessage,
      code: errorCode
    }, { status: 400 });
  }
}
