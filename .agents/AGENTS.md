# AGENTS.md - Git for Prompts

Global rules: read C:\Users\kwakh\.agents\AGENTS.md first. This file adds project-specific rules. It can make global limits stricter, never looser. Do not repeat global rules here.

## 1. What this is
- One-line promise: Version control, staging, diffing, and automated testing studio for AI prompts (Launch Ready).
- What is out of scope: Live production external webhooks without SSRF validation; mock databases in integration runs.

## 2. Stack and commands
- Stack: Next.js 16.3.1 (Turbopack + App Router), React 19.2.8, TypeScript 6.0, Tailwind CSS v4 (`@tailwindcss/postcss` 4.3.3) + Monaco Editor, PostgreSQL (`postgres` 3.4.9) + Drizzle ORM (`drizzle-orm` 0.45.2, `drizzle-kit` 0.31.10), Clerk (`@clerk/nextjs` 7.7.9), Upstash Redis (`@upstash/ratelimit`), Vitest 4.1.11, Playwright. Monorepo via pnpm (`@gfp/core` & `gitforprompts` CLI).
- Install: `pnpm install`
- Dev server: `pnpm dev`
- Test: `pnpm test` (or `pnpm test:unit` for fast zero-network unit & security suite)
- Build: `pnpm build`
- Lint / typecheck: `pnpm lint`
- Database / seed: `pnpm db:push`
- Environment variable names: `DATABASE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`. No secrets or values.

## 3. Project rules
- Data contract: Drizzle ORM in `src/db/schema.ts` (prompts, versions, test_cases, runs, bundles).
- Invariants and gotchas:
  - Graphify First: `graphify-out/graph.json` exists with AST nodes. Inspect `GRAPH_REPORT.md` / `graph.json` before raw grepping.
  - Strict SSRF & Auth Guards: All prompt test executions must route through SSRF guards in `src/lib/security/ssrf.ts` (`validateDestinationUrl()`) and auth checks in `src/lib/api-auth.ts`.
  - [2026-08-10] Direct DB mutations bypassed Clerk user context -> Always assert `getAuthUserId()` before querying Drizzle.
  - [2026-08-12] Unchecked external webhook URLs triggered SSRF warnings -> Route all outbound test requests through `validateDestinationUrl()`.
  - [2026-08-13] Monaco editor theme flicker on initial load -> Synchronize theme initialization with `next-themes` mount state.
  - [2026-09-04] Prototype function leakage in variable interpolation -> Enforce `Object.hasOwn()` + `typeof === 'string'`.
  - [2026-09-06] Dummy Redis environment variables in CI -> Upstash rate limiter failed closed on expensive actions. Rely on in-process fallback in CI.
  - Zero DB mocking: Integration tests run directly against local PostgreSQL container on port 5432.
- Strict types: No `any` or loose casts.
- Never commit secrets, passwords or API keys. Keep them in an untracked `.env` or environment variables.
- (Only with a database) Never modify or delete migrations that have already run.
- Security and privacy rules: Outbound prompt executions are firewalled; user data isolated by Clerk user context.

## 4. UI rules (only for projects with a UI)
- Design source of truth: `DESIGN.md` (Spotify-Style Neutral Dark palette, Lucide icons `strokeWidth={1.5}`, Instrument Serif headings `font-semibold` / weight 600, clean double-bezel card borders).
- Monaco Editor Theme Sync: Monaco editor tokens must sync with `globals.css` and `DESIGN.md`.
- Anti-AI Slop: High contrast typography, calibrated Lucide icons (`strokeWidth={1.5}`), clean spacing.
- Handle loading, empty and error states for every async call.

## 5. Surfaces and verification
- Screen or endpoint map: `/#features`, `/#workflow`, `/#about`, `/#faq`, `/about`, `/contact`, `/privacy`, `/dashboard`, `/prompts`, `/api/prompts`.
- Verification skill path: None (use Vitest suite).
- Done check: 150/150 passing unit, integration & security tests (`pnpm test`), `pnpm lint`, and successful build (`pnpm build`).

## 6. Project-specific stops
- The phase checklist (Plan -> Scout -> Build -> Review -> Fix -> Verify -> Close) lives in TASKS.md, not here.
- Never bypass `validateDestinationUrl()` for external prompt test dispatches. Never alter live Clerk production keys without explicit permission.

## 7. Folder map
- `src/db/`: Drizzle ORM schema and migrations (`src/db/schema.ts`).
- `src/lib/actions/`: Server actions for prompt mutations and execution.
- `src/lib/security/`: SSRF validation and firewall (`ssrf.ts`).
- `src/components/`: UI components (including `src/components/website/` landing components).
- `packages/core/`: `@gfp/core` shared logic.
- `packages/cli/`: `gitforprompts` CLI tool.

## 8. Open decisions
- Swap Clerk keys in Vercel Dashboard to production instance (`pk_live_...`) for public launch distribution.

## 9. Do not touch
- Locked migration history and applied schema definitions.
- Local Docker PostgreSQL database port mapping (5432).

## 10. Doc map
- `DESIGN.md`: Visual design specifications and tokens.
- `GRAPH_REPORT.md`: AST knowledge graph report.
- `README.md`: Public repo documentation.
- `JOURNAL.md`: Work log and proofs.
