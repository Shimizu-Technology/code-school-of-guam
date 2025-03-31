import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-09-30.acacia',
});

// This is your Stripe webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    if (!endpointSecret) {
      throw new Error('Webhook secret is not set');
    }
    
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  console.log(`Webhook received: ${event.type}`);

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      
      // Here you would:
      // 1. Update your database with payment success
      // 2. Send confirmation email to customer
      // 3. Provision access to purchased content/services
      
      break;
      
    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`Payment failed: ${failedPaymentIntent.id}`);
      
      // Here you would:
      // 1. Log the failure
      // 2. Notify the customer
      // 3. Update your database
      
      break;
      
    case 'charge.succeeded':
      const charge = event.data.object as Stripe.Charge;
      console.log(`Charge succeeded: ${charge.id}`);
      break;
      
    case 'customer.created':
      const customer = event.data.object as Stripe.Customer;
      console.log(`Customer created: ${customer.id}`);
      break;
      
    // Add more event types as needed
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ received: true });
}