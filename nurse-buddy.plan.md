/<!-- a551621c-105f-4eb2-8c47-bca969c551a4 826a4e76-39e1-4a16-aa25-11e16bbe3ff8 -->
# Nurse Buddy Platform Implementation Plan

## Phase 1: Project Foundation & Configuration

Initialize Next.js 14+ project with App Router, configure Tailwind CSS, shadcn/ui components, and Framer Motion. Set up placeholder environment variables for Clerk, Stripe, Supabase, Claude API, and OpenAI (mock implementations initially).

**Key Files:**

- `package.json` - Next.js 14+, Tailwind, shadcn/ui, Framer Motion, Clerk, Stripe
- `tailwind.config.ts` - Custom theme with nursing brand colors
- `.env.local.example` - Document all required environment variables
- `lib/supabase.ts` - Supabase client with mock fallback
- `lib/clerk.ts` - Clerk configuration with mock auth
- `lib/stripe.ts` - Stripe configuration with test mode
- `lib/ai/claude.ts` - Claude API client with mock question generation
- `lib/ai/openai.ts` - OpenAI client with mock rationale generation

## Phase 2: Landing Page Components (Priority)

Build complete marketing landing page with all sections from specification. Focus on modern, professional design with healthcare trust signals. Use placeholder metrics and testimonials.

**Component Structure:**

- `app/page.tsx` - Landing page composition
- `components/landing/navbar.tsx` - Logo, menu, CTAs (Sign In, Start Learning)
- `components/landing/hero.tsx` - Headline, subheadline, primary CTA, hero visual
- `components/landing/social-proof.tsx` - Metrics (92% pass rate, 50K+ questions, 5K+ students), trust badges
- `components/landing/use-cases.tsx` - Pre-NCLEX, Retakers, International nurses
- `components/landing/pain-points.tsx` - Expensive prep, outdated banks, no rationales
- `components/landing/why-us.tsx` - AI generation, comprehensive rationales, NCLEX format
- `components/landing/how-it-works.tsx` - 3-step process with numbers
- `components/landing/benefits.tsx` - 4 key benefits grid
- `components/landing/pricing.tsx` - Single tier $35/month with features list
- `components/landing/testimonials.tsx` - 3 testimonials with ratings
- `components/landing/cta-section.tsx` - Final CTA with guarantee
- `components/landing/faqs.tsx` - Accordion with 4 FAQs
- `components/landing/footer.tsx` - Links, copyright, domain

**Design System:**

- Nursing-appropriate color palette (trust blue, medical green, clean white)
- Professional typography hierarchy
- Smooth Framer Motion animations for sections
- Mobile-responsive breakpoints
- shadcn/ui components (Button, Card, Accordion)

## Phase 3: Authentication Flow (Mock Implementation)

Set up Clerk authentication flow with mock implementation that allows development without API keys. Sign In/Sign Up flows redirect to Stripe checkout, then to dashboard.

**Key Files:**

- `app/sign-in/[[...sign-in]]/page.tsx` - Clerk sign-in page
- `app/sign-up/[[...sign-up]]/page.tsx` - Clerk sign-up page  
- `middleware.ts` - Protect dashboard routes
- `app/api/webhooks/clerk/route.ts` - User creation webhook (mock)
- `lib/auth-mock.ts` - Mock authentication for development

## Phase 4: Payment Integration (Test Mode)

Implement Stripe checkout for $35/month subscription. Create checkout session API route and success/cancel pages. Use Stripe test mode with placeholder webhooks.

**Key Files:**

- `app/api/checkout/route.ts` - Create Stripe checkout session
- `app/checkout/success/page.tsx` - Payment success redirect
- `app/checkout/cancel/page.tsx` - Payment canceled page
- `app/api/webhooks/stripe/route.ts` - Subscription webhooks (mock)
- `lib/stripe-config.ts` - Product/price configuration

## Phase 5: Dashboard Layout & Navigation

Build authenticated dashboard layout with sidebar navigation, user profile menu, and main content area. Include Test History, New Test, Performance, and Settings sections.

**Key Files:**

- `app/dashboard/layout.tsx` - Dashboard shell with sidebar
- `components/dashboard/sidebar.tsx` - Navigation menu
- `components/dashboard/user-menu.tsx` - Profile dropdown
- `app/dashboard/page.tsx` - Dashboard home (overview stats)

## Phase 6: Test Interface (Core Feature)

Build 100-question test interface with question display, 4 answer choices, progress tracking, flag for review, and answer feedback with rationales. Use mock question generation initially.

**Key Files:**

