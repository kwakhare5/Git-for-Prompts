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
- **Package Manager:** pnpm 11.20.0 (Monorepo with `@gfp/core` & `@git-for-prompts/cli`)

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

---

## 7. SESSION RESUME
**Last session date:** 2026-09-04
- **Current State:** Completed comprehensive inside-out audit and adversarial testing across CLI and UI. Standardized CLI package identity and all executable references to `gitforprompts` on npm (`gitforprompts@0.1.2` published live). Enhanced CLI `add` command to accept optional positional content. Fixed Node.js Windows libuv async exit assertion crash by draining event loop via `process.exitCode = 1; return;`. Unified website navigation: changed navbar authenticated CTA from "Workspace" to "Open Dashboard", pointed Hero CTA directly to `/dashboard`, turned static replica `+ Save Version` button into an interactive snapshot simulator with toast feedback, and wired sidebar links to internal preview tab switching. Cleared all legacy references. Full verification passed: 154/154 Vitest passing, zero ESLint errors, clean Next.js production build.
- **Immediate next task:** Deploy final commit to Vercel and execute live end-to-end smoke test.
- **Open blockers:** None.


