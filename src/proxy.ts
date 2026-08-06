import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Only dashboard routes require Clerk session auth.
// - /api/v1/** handles its own auth via API key (Bearer token + SHA-256)
// - Server actions each call auth() directly
// - Landing page, sign-in, sign-up are public
const isProtected = createRouteMatcher(['/dashboard(.*)']);

const hasClerkKeys = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);

export default hasClerkKeys
  ? clerkMiddleware(async (auth, req) => {
      if (isProtected(req)) {
        await auth.protect();
      }
    })
  : function middleware() {
      return NextResponse.next();
    };

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
