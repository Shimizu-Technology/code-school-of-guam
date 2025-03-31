# Stripe Implementation Guide

## Overview

This document outlines the remaining steps needed to complete the Stripe payment integration for Code School of Guam. The core implementation has been set up, but several important steps are needed to finalize and test the integration.

## 1. Stripe Dashboard Setup

- [ ] **Create a Stripe Webhook**:
  - Go to the [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
  - Click "Add Endpoint"
  - For production: Enter your site URL + `/api/webhook` (e.g., `https://codeschoolofguam.com/api/webhook`)
  - For development: Use Stripe CLI for local testing (see section 3)
  - Select events to listen for:
    - `payment_intent.succeeded`
    - `payment_intent.payment_failed`
    - `charge.succeeded`
    - `charge.failed`
  - Copy the webhook signing secret

- [ ] **Update Environment Variables**:
  - Add the real webhook secret to `.env.local`:
    ```
    STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret
    ```
  - Ensure `NEXT_PUBLIC_BASE_URL` is set correctly for your environment

## 2. Testing the Integration

- [ ] **Test with Stripe Test Cards**:
  - Use Stripe's [test cards](https://stripe.com/docs/testing#cards) to test different scenarios:
    - `4242 4242 4242 4242` - Successful payment
    - `4000 0000 0000 3220` - 3D Secure authentication required
    - `4000 0000 0000 9995` - Insufficient funds failure
    - `4000 0000 0000 0002` - Card declined failure

- [ ] **Test the Webhook Integration**:
  - Make test payments and verify webhook events are received
  - Check server logs for webhook processing
  - Verify the payment success page displays correct information

## 3. Local Development Setup

- [ ] **Install Stripe CLI for Local Testing**:
  - Download and install the [Stripe CLI](https://stripe.com/docs/stripe-cli)
  - Login with: `stripe login`
  - Forward webhooks to your local server:
    ```
    stripe listen --forward-to localhost:3000/api/webhook
    ```
  - Copy the webhook signing secret provided by the CLI and update your `.env.local`

- [ ] **Test the Complete Payment Flow**:
  - Start your development server: `npm run dev`
  - Navigate to the payment page
  - Complete test payments with different scenarios
  - Verify webhooks are received and processed correctly

## 4. Additional Implementation Tasks

- [ ] **Add Email Confirmation**:
  - Implement email sending functionality in the webhook handler
  - Create an email template for payment receipts
  - Send confirmation emails when payments succeed

- [ ] **Database Integration**:
  - Create a database schema for storing payment records
  - Update the webhook handler to store payment information
  - Link payments to user accounts if applicable

- [ ] **Error Handling Improvements**:
  - Add more comprehensive error logging
  - Implement retry logic for failed webhook processing
  - Create an admin notification system for payment failures

- [ ] **User Dashboard**:
  - Implement a payment history view for users
  - Allow users to update payment methods
  - Display subscription status if applicable

## 5. Going Live

- [ ] **Switch to Live Mode**:
  - Update `.env.local` to use live Stripe keys (uncomment the LIVE section)
  - Update the webhook endpoint in Stripe Dashboard to your production URL
  - Ensure proper SSL is configured on your production site

- [ ] **Final Testing**:
  - Perform end-to-end testing in production with real cards (small amounts)
  - Verify webhooks are working in production
  - Check that emails are being sent correctly

- [ ] **Monitoring and Maintenance**:
  - Set up monitoring for payment failures
  - Create a process for handling disputed charges
  - Implement regular reconciliation with Stripe Dashboard

## 6. Documentation

- [ ] **Internal Documentation**:
  - Document the payment flow for team members
  - Create troubleshooting guides for common issues
  - Document the database schema for payment records

- [ ] **User Documentation**:
  - Update FAQs with payment-related information
  - Create help articles for payment issues
  - Document refund policies and procedures

## Resources

- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe.js and Elements](https://stripe.com/docs/js)
- [Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Testing Stripe Integrations](https://stripe.com/docs/testing)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)