import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Routes that require a logged-in user.
// Everything else (landing page, sign-in, sign-up, public API) is open.
const isProtected = createRouteMatcher([
  '/dashboard(.*)',
  // Protect all /api routes EXCEPT the public v1 API (authenticated via API key)
  '/api/(?!v1)(.*)',
])

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

