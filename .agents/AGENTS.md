# AGENTS.md — Git for Prompts Project Rules

---

## 1. PROJECT IDENTITY
- **Name:** Git for Prompts (GFP)
- **Goal:** Version control, staging, diffing, and automated testing studio for AI prompts.
- **Status:** Launch Ready
- **Repo:** https://github.com/kwakhare5/git-for-prompts

---

## 2. TECH STACK
- **Framework:** Next.js 16.3.1 (Turbopack + App Router) + React 19.2.8 + TypeScript 6.0
- **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss` 4.3.3) + Monaco Editor
- **Database & ORM:** PostgreSQL (`postgres` 3.4.9) + Drizzle ORM (`drizzle-orm` 0.45.2, `drizzle-kit` 0.31.10)
- **Auth:** Clerk (`@clerk/nextjs` 7.7.9)
- **Rate Limiting:** Upstash Redis (`@upstash/ratelimit`, `@upstash/redis`)
- **Testing:** Vitest 4.1.11 (154/154 passing unit & security tests) + Playwright
- **Package Manager:** pnpm 11.20.0 (Monorepo with `@gfp/core` & `gitforprompts` CLI)

---

## 3. DEV COMMANDS
```bash
pnpm dev             # Start Next.js local development server
pnpm build           # Build @gfp/core and Next.js app
pnpm test            # Run Vitest test suite
pnpm test:unit       # Fast zero-network unit & security test suite
pnpm lint            # Run ESLint validation
pnpm run save        # Run checkpoint script
```

---

## 4. LOCAL RULES & DESIGN INVARIANTS
1. **Graphify First:** `graphify-out/graph.json` exists with 828 AST nodes. Always inspect `GRAPH_REPORT.md` / `graph.json` before raw grepping.
2. **Strict SSRF & Auth Guards:** All prompt test execution must route through SSRF guards in `src/lib/security/ssrf.ts` and auth checks in `src/lib/api-auth.ts`.
3. **Monaco Editor Theme Sync:** Monaco editor tokens must sync with `globals.css` and `DESIGN.md`.
4. **Zero AI Slop:** High contrast typography, calibrated Lucide icons (`strokeWidth={1.5}`), clean double-bezel card borders.

---

## 5. KEY PROJECT PATTERNS
- `src/db/schema.ts` — Drizzle ORM database schema (prompts, versions, test_cases, runs, bundles).
- `src/lib/actions/` — Server actions for prompt mutations and execution.
- `src/lib/security/ssrf.ts` — Security firewall guarding arbitrary prompt target URLs.
- `src/components/website/` — High-converting landing page and dashboard showcase components.

---

## 6. MISTAKES TO AVOID
- [2026-08-10] Direct database mutations bypassed Clerk user context → Always assert `getAuthUserId()` before querying Drizzle.
- [2026-08-12] Unchecked external webhook URLs triggered SSRF warnings → Route all outbound test requests through `validateDestinationUrl()`.
- [2026-08-13] Monaco editor theme flicker on initial load → Synchronize theme initialization with `next-themes` mount state.
- [2026-09-04] Prototype function leakage in variable interpolation → Enforce `Object.hasOwn()` + `typeof === 'string'`.
- [2026-09-06] Dummy Redis environment variables in CI → Upstash rate limiter failed closed on expensive actions. Rely on in-process fallback in CI and isolate test suites.

---

## 7. SESSION RESUME
**Last session date:** 2026-09-09
- **Current State:** Completed comprehensive codebase consistency overhaul (P0–P3), typography harmonization, layout standardization, and AI slop purge (`no-ai-slop`, `better-layout`, `better-typography`, `better-writing`, `better-ui`). Configured Instrument Serif headings to `font-semibold` (weight 600) with normal letter-spacing, and integrated a responsive `<AboutSection id="about" />` on the homepage. Updated Navbar navigation order to `Features` (`/#features`) → `Workflow` (`/#workflow`) → `About` (`/#about`) → `FAQ` (`/#faq`) for fluid single-page scrolling. Unified container width across `/about`, `/contact`, and `/privacy` to `max-w-6xl mx-auto px-4 sm:px-6` (matching Navbar margins) and attached modular `<DeveloperFooter />`. Replaced fake testimonial in `EngineShowcase.tsx` with Karan Wakhare creator note, and rewrote `/contact` with real maintainer channels (`kwakhare5@gmail.com` and X `@kwakhare5`). Verified 154/154 passing unit & security tests, 18/18 static pre-rendered routes on Next.js 16 (0 type errors), and updated AST knowledge graph.
- **Immediate next task:** Deploy to Vercel production (`/deploy`), and verify with `npx is-agentic gitforprompts.vercel.app`.
- **Open blockers:** Swap Clerk keys in Vercel Dashboard to production instance (`pk_live_...`) for public launch distribution.




