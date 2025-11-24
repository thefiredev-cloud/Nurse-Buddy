# Nurse Buddy - Deployment Guide

## Pre-Deployment Checklist

### 1. API Keys & Services Configuration

Ensure all services are properly configured:

- [ ] **Clerk**: Production keys, allowed origins configured
- [ ] **Stripe**: Live keys, webhook endpoint configured
- [ ] **Supabase**: Production database, migrations run
- [ ] **OpenAI**: Production API key with sufficient credits
- [ ] **Anthropic**: Production API key with sufficient credits

### 2. Environment Variables

Set all environment variables in your deployment platform (copy from `.env.local.example`):

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/checkout
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/checkout

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=

# Anthropic
ANTHROPIC_API_KEY=

# Application
NEXT_PUBLIC_APP_URL=https://nursebuddy.io
```

### 3. Database Setup

1. Create production Supabase project
2. Run migration:
   ```bash
   psql -h [your-supabase-host] -U postgres -d postgres -f supabase/migrations/001_initial_schema.sql
   ```
3. Verify tables created: `users`, `tests`, `performance`
4. Confirm RLS policies are enabled

### 4. Stripe Configuration

1. **Create Product**:
   - Name: Nurse Buddy Pro
   - Price: $35/month recurring
   - Copy price ID to `STRIPE_PRICE_ID`

2. **Configure Webhook**:
   - Endpoint: `https://nursebuddy.io/api/webhooks/stripe`
   - Events to listen: 
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
   - Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

### 5. Clerk Configuration

1. **Production Instance**:
   - Add production domain: `nursebuddy.io`
   - Configure OAuth (optional)
   - Set redirect URLs

2. **Webhooks**:
   - Endpoint: `https://nursebuddy.io/api/webhooks/clerk`
   - Events: `user.created`

## Deployment Platforms

### Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add all variables from checklist above
   - Redeploy after adding variables

4. **Custom Domain**:
   - Add domain in Project Settings
   - Configure DNS records as instructed

### Netlify

1. **netlify.toml** (already configured in project)

2. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

3. **Environment Variables**:
   - Go to Site Settings → Environment Variables
   - Add all required variables

### Railway

1. **Create New Project**:
   ```bash
   railway link
   ```

2. **Deploy**:
   ```bash
   railway up
   ```

3. **Set Environment Variables**:
   - Use Railway dashboard or CLI
   - Add all required variables

## Post-Deployment Verification

### 1. Landing Page
- [ ] Visit homepage loads correctly
- [ ] All sections render properly
- [ ] Navigation links work
- [ ] Mobile responsive

### 2. Authentication
- [ ] Sign up flow completes
- [ ] Sign in flow works
- [ ] Redirects to checkout after signup
- [ ] Protected routes require authentication

### 3. Payment Flow
- [ ] Checkout session creates successfully
- [ ] Test payment with Stripe test card: `4242 4242 4242 4242`
- [ ] Success page redirects to dashboard
- [ ] Webhook processes subscription

### 4. Dashboard & Tests
- [ ] Dashboard loads with user data
- [ ] Can start new test
- [ ] Questions generate correctly
- [ ] Answers submit and rationales display
- [ ] Progress saves correctly

### 5. Performance
- [ ] Page load times < 3s
- [ ] Lighthouse score > 90
- [ ] No console errors
- [ ] All API routes respond

## Monitoring & Maintenance

### Analytics
- Set up Vercel Analytics or Google Analytics
- Monitor page views, conversions
- Track test completion rates

### Error Tracking
- Integrate Sentry or similar for error monitoring
- Set up alerts for critical errors

### Database
- Monitor Supabase usage and performance
- Set up automated backups
- Review and optimize queries as needed

### API Usage
- Monitor OpenAI and Anthropic API usage
- Set up billing alerts
- Optimize prompts for cost efficiency

## Troubleshooting

### Common Issues

**Problem**: Clerk authentication not working
- **Solution**: Verify production domain in Clerk dashboard
- Check redirect URLs match exactly

**Problem**: Stripe webhook failing
- **Solution**: Verify webhook secret matches
- Check endpoint is publicly accessible
- Review Stripe dashboard for webhook logs

**Problem**: Database connection errors
- **Solution**: Verify Supabase credentials
- Check RLS policies allow user operations
- Ensure service role key has proper permissions

**Problem**: AI generation slow or failing
- **Solution**: Check API key validity
- Verify sufficient credits/quota
- Review rate limits
- Fallback to mock data if needed

## Scaling Considerations

### Performance Optimization
- Enable Next.js caching
- Use CDN for static assets
- Implement database connection pooling
- Consider Redis for session storage

### Cost Management
- Monitor AI API usage (biggest cost)
- Implement request throttling
- Cache frequently requested data
- Consider batch processing for rationales

### Security
- Enable rate limiting on API routes
- Implement request validation
- Set up DDoS protection
- Regular security audits
- Keep dependencies updated

## Backup & Recovery

### Database Backups
- Enable Supabase point-in-time recovery
- Schedule daily automated backups
- Test restore procedures monthly

### Code Backups
- Maintain Git repository
- Tag production releases
- Document deployment procedures

## Support & Maintenance

### Regular Tasks
- Weekly: Review error logs, check API usage
- Monthly: Update dependencies, security patches
- Quarterly: Performance review, cost optimization
- Yearly: Major version updates, feature planning

---

For additional help, refer to:
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)

