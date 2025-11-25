import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/checkout(.*)',
  '/admin(.*)',
]);

// Define public routes that don't require auth
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
]);

// Only use Clerk middleware if publishable key is configured
const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default hasClerk
  ? clerkMiddleware(async (auth, req) => {
      // Protect dashboard and checkout routes
      if (isProtectedRoute(req)) {
        const { userId } = await auth();
        
        if (!userId) {
          // Redirect to sign-in if not authenticated
          const signInUrl = new URL('/sign-in', req.url);
          signInUrl.searchParams.set('redirect_url', req.url);
          return NextResponse.redirect(signInUrl);
        }
      }
      
      return NextResponse.next();
    })
  : (req: NextRequest) => {
      // Pass through without Clerk in development (mock mode)
      return NextResponse.next();
    };

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
