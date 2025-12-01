# Clerk Webhook Setup Guide

Complete guide for configuring Clerk webhooks in NurseBuddy application.

---

## What is a Clerk Webhook Secret?

The **Clerk Webhook Secret** (`CLERK_WEBHOOK_SECRET`) is a signing secret used to verify that incoming webhook requests are authentic and come from Clerk. It ensures security by preventing unauthorized requests from reaching your application.

**Format**: `whsec_XXXXXXXXXXXXXXXX` (starts with `whsec_`)

---

## Step 1: Create Webhook Endpoint in Clerk Dashboard

1. **Log in to Clerk Dashboard**
   - Navigate to [https://dashboard.clerk.com](https://dashboard.clerk.com)
   - Select your application

2. **Navigate to Webhooks**
   - In the left sidebar, click **Webhooks**
   - Click **+ Add Endpoint**

3. **Configure Endpoint**
   - **Endpoint URL**:
     - **Development**: `http://localhost:3000/api/webhooks/clerk`
     - **Production**: `https://yourdomain.com/api/webhooks/clerk`
   - **Description**: `NurseBuddy user sync webhook` (optional)
   - **Events to send**: Click **Select events** and choose:
     - ✅ `user.created` (required - syncs new users to database)
     - Optional: `user.updated`, `user.deleted` (if you want to handle updates/deletions)

4. **Create Endpoint**
   - Click **Create** to finalize the endpoint

---

## Step 2: Retrieve Webhook Signing Secret

1. **Access Endpoint Settings**
   - After creating the endpoint, click on it in the webhooks list
   - You'll see the endpoint details page

2. **Reveal Signing Secret**
   - Locate the **Signing Secret** section
   - Click the **eye icon** (👁️) or **"Click to reveal"** button
   - Copy the signing secret (format: `whsec_...`)
   - **⚠️ Security**: This secret is shown only once - save it immediately

3. **Example Secret Format**
   ```
   whsec_1ABC123xyz456DEF789ghi012JKL345mno678PQR901stu234VWX567
   ```

---

## Step 3: Configure Environment Variable

1. **Add to `.env.local`** (development)
   ```bash
   CLERK_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXX
   ```

2. **Add to Production Environment**
   - **Vercel**: Project Settings → Environment Variables → Add `CLERK_WEBHOOK_SECRET`
   - **Netlify**: Site Settings → Environment Variables → Add `CLERK_WEBHOOK_SECRET`
   - **Other platforms**: Add to your hosting platform's environment variable configuration

3. **Restart Development Server**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

---

## Step 4: Verify Webhook Implementation

The webhook handler is located at `app/api/webhooks/clerk/route.ts` and handles:

### Event: `user.created`
- **Trigger**: When a new user signs up via Clerk
- **Action**: Creates user record in Supabase database
- **Data synced**:
  - User ID (Clerk ID)
  - Email address
  - Name (first + last name)
  - Subscription status (defaults to `inactive`)

### Webhook Security
- ✅ Signature verification using `verifyWebhook()` from `@clerk/nextjs/server`
- ✅ Validates `svix-id`, `svix-timestamp`, and `svix-signature` headers
- ✅ Falls back to mock mode in development if secret not configured

---

## Step 5: Test Webhook

### Option 1: Test via Clerk Dashboard (Recommended)

1. **Send Test Event**
   - In Clerk Dashboard → Webhooks → Your endpoint
   - Click **"Send test event"** or **"Test"** button
   - Select event type: `user.created`
   - Click **Send**
å
2. **Verify in Application**
   - Check your application logs for: `"User created successfully"`
   - Verify user appears in Supabase `users` table

### Option 2: Test via Local Development

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Create Test User**
   - Navigate to sign-up page
   - Create a new account
   - Webhook should trigger automatically

3. **Check Logs**
   - Look for webhook logs in terminal
   - Verify user creation in database

### Option 3: Use ngrok for Local Testing (Advanced)

For testing production-like webhooks locally:

1. **Install ngrok**
   ```bash
   npm install -g ngrok
   # or
   brew install ngrok
   ```

2. **Start ngrok tunnel**
   ```bash
   ngrok http 3000
   ```

3. **Update Clerk Webhook URL**
   - Copy ngrok URL (e.g., `https://abc123.ngrok.io`)
   - Update Clerk webhook endpoint to: `https://abc123.ngrok.io/api/webhooks/clerk`

4. **Test webhook** - Clerk will send events to your local server

---

## Step 6: Production Deployment Checklist

Before deploying to production:

- [ ] Webhook endpoint created in Clerk Dashboard
- [ ] Webhook signing secret copied and stored securely
- [ ] `CLERK_WEBHOOK_SECRET` added to production environment variables
- [ ] Production webhook URL updated in Clerk Dashboard
- [ ] Test event sent and verified
- [ ] User creation verified in production database

---

## Troubleshooting

### Webhook Not Receiving Events

**Symptoms**: No logs, users not created in database

**Solutions**:
1. Verify webhook endpoint URL is correct in Clerk Dashboard
2. Check `CLERK_WEBHOOK_SECRET` is set in environment variables
3. Restart development server after adding environment variable
4. Check Clerk Dashboard → Webhooks → Events for delivery status
5. Verify endpoint is enabled (not disabled)

### "Missing webhook headers" Error

**Cause**: Request not coming from Clerk (or missing headers)

**Solutions**:
1. Verify webhook URL is correct
2. Check if request is being intercepted by middleware
3. Ensure webhook route is publicly accessible (no auth required)

### "Invalid signature" Error

**Cause**: Webhook secret mismatch

**Solutions**:
1. Verify `CLERK_WEBHOOK_SECRET` matches the secret in Clerk Dashboard
2. Ensure no extra spaces or newlines in environment variable
3. Copy secret again from Clerk Dashboard (click "Reveal" again)
4. Restart server after updating environment variable

### "Webhook secret not configured" Error

**Cause**: `CLERK_WEBHOOK_SECRET` environment variable missing

**Solutions**:
1. Add `CLERK_WEBHOOK_SECRET` to `.env.local` (development)
2. Add to production environment variables
3. Restart server after adding

### Users Not Created in Database

**Symptoms**: Webhook receives events but users don't appear in Supabase

**Solutions**:
1. Check Supabase connection (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
2. Verify `SUPABASE_SERVICE_ROLE_KEY` is set (required for server-side user creation)
3. Check application logs for database errors
4. Verify Supabase RLS policies allow inserts (or use service role key)

---

## Environment Variables Summary

Required for Clerk webhooks:

```bash
# Clerk Authentication (already configured)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk Webhook (NEW - required for production)
CLERK_WEBHOOK_SECRET=whsec_...

# Database (required for user creation)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Required for server-side operations
```

---

## Application Integration Points

The webhook handler (`app/api/webhooks/clerk/route.ts`) integrates with:

1. **Database**: `lib/database/queries.ts` → `createUser()`
2. **Supabase Client**: `lib/supabase.ts` → Uses admin client for RLS bypass
3. **Clerk SDK**: `@clerk/nextjs/server` → `verifyWebhook()` for signature verification

---

## Security Best Practices

1. ✅ **Never commit** `CLERK_WEBHOOK_SECRET` to version control
2. ✅ **Use different secrets** for development and production
3. ✅ **Rotate secrets** if compromised (create new endpoint, update env var)
4. ✅ **Verify signatures** in production (already implemented)
5. ✅ **Monitor webhook events** in Clerk Dashboard for suspicious activity

---

## Additional Resources

- [Clerk Webhooks Documentation](https://clerk.com/docs/integrations/webhooks/overview)
- [Clerk Webhook Events Reference](https://clerk.com/docs/integrations/webhooks/overview#events)
- [Svix Webhook Security](https://docs.svix.com/receiving/verifying-payloads/how)

---

## Quick Reference

**Webhook Endpoint**: `/api/webhooks/clerk`  
**Environment Variable**: `CLERK_WEBHOOK_SECRET`  
**Secret Format**: `whsec_...`  
**Required Events**: `user.created`  
**Verification**: Automatic via `verifyWebhook()` from `@clerk/nextjs/server`




