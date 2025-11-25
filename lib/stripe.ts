import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

// Initialize Stripe
export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
      typescript: true,
    })
  : null;

// Stripe configuration
// Use the actual price ID from Stripe: price_1SUdJg4xNyT5QbNLhFvg11CL ($35/month)
export const stripeConfig = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
  priceId: process.env.STRIPE_PRICE_ID || "price_1SUdJg4xNyT5QbNLhFvg11CL",
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  productId: "prod_TRWMYk3dEpQS2l",
};

// Mock Stripe for development
export const mockStripe = {
  checkout: {
    sessions: {
      create: async (params: any) => ({
        id: "cs_mock_" + Date.now(),
        url: "/checkout/success?session_id=cs_mock_" + Date.now(),
      }),
    },
  },
  customers: {
    create: async (params: any) => ({
      id: "cus_mock_" + Date.now(),
    }),
  },
};

export const stripeClient = stripe || mockStripe;

