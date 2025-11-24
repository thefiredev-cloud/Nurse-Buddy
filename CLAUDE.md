# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nurse Buddy is an AI-powered NCLEX test preparation platform built with Next.js 14+ App Router. The application generates practice tests and detailed rationales using Claude API, with integrated authentication (Clerk) and subscription payments (Stripe).

## Development Commands

```bash
# Development
npm run dev          # Start development server on localhost:3000

# Production Build
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint (Next.js integrated)
```

**Note**: Testing infrastructure is not yet configured. When adding tests, use Jest or Vitest with unit/integration coverage for API routes and utility functions.

## Architecture Patterns

### Mock Service Pattern

**Critical**: All external services (Supabase, Stripe, Claude API) implement a mock fallback pattern to enable development without API keys. When environment variables are missing, services automatically use mock implementations.

```typescript
// Pattern used throughout lib/ directory
export const service = apiKey
  ? new RealService(apiKey)
  : null;

export const mockService = { /* mock implementation */ };

export const client = service || mockService;
```

This pattern is used in:
- `lib/supabase.ts` - Database client with mock queries
- `lib/stripe.ts` - Payment client with mock checkout
- `lib/ai/claude.ts` - Question and rationale generation with mock responses

### Service Layer Architecture

- `lib/supabase.ts` - Database client with TypeScript type definitions and mock fallback
- `lib/stripe.ts` - Payment configuration and client (test mode by default)
- `lib/ai/claude.ts` - NCLEX question AND rationale generation (all AI from single vendor)
- `lib/database/queries.ts` - Helper functions for database operations with mock data fallback
- `lib/database/schema.ts` - TypeScript type definitions for database tables
- `lib/utils.ts` - Tailwind class merging utilities (cn() function)

### Component Organization

- `components/landing/` - Marketing landing page sections (13 components)
- `components/ui/` - shadcn/ui components (Button, Card, Accordion)
- Future: `components/dashboard/`, `components/test/`, `components/analytics/`

### API Routes

- `app/api/checkout/route.ts` - Create Stripe checkout session
- `app/api/webhooks/clerk/route.ts` - Handle user creation events
- `app/api/webhooks/stripe/route.ts` - Handle subscription events

All webhook handlers include mock mode for development without credentials.

## Database Schema

Defined in `lib/supabase.ts` with TypeScript types:

### Tables

**users**
- `id` (uuid), `email`, `name`
- `stripe_customer_id` (nullable)
- `subscription_status`
- `created_at`

**tests**
- `id` (uuid), `user_id` (fk)
- `questions` (JSONB) - Array of 100 NCLEX questions
- `answers` (JSONB) - User's selected answers
- `score` (nullable until completed)
- `completed_at` (nullable)
- `created_at`

**performance**
- `id` (uuid), `user_id` (fk)
- `category` - One of 4 NCLEX categories
- `correct_answers`, `total_questions`
- `date`

## NCLEX Question Structure

Questions follow a strict structure defined in `lib/ai/claude.ts`:

```typescript
interface NCLEXQuestion {
  id: string;
  category: NCLEXCategory; // 4 categories
  scenario: string;
  question: string;
  choices: { A: string; B: string; C: string; D: string };
  correctAnswer: "A" | "B" | "C" | "D";
  rationale: { A: string; B: string; C: string; D: string };
}
```

### NCLEX Categories
1. Safe and Effective Care Environment (25 questions)
2. Health Promotion and Maintenance (15 questions)
3. Psychosocial Integrity (10 questions)
4. Physiological Integrity (50 questions)

## AI Service Integration

### Claude API (Questions + Rationales)
- Model: `claude-3-5-sonnet-20241022`
- Purpose: Generate NCLEX-style practice questions AND detailed educational rationales
- Functions:
  - `generateQuestionWithClaude(category)` - Generates 100-question tests with scenarios, choices, and correct answers
  - `generateRationaleWithClaude(...)` - Generates detailed feedback when user submits an answer
- Fallback: Mock questions and rationales in `lib/ai/claude.ts`
- Single vendor approach reduces complexity and API costs

## Environment Variables

Required for production (all have mock fallbacks for development):

```bash
# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Database
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=                    # $35/month subscription

# AI Services
ANTHROPIC_API_KEY=     # Claude API for questions and rationales

# App
NEXT_PUBLIC_APP_URL=
```

## TypeScript Configuration

- Path alias: `@/*` maps to repository root
- Strict mode enabled
- Module resolution: bundler (Next.js 14+)

## Important Conventions

### File Size Limit
Keep files under 500 lines. Split large components into smaller, focused modules.

### Styling
- Tailwind CSS utility classes
- Custom nursing brand theme (trust blue, medical green)
- Use `cn()` utility from `lib/utils.ts` for conditional classes

### Authentication
- Clerk handles all auth flows
- Webhook at `/api/webhooks/clerk` syncs users to database
- Mock auth available via `lib/auth-mock.ts` for development

### Payment Flow
1. User signs up → redirected to Stripe checkout
2. Checkout success → webhook activates subscription
3. Subscription status stored in `users.subscription_status`

### Question Generation Flow
1. User starts new test → API route calls `generateNCLEXTest()`
2. Test creates 100 questions with proper category distribution using Claude:
   - Safe and Effective Care Environment: 25 questions
   - Health Promotion and Maintenance: 15 questions
   - Psychosocial Integrity: 10 questions
   - Physiological Integrity: 50 questions
3. Questions are stored in `tests.questions` (JSONB) for persistence
4. Each answer submission → API calls Claude for detailed educational rationales
5. Results saved to `tests.answers` and `performance` table for analytics

## Performance Considerations

### API Route Optimization
- Question generation is computationally expensive; consider caching frequently generated questions
- Rationale generation calls Claude for each answer submission (~1-2 second response time)
- Database queries use JSONB for questions/answers to avoid normalization overhead—beneficial for test performance data
- Single AI vendor (Claude) reduces integration complexity and vendor lock-in

### Frontend Optimization
- Landing page uses Framer Motion animations; monitor Core Web Vitals on slower networks
- Test interface stores progress in sessionStorage to avoid database writes on every question navigation
- Use code splitting for dashboard routes to reduce initial bundle size

### Database Indexing
- Add indexes on `tests.user_id` and `performance.user_id` for faster queries
- Consider partial indexes on `subscription_status` for user filtering
- Test JSONB query performance before enabling complex question filters

## Implementation Status

The platform is **production-ready** with all core features implemented:
- ✅ Landing page (13 sections, SEO-optimized)
- ✅ Authentication (Clerk + mock fallback)
- ✅ Payment flow (Stripe checkout + webhooks)
- ✅ Test interface (100-question NCLEX tests)
- ✅ Database schema (complete with RLS)
- ✅ Deployment configuration (Vercel-ready)

See [PROJECT-SUMMARY.md](PROJECT-SUMMARY.md) for detailed feature completeness matrix.

## Development Notes

- The codebase is designed to work WITHOUT any API keys in development mode
- All external service calls gracefully degrade to mock implementations
- Webhook handlers detect development mode and skip signature verification
- All files kept under 500 lines per convention; split into focused modules when exceeding this limit
