# Code School of Guam Website

This is the official website for the Code School of Guam, built using Next.js, React, and Tailwind CSS.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

## Getting Started

To get the application running locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/code-school-of-guam.git
   cd code-school-of-guam
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add the following environment variables:
   ```bash
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
   NEXT_PUBLIC_EMAILJS_USER_ID=your_emailjs_user_id
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

   Replace the values with your actual **EmailJS** credentials and **Stripe** API keys. To get your Stripe API keys:
   - Log in to the [Stripe Dashboard](https://dashboard.stripe.com).
   - Go to **Developers > API keys** to retrieve your `pk_test_xxx` (publishable key) and `sk_test_xxx` (secret key) for test mode.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Stripe Integration

This project uses **Stripe** to handle payments. The Stripe integration includes preset payment options for deposits, monthly installments, and full tuition, as well as a custom payment amount option for users who need to send a different amount.

### .env.local Configuration for Stripe

In your `.env.local` file, you will need to add your **Stripe** API keys as follows:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

Ensure you are using the **test keys** (`pk_test_xxx` and `sk_test_xxx`) while developing and testing. When you deploy your site for production, you should switch to the **live keys** (`pk_live_xxx` and `sk_live_xxx`).

### Testing with Stripe Test Cards

When running the app in test mode, you can use the following test card details to simulate various payment scenarios:

- **Successful Payment (Visa)**:  
  Card Number: `4242 4242 4242 4242`  
  Expiration Date: Any future date (e.g., 12/34)  
  CVC: Any 3 digits (e.g., 123)

- **Card Declined**:  
  Card Number: `4000 0000 0000 9995`

- **Insufficient Funds**:  
  Card Number: `4000 0000 0000 0341`

- **Incorrect CVC**:  
  Card Number: `4000 0000 0000 0101`

- **Expired Card**:  
  Card Number: `4000 0000 0000 0069`

For more test card numbers and details, refer to Stripe's [Testing documentation](https://stripe.com/docs/testing).

## Building for Production

To create a production build, run:

```bash
npm run build
```

This will create an optimized production build in the `.next` folder.

## Deployment

This project is configured for deployment on Netlify. The `netlify.toml` file in the root directory contains the necessary configuration.

To deploy:

1. Push your changes to your GitHub repository.
2. Netlify will automatically deploy your site when changes are pushed to the main branch.

## Project Structure

- `app/`: Contains the main pages and layout components.
- `components/`: Reusable React components.
- `public/`: Static assets like images and the manifest file.
- `styles/`: Global CSS styles.

## Key Features

- Responsive design
- Stripe integration for payments (Deposits, Monthly Installments, Full Tuition, and Custom Payments)
- Flappy Bird game demo
- Contact form with EmailJS integration
- FAQ accordion

## Contributing

If you'd like to contribute to this project, please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License.
