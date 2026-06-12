import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Only dashboard routes require Clerk session auth.
// - /api/v1/** handles its own auth via API key (Bearer token + SHA-256)
// - Server actions each call auth() directly — no middleware needed
// - Landing page, sign-in, sign-up are public
const isProtected = createRouteMatcher(['/dashboard(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}

