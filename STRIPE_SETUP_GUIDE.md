# Stripe Dashboard Setup Guide for NurseBuddy

Complete step-by-step guide for configuring Stripe in the Stripe Dashboard and obtaining all required environment variables for the NurseBuddy application.

## Prerequisites

- Stripe account (create at https://stripe.com if needed)
- Access to Stripe Dashboard
- NurseBuddy application deployed or running locally

---

## Step 1: Get API Keys

### 1.1 Navigate to API Keysåç
1. Log into [Stripe Dashboard](https://dashboard.stripe.com)
2. Click **Developers** in the left sidebar
3. Click **API keys**

### 1.2 Copy Publishable Key
- **Location**: Under "Publishable key" section
- **Format**: `pk_test_...` (test mode) or `pk_live_...` (production)
- **Action**: Click "Reveal test key" or "Reveal live key" and copy
- **Environment Variable**: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### 1.3 Copy Secret Key
- **Location**: Under "Secret key" section
- **Format**: `sk_test_...` (test mode) or `sk_live_...` (production)
- **Action**: Click "Reveal test key" or "Reveal live key" and copy
- **Environment Variable**: `STRIPE_SECRET_KEY`
- **⚠️ Security**: Never commit this key to version control

---

## Step 2: Create Product and Price

### 2.1 Create Product
1. In Stripe Dashboard, click **Products** in the left sidebar
2. Click **+ Add product** button
3. Fill in product details:
   - **Name**: `NurseBuddy Monthly Subscription` (or your preferred name)
   - **Description**: `NCLEX test preparation platform subscription`
   - **Pricing model**: Select **Recurring**
   - **Price**: `$35.00` (or your desired amount)
   - **Billing period**: `Monthly`
   - **Currency**: `USD`
4. Click **Save product**

### 2.2 Get Price ID
1. After creating the product, you'll see the product page
2. Under "Pricing" section, locate the price you just created
3. Click on the price to view details
4. Copy the **Price ID** (format: `price_...`)
   - **Example**: `price_1ABC123xyz456`
   - **Environment Variable**: `STRIPE_PRICE_ID`

**Note**: The application defaults to `price_mock_35_monthly` if not set, but you must use a real Stripe Price ID for production.

---

## Step 3: Configure Webhooks

### 3.1 Create Webhook Endpoint
1. In Stripe Dashboard, click **Developers** → **Webhooks**
2. Click **+ Add endpoint**
3. Configure endpoint:
   - **Endpoint URL**: 
     - **Development**: `http://localhost:3000/api/webhooks/stripe`
     - **Production**: `https://yourdomain.com/api/webhooks/stripe`
   - **Description**: `NurseBuddy subscription webhooks`
   - **Events to send**: Click **Select events** and choose:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
4. Click **Add endpoint**

### 3.2 Get Webhook Signing Secret
1. After creating the endpoint, click on it to view details
2. Under "Signing secret" section, click **Reveal** or **Click to reveal**
3. Copy the signing secret (format: `whsec_...`)
   - **Example**: `whsec_1ABC123xyz456...`
   - **Environment Variable**: `STRIPE_WEBHOOK_SECRET`
   - **⚠️ Security**: Never commit this key to version control

### 3.3 Test Webhook Locally (Development Only)
For local development, use Stripe CLI:
```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
This will provide a webhook signing secret starting with `whsec_` - use this for local development.

---

## Step 4: Environment Variables Summary

Add these to your `.env.local` file (or production environment):

```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...          # From Step 1.2
STRIPE_SECRET_KEY=sk_test_...                          # From Step 1.3
STRIPE_WEBHOOK_SECRET=whsec_...                        # From Step 3.2
STRIPE_PRICE_ID=price_...                              # From Step 2.2

# Required for checkout redirects
NEXT_PUBLIC_APP_URL=http://localhost:3000              # Development
# NEXT_PUBLIC_APP_URL=https://yourdomain.com           # Production
```

---

## Step 5: Verify Configuration

### 5.1 Test Mode vs Live Mode
- **Test Mode**: Use `pk_test_` and `sk_test_` keys for development/testing
- **Live Mode**: Use `pk_live_` and `sk_live_` keys for production
- **Important**: Test mode and live mode have separate:
  - Products/Prices
  - Webhook endpoints
  - Customers
  - Subscriptions

### 5.2 Test Checkout Flow
1. Start your application: `npm run dev`
2. Navigate to checkout page
3. Complete a test checkout using Stripe test card: `4242 4242 4242 4242`
4. Verify webhook receives events in Stripe Dashboard → **Developers** → **Webhooks** → **Events**

### 5.3 Test Cards (Test Mode Only)
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`
- Use any future expiry date and any 3-digit CVC

---

## Step 6: Application Integration Points

The application uses Stripe in these locations:

1. **Checkout Creation**: `app/api/checkout/route.ts`
   - Creates Stripe Checkout Session
   - Uses `STRIPE_PRICE_ID` and `STRIPE_SECRET_KEY`

2. **Webhook Handler**: `app/api/webhooks/stripe/route.ts`
   - Processes subscription events
   - Uses `STRIPE_WEBHOOK_SECRET` for signature verification

3. **Stripe Client**: `lib/stripe.ts`
   - Initializes Stripe SDK
   - Exports `stripeClient` and `stripeConfig`

---

## Troubleshooting

### Webhook Not Receiving Events
- Verify webhook endpoint URL is correct
- Check webhook signing secret matches
- Ensure endpoint is enabled (not disabled)
- For local development, use Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### Checkout Session Creation Fails
- Verify `STRIPE_SECRET_KEY` is correct
- Check `STRIPE_PRICE_ID` exists in your Stripe account
- Ensure price is active (not archived)
- Verify API key has correct permissions

### Environment Variables Not Loading
- Restart development server after adding variables
- Verify `.env.local` file is in project root
- Check variable names match exactly (case-sensitive)
- Ensure no trailing spaces in values

---

## Security Checklist

- [ ] Never commit `.env.local` to version control
- [ ] Use test keys for development
- [ ] Rotate keys if accidentally exposed
- [ ] Use environment-specific keys (test vs live)
- [ ] Enable webhook signature verification in production
- [ ] Store production keys in secure environment variable service (Vercel, Netlify, etc.)

---

## Additional Resources

- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)

---

## Quick Reference: Environment Variables

| Variable | Source | Format | Required |
|----------|--------|--------|----------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Dashboard → Developers → API keys | `pk_test_...` or `pk_live_...` | Yes |
| `STRIPE_SECRET_KEY` | Dashboard → Developers → API keys | `sk_test_...` or `sk_live_...` | Yes |
| `STRIPE_WEBHOOK_SECRET` | Dashboard → Developers → Webhooks | `whsec_...` | Yes |
| `STRIPE_PRICE_ID` | Dashboard → Products → [Your Product] | `price_...` | Yes |
| `NEXT_PUBLIC_APP_URL` | Your application URL | `http://localhost:3000` or `https://yourdomain.com` | Yes |

---

**Last Updated**: Generated for NurseBuddy application
**Application**: NCLEX Test Preparation Platform
**Subscription Model**: $35/month recurring