- `app/dashboard/test/new/page.tsx` - Start new test
- `app/dashboard/test/[testId]/page.tsx` - Active test interface
- `components/test/question-card.tsx` - Question display with 4 choices
- `components/test/progress-bar.tsx` - Visual progress (X of 100)
- `components/test/timer.tsx` - Optional 6-hour timer
- `components/test/rationale-panel.tsx` - Detailed feedback (green/red indicators)
- `components/test/navigation-controls.tsx` - Next, Previous, Flag, Submit
- `app/api/test/generate/route.ts` - Generate 100 questions (mock Claude API)
- `app/api/test/submit/route.ts` - Submit answer, get rationale (mock OpenAI)

## Phase 7: Database Schema & Supabase Setup

Define complete database schema for users, tests, questions, answers, and performance tracking. Provide SQL migration files for Supabase setup when ready.

**Schema Files:**

- `supabase/migrations/001_initial_schema.sql` - Complete schema
- `users` table (id, email, name, stripe_customer_id, subscription_status, created_at)
- `tests` table (id, user_id, questions JSONB, answers JSONB, score, completed_at, created_at)
- `performance` table (id, user_id, category, correct_answers, total_questions, date)
- Row Level Security policies
- `lib/database/schema.ts` - TypeScript types
- `lib/database/queries.ts` - Helper functions with mock data fallback

## Phase 8: Performance Analytics Dashboard

Build analytics page showing overall score, category breakdown (4 NCLEX categories), trending charts, and identified weak areas.

**Key Files:**

- `app/dashboard/performance/page.tsx` - Analytics dashboard
- `components/analytics/score-card.tsx` - Overall percentage
- `components/analytics/category-breakdown.tsx` - 4-category performance
- `components/analytics/trend-chart.tsx` - Score over time (recharts/chart.js)
- `components/analytics/weak-areas.tsx` - Identified focus areas

## Phase 9: SEO & Metadata

Configure comprehensive SEO including meta tags, structured data, Open Graph, Twitter cards, and sitemap. Optimize for NCLEX-related keywords.

**Key Files:**

- `app/layout.tsx` - Root metadata configuration
- `app/sitemap.ts` - Dynamic sitemap generation
- `app/robots.ts` - Robots.txt configuration
- `public/favicon.ico` - Nursing-themed favicon

## Phase 10: Polish & Production Prep

Final touches including error pages, loading states, accessibility audit, mobile responsiveness verification, and deployment configuration (Vercel recommended).

**Key Files:**

- `app/error.tsx` - Global error boundary
- `app/not-found.tsx` - 404 page
- `app/loading.tsx` - Loading states
- `components/ui/skeleton.tsx` - Loading skeletons
- `README.md` - Setup instructions and API key configuration guide
- `DEPLOYMENT.md` - Production deployment checklist

## Technical Decisions

- **Styling**: Tailwind utility classes with custom nursing brand theme
- **Components**: shadcn/ui for buttons, cards, dialogs, accordions
- **Animations**: Framer Motion for scroll animations and page transitions
- **File Size**: No file over 500 lines; split large components
- **Architecture**: OOP patterns with managers/coordinators for business logic
- **Mock Services**: All external APIs have fallback mock implementations for development

## Success Criteria

- Landing page fully functional with all 13 sections
- Mock authentication allows development workflow
- Test interface generates 100 questions (mock data)
- Dashboard shows placeholder analytics
- Mobile responsive across all pages
- Zero TypeScript/linting errors
- Clean separation of UI and business logic

### To-dos

- [ ] Initialize Next.js 14+ project with TypeScript, configure Tailwind CSS, install shadcn/ui, Framer Motion, and all dependencies
- [ ] Set up environment configuration files and mock service implementations (Clerk, Stripe, Supabase, Claude, OpenAI)
- [ ] Build all 13 landing page components (navbar, hero, social-proof, use-cases, pain-points, why-us, how-it-works, benefits, pricing, testimonials, cta-section, faqs, footer) with placeholder data
- [ ] Implement authentication flow with Clerk integration and mock fallback for development
- [ ] Create Stripe checkout flow ($35/month subscription) with test mode configuration
- [ ] Build dashboard layout with sidebar navigation, user menu, and protected routes
- [ ] Build complete test interface (question display, 4 choices, progress bar, timer, rationale panel, navigation controls) with mock question generation
- [ ] Define Supabase database schema (users, tests, performance tables) with migration files and TypeScript types
- [ ] Build performance analytics dashboard with score cards, category breakdown, trend charts, and weak areas identification
- [ ] Configure SEO metadata, structured data, create error/loading pages, verify mobile responsiveness, and prepare deployment docs