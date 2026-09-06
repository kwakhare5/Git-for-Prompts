import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

// Only dashboard routes require Clerk session protection.
// Server actions and API routes handle their own auth checks independently.
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);
const isAuthRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

const hasClerkKeys = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);

const clerkHandler = hasClerkKeys
  ? clerkMiddleware(async (auth, req) => {
      if (isProtectedRoute(req)) {
        await auth.protect();
      }
    })
  : null;

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  const pathname = req.nextUrl.pathname;
  const acceptHeader = req.headers.get('accept') || '';

  // 1. AcceptMarkdown Content Negotiation (spec: acceptmarkdown.com)
  if (acceptHeader.includes('text/markdown') && pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = '/api/markdown';
    const res = NextResponse.rewrite(url);
    res.headers.set('Vary', 'Accept, Accept-Encoding');
    return res;
  }

  // 2. Public API CORS Support (/api/v1/*)
  if (pathname.startsWith('/api/v1')) {
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    const res = NextResponse.next();
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    return res;
  }

  // 3. Only invoke Clerk for dashboard session protection and auth pages
  if (isProtectedRoute(req) || isAuthRoute(req)) {
    if (clerkHandler) {
      return clerkHandler(req, event);
    }
    if (process.env.NODE_ENV === 'production' && isProtectedRoute(req)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
  }

  // 4. Public marketing routes bypass Clerk dev-browser check, enabling Vercel Edge caching
  const res = NextResponse.next();
  if (pathname === '/') {
    res.headers.set('Vary', 'Accept, Accept-Encoding');
  }
  return res;
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
