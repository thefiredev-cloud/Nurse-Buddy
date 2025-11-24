# Nurse Buddy

<div align="center">

**NCLEX Test Preparation Platform**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://react.dev/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](LICENSE)

*NCLEX practice tests with detailed rationales*

[Features](#features) • [Quick Start](#quick-start) • [Documentation](#documentation) • [Deployment](#deployment)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Development](#development)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Architecture](#architecture)
- [NCLEX Content](#nclex-content)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)

## Overview

Nurse Buddy is an NCLEX test preparation platform that generates practice tests and provides detailed rationales. Built with Next.js and TypeScript.

### Key Features

- **Question Generation**: Uses Claude API to generate NCLEX-style questions
- **Detailed Rationales**: Explanations for every answer choice
- **Performance Analytics**: Tracks progress across NCLEX categories
- **Mock Development Mode**: Develop and test without API keys
- **Production Ready**: Authentication, payments, and database integration

## Features

### Landing Page
- 13-section marketing site with SEO optimization
- Responsive design with Framer Motion animations
- Social proof, testimonials, and FAQs
- Structured data for search engines

### Authentication & Payments
- Clerk integration with mock fallback for development
- Stripe subscription checkout ($35/month)
- Webhook handling for subscription lifecycle
- Protected routes with middleware

### Test Interface
- 100-question NCLEX-style practice tests
- Generated questions with proper category distribution
- Detailed rationales for all answer choices
- Progress tracking with session persistence
- Question flagging for review
- Optional 6-hour timer

### Analytics Dashboard
- Overall performance metrics and pass likelihood
- Category breakdown (4 NCLEX categories)
- Score trends over time
- Weak areas identification with recommendations
- Test history tracking

### Database & Security
- Supabase PostgreSQL with Row-Level Security
- TypeScript type definitions
- Query helpers
- Secure API routes with validation

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Charts**: Recharts

### Backend & Services
- **Authentication**: Clerk
- **Payments**: Stripe
- **Database**: Supabase (PostgreSQL)
- **Question Generation**: Anthropic Claude
- **Rationale Generation**: OpenAI GPT-4-mini

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint (Next.js config)
- **Type Checking**: TypeScript strict mode
- **Version Control**: Git

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- (Optional) API keys for production services

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd NurseBuddy

# Install dependencies
npm install

# Copy environment template
cp env-template.txt .env.local

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

> **Note**: The application works in development mode without any API keys using mock implementations. See [Configuration](#configuration) for production setup.

## Configuration

### Development Mode

The application includes mock implementations, allowing development without API keys:

- Mock authentication (local development user)
- Mock payments (checkout flow simulation)
- Mock questions (pre-built NCLEX questions)
- Mock rationales (educational feedback)
- Mock database (in-memory fallback)

### Production Setup

For production deployment, configure the following services:

#### 1. Clerk Authentication

```bash
# Sign up at https://clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
```

#### 2. Stripe Payments

```bash
# Create account at https://stripe.com
# Create $35/month subscription product
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
```

#### 3. Supabase Database

```bash
# Create project at https://supabase.com
# Run migration: supabase/migrations/001_initial_schema.sql
NEXT_PUBLIC_SUPABASE_URL=https://....supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

#### 4. Question and Rationale Services

```bash
# Anthropic Claude (question generation)
ANTHROPIC_API_KEY=sk-ant-...

# OpenAI (rationale generation)
OPENAI_API_KEY=sk-...
```

#### 5. Application URL

```bash
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

See `env-template.txt` for complete environment variable reference.

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Development Workflow

1. Start development server: `npm run dev`
2. Make changes: Edit files in `app/`, `components/`, or `lib/`
3. Test locally: Visit `http://localhost:3000`
4. Run linter: `npm run lint` before committing

### Code Conventions

- File size: Keep files under 500 lines
- TypeScript: Strict mode enabled
- Styling: Tailwind CSS utility classes
- Components: Single responsibility principle
- Naming: Descriptive, intention-revealing names

### Mock Service Pattern

All external services implement a mock fallback pattern:

```typescript
export const service = apiKey
  ? new RealService(apiKey)
  : null;

export const mockService = { /* mock implementation */ };

export const client = service || mockService;
```

This pattern enables development without API keys while maintaining production functionality.

## Project Structure

```
nurse-buddy/
├── app/                              # Next.js App Router
│   ├── api/                          # API Routes
│   │   ├── checkout/                 # Stripe checkout session
│   │   ├── test/                     # Test generation & submission
│   │   ├── upload/                   # File upload handling
│   │   ├── user/                     # User management
│   │   └── webhooks/                 # Clerk & Stripe webhooks
│   ├── dashboard/                    # Protected dashboard
│   │   ├── test/                     # Test interface
│   │   ├── performance/              # Analytics dashboard
│   │   ├── history/                  # Test history
│   │   ├── settings/                 # User settings
│   │   └── uploads/                  # Upload management
│   ├── checkout/                     # Payment flow
│   ├── sign-in/                      # Authentication pages
│   ├── sign-up/
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Landing page
│   ├── error.tsx                     # Error boundary
│   ├── not-found.tsx                 # 404 page
│   ├── loading.tsx                   # Loading states
│   ├── sitemap.ts                    # SEO sitemap
│   └── robots.ts                     # Robots.txt
├── components/
│   ├── landing/                      # Landing page sections (13 components)
│   ├── dashboard/                    # Dashboard UI components
│   ├── test/                         # Test interface components
│   ├── analytics/                    # Performance charts
│   ├── upload/                       # File upload components
│   └── ui/                           # shadcn/ui components
├── lib/
│   ├── ai/                           # Question and rationale generation
│   │   ├── claude.ts                 # Question generation
│   │   └── openai.ts                 # Rationale generation
│   ├── database/                     # Database utilities
│   │   ├── schema.ts                 # TypeScript types
│   │   └── queries.ts                # Database queries
│   ├── upload/                       # Upload utilities
│   │   ├── parser.ts                 # File parsing
│   │   ├── storage.ts                # Storage management
│   │   └── types.ts                  # Upload types
│   ├── supabase.ts                   # Supabase client
│   ├── stripe.ts                     # Stripe client
│   ├── auth-mock.ts                  # Mock authentication
│   └── utils.ts                      # Utilities
├── supabase/
│   └── migrations/                   # Database migrations
├── middleware.ts                     # Route protection
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── tailwind.config.ts                # Tailwind config
└── next.config.mjs                   # Next.js config
```

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

3. Configure Environment Variables:
   - Add all variables from `env-template.txt`
   - Set in Vercel dashboard: Project Settings → Environment Variables

4. Post-Deployment:
   - Configure Clerk webhook: `https://yourdomain.com/api/webhooks/clerk`
   - Configure Stripe webhook: `https://yourdomain.com/api/webhooks/stripe`
   - Run database migrations on production Supabase instance

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### Other Platforms

- **Netlify**: Configured with `netlify.toml`
- **Railway**: Standard Node.js deployment
- **Any Node.js Host**: Standard Next.js build process

## Architecture

### Service Layer

- **Database**: `lib/supabase.ts` - PostgreSQL client with TypeScript types
- **Payments**: `lib/stripe.ts` - Stripe integration with test mode
- **Question Generation**: `lib/ai/claude.ts` - Question and rationale generation
- **Uploads**: `lib/upload/` - File parsing and storage management

### Component Organization

- **Landing**: Marketing page sections (13 components)
- **Dashboard**: Protected user interface components
- **Test**: Test-taking interface components
- **Analytics**: Performance visualization components
- **UI**: Reusable shadcn/ui components

### API Routes

- `/api/checkout` - Create Stripe checkout session
- `/api/test/generate` - Generate new practice test
- `/api/test/submit` - Submit answer and get rationale
- `/api/test/complete` - Complete test and calculate score
- `/api/webhooks/clerk` - Handle user creation events
- `/api/webhooks/stripe` - Handle subscription events
- `/api/upload` - Handle file uploads

### Database Schema

**Tables**:
- `users` - User accounts with subscription status
- `tests` - Practice tests with questions and answers (JSONB)
- `performance` - Category-based performance tracking
- `uploads` - File upload management

**Security**: Row-Level Security (RLS) policies ensure users can only access their own data.

## NCLEX Content

### Question Categories

Tests follow proper NCLEX distribution:

- **Safe and Effective Care Environment**: 25 questions (25%)
- **Health Promotion and Maintenance**: 15 questions (15%)
- **Psychosocial Integrity**: 10 questions (10%)
- **Physiological Integrity**: 50 questions (50%)

### Question Format

Each question includes:
- Clinical scenario (2-3 sentences)
- Single question stem
- 4 multiple choice options (A-D)
- Correct answer identification
- Detailed rationales for all choices
- NCLEX cognitive level (Application/Analysis)

### Question Generation

- **Questions**: Generated using Claude 3.5 Sonnet
- **Rationales**: Generated using OpenAI GPT-4-mini
- **Quality**: Validated against NCLEX test specifications
- **Variety**: Unique questions per category

## Contributing

This is a proprietary project. For internal contributions:

1. Create a feature branch from `main`
2. Make your changes following code conventions
3. Run linter: `npm run lint`
4. Test thoroughly in development mode
5. Submit pull request for review

### Code Standards

- TypeScript strict mode
- Files under 500 lines
- Single responsibility principle
- Descriptive naming conventions
- Comprehensive error handling

## Support

For questions or issues:

- **Email**: support@nursebuddy.io
- **Documentation**: See [CLAUDE.md](CLAUDE.md) for development guide
- **Deployment**: See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment guide

## License

Proprietary - All rights reserved

---

<div align="center">

**Built with Next.js 14, React, TypeScript, Tailwind CSS**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://react.dev/)

</div>
