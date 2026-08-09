# CONTEXT.md — Domain Language
# Read at the START of EVERY session.
# AI fills and maintains this via @GRILL. You rarely edit this manually.

---

## Core Entities

| Term | What it means in THIS app | Never call it |
|------|--------------------------|---------------|
| Prompt | A versioned AI instruction template stored in the system | Message, text, input |
| Version | An immutable snapshot of a Prompt — append-only, new row per save, never updated | Edit, revision, update |
| Variable | A `{{name}}` placeholder inside a Prompt's content — interpolated at fetch time | Param, slot, field |
| Webhook | An HMAC-SHA256-signed HTTP POST fired on `version.created` — fire-and-forget | Callback, notification, event |
| API Key | A `gfp_live_*` credential — stored as SHA-256 hash, never in plaintext | Token, secret, password |
| Run | A single execution of a Prompt against an AI model, with recorded input/output | Call, request, generation |
| Test Case | A saved input + expected criteria used to evaluate a prompt version | Eval, benchmark |
| Diff | A Monaco-rendered comparison between two versions of a Prompt | Compare, delta |
| Fork | A copy of a public Prompt into the user's own account as a new private Prompt | Clone, duplicate |

---

## Business Rules (Never Break)

1. Versions are IMMUTABLE — every Prompt save creates a new Version row. Never UPDATE existing versions.
2. Every DB read/write must verify `ownerId = auth().userId()` — no cross-user data access ever
3. API Keys stored as SHA-256 lookup hash (`keyLookupHash`) — never store plaintext, never show full key after creation
4. All AI calls in Server Actions or API routes — never in Client Components
5. `revalidatePath()` after every DB mutation
6. `font-mono` on ALL prompt text and AI output — prompts are code
7. Rate limiting via Upstash Redis applies to all API Key usage and all public API routes
8. Webhooks fire after DB commit — always fire-and-forget (`void`), never `await`
9. All version inserts (create, restore, fork, push) MUST go through `insertNextVersion` — advisory lock is mandatory

---

## Database Schema

```
prompts       → id, ownerId (Clerk userId), name, description,
                currentVersionId→versions, isPublic,
                testSchedule (cron string), lastScheduledTestAt,
                createdAt, updatedAt
                INDEX: prompts_owner_id_idx

versions      → id, promptId→prompts, versionNumber (1,2,3...),
                content (the actual prompt text), commitMessage,
                variables (string[] of extracted {{var}} names),
                createdBy (Clerk userId), createdAt
                CONSTRAINT: unique(promptId, versionNumber)
                RULE: immutable — every save = new row, never edit
                RULE: all inserts via insertNextVersion() — advisory lock mandatory

test_cases    → id, promptId→prompts, name, inputText,
                expectedCriteria, createdAt

test_results  → id, versionId→versions, testCaseId→test_cases,
                passed (bool), actualOutput, runAt
                CONSTRAINT: unique(versionId, testCaseId) — upsert on re-run

api_keys      → id, ownerId, name, keyLookupHash (SHA-256),
                keyPrefix ("gfp_live_"), lastUsedAt, createdAt
                CONSTRAINT: unique(keyLookupHash) — O(1) lookup

webhooks      → id, ownerId, url, secret (HMAC key), events (text[]),
                createdAt
```
_8 migrations applied (0000–0007). Schema source of truth: `src/db/schema.ts`_

---

## Feature Status

| Feature | Status | File |
|---------|--------|------|
| Auth (sign-in/sign-up) | 🟢 Live | `app/(auth)/` — Clerk route group |
| Dashboard | 🟢 Live | `app/(dashboard)/dashboard/page.tsx` |
| Create / edit prompt | 🟢 Live | `lib/actions/prompts.ts` |
| Version diff | 🟢 Live | `components/diff-viewer.tsx` |
| A/B compare | 🟢 Live | `components/compare-runner.tsx` |
| Test runner | 🟢 Live | `lib/actions/tests.ts` + `lib/test-runner.ts` |
| Variable interpolation | 🟢 Live | `lib/variables.ts` |
| API keys | 🟢 Live | `components/api-keys-manager.tsx` |
| Public API GET | 🟢 Live | `app/api/v1/prompts/[id]/latest/route.ts` |
| Push API POST | 🟢 Live | `app/api/v1/prompts/[id]/versions/route.ts` |
| Webhooks | 🟢 Live | `lib/webhooks.ts` + `app/(dashboard)/dashboard/webhooks/` |
| gfp CLI | 🟢 Live | `packages/cli/src/index.ts` |
| Explore page | 🟢 Live | `app/(landing)/explore/` |
| Scheduled regression cron | 🟢 Live | `app/api/cron/regression-tests/route.ts` |
| Keep-alive cron | 🟢 Live | `app/api/cron/keep-alive/route.ts` |
| Collaboration/sharing | ⏸️ Paused | Not started |

---

## Real File Map

```
src/
├── app/
│   ├── (auth)/                          ← sign-in, sign-up (Clerk)
│   ├── (dashboard)/dashboard/
│   │   ├── page.tsx                     ← Prompt grid
│   │   ├── new/page.tsx                 ← Create prompt
│   │   ├── api-keys/page.tsx
│   │   ├── webhooks/page.tsx            ← Webhook management
│   │   └── prompts/[id]/
│   │       ├── page.tsx                 ← Prompt detail
│   │       ├── edit/page.tsx
│   │       ├── diff/page.tsx
│   │       ├── compare/page.tsx
│   │       └── tests/page.tsx
│   ├── (landing)/
│   │   ├── page.tsx                     ← Marketing page
│   │   └── explore/                     ← Public prompt discovery
│   └── api/v1/prompts/[id]/
│       ├── latest/route.ts              ← GET: fetch latest version
│       └── versions/route.ts            ← POST: push new version
├── components/
│   ├── prompt-editor.tsx                ← Monaco editor
│   ├── diff-viewer.tsx                  ← Monaco diff
│   ├── compare-runner.tsx
│   ├── test-runner.tsx
│   ├── version-history.tsx
│   └── api-keys-manager.tsx
└── lib/
    ├── actions/
    │   ├── prompts.ts                   ← CRUD + fork
    │   ├── versions.ts                  ← create, restore (exportsinserNextVersion)
    │   ├── tests.ts                     ← test runner actions
    │   └── webhooks.ts                  ← webhook CRUD actions
    ├── api-auth.ts                      ← Shared API key auth module
    ├── test-runner.ts                   ← Deep TestRunner module
    ├── webhooks.ts                      ← HMAC-SHA256 delivery
    ├── variables.ts                     ← {{var}} extraction + interpolation
    └── ai.ts                            ← Groq + OpenRouter client
```

---


## User Roles

| Role | What they can do |
|------|-----------------|
| Owner | Full access to all their Prompts, Collections, API Keys, billing |
| API Consumer | Read/execute Prompts via API Key only (no UI access) |

---

## Key Workflows

1. **Create Prompt:** User writes prompt → saves → new Version row created → displayed as "v1"
2. **Edit Prompt:** User edits → saves → new immutable Version row → displayed as "v2, v3..." (never overwrites)
3. **API Access (pull):** User creates API Key → fetch `GET /api/v1/prompts/:id/latest` at runtime → inject into AI call
4. **Push from CLI:** `gfp push <id> <file>` → `POST /api/v1/prompts/:id/versions` with advisory lock → `version.created` webhook fires
5. **Run Tests:** Create test cases → `runTestsForVersion` → AI evaluation → bulk-upsert results → display pass/fail
6. **Compare:** Pick two versions → `runComparisonForVersions` → both sides evaluated in parallel → side-by-side scores
7. **Explore:** Public prompt marked `isPublic=true` → appears on Explore page → fork creates a private copy via `insertNextVersion`

---

## Naming Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| DB tables | snake_case, plural | `prompt_versions`, `api_keys` |
| React components | PascalCase | `PromptEditor`, `VersionHistory` |
| API routes | kebab-case | `/api/prompts/[id]/versions` |
| TypeScript types | PascalCase | `PromptVersion`, `ApiKey` |
| Clerk userId | `ownerId` in DB | `ownerId: auth().userId()` |

---

## ADRs — Architecture Decision Records

| Date | Decision | Why |
|------|---------|-----|
| — | Drizzle ORM over Prisma | Better raw SQL control, lighter weight |
| — | Clerk over Supabase Auth | Simpler setup, built-in UI components |
| — | Immutable versions table | Git-style history — safe, auditable, no data loss |
| — | Groq primary, OpenRouter fallback | Groq speed + OpenRouter model variety as backup |
| — | API keys as SHA-256 only (no bcrypt) | 128-bit entropy keys make bcrypt unnecessary; SHA-256 is O(1) and collision-safe |
| — | Upstash Redis for rate limiting | Serverless-compatible, no persistent connection needed |
| — | All AI calls in Server Actions | API keys stay server-side, never in client bundle |
| — | `revalidatePath()` after mutations | Required for App Router cache refresh |
| — | `pg_advisory_xact_lock` for versioning | Prevents concurrent saves from racing — works for v1 and v500 alike |
| — | All version writes via `insertNextVersion` | Advisory lock + variable extraction + currentVersionId update in one place |
| — | Webhooks fire-and-forget | Never block a save — `void fireWebhooks(...)` after DB commit |
| — | `authenticateApiKey` shared module | Auth logic in one place — all API routes delegate here |
| 2026-08-07 | Hero App Dashboard Replica & Landing Redesign | Render exact cloud dashboard frontend in Hero screen with live interactive switching; remove select-none for global text selection |
| 2026-08-07 | Codebase Pruning & Editorial Showcase Redesign | Purge 6 obsolete landing page files; replace cramped fixed-height boxes with spacious full-width editorial feature showcases |
| 2026-08-07 | Master Unified Monorepo Redesign & Codebase Cleanup | Single master plan combining Landing Page, App Shell (AppSidebar/Topbar), all 10 Dashboard routes, Shared UI Component Library, and deletion of 6 obsolete files |
| 2026-08-07 | Shared UI Dashboard Replica & Non-Slop Landing | Hero interactive sandbox reuses 100% of real app dashboard components with mock data fallback; high-converting 6-section landing flow with zero AI slop |
| 2026-08-08 | Floating Island Navbar & Charcoal Theme Redesign | Floating island navbar container (max-w-6xl top-4 rounded-2xl), rich dark charcoal theme (#121214), removal of stack section, and direct placement of DashboardHeroScreen under Hero CTAs |
| 2026-08-08 | Dashboard, Auth Canvas, & Studio Dark Charcoal Redesign | Dark charcoal design system (#121214 base) across all 8 dashboard routes, Clerk auth wrapper, tabbed Prompt Studio suite, and 100% accurate feature copy |
| 2026-08-08 | Full-Bleed App Shell & Persistent Collapsible Sidebar | Dedicated full-bleed dashboard app shell with persistent collapsible left navigation sidebar (`w-64 bg-[#161619]`), unified floating island navbar, and 1:1 demo replica preview on Hero section |
| 2026-08-08 | High-Contrast Monochrome Brand & Strict Semantic Colors | High-contrast monochrome white (`#F4F4F5`) primary brand identity paired with strict functional semantic colors: Green for pass/online, Red for fail/diff, Amber for CLI warnings, Blue for versions |
| 2026-08-08 | Dashboard Comprehensive Dark Shell Standardization | Unify all 8 dashboard pages (Overview, Studio, Edit, Diff, Compare, Evals, API Keys, Webhooks, Explore) to dark charcoal `#161619` shell with `#121214` code surfaces, `border-zinc-800/90` borders, interactive search/filter, and view toggles |
| 2026-08-08 | Obsolete Legacy UI Cleanup & Error/Loading Dark Alignment | Delete legacy `topbar.tsx` and `status-badge.tsx`; purge topbar imports; standardize `loading.tsx`, `not-found.tsx`, and `error.tsx` to dark charcoal shell system |
| 2026-08-08 | Diff Page Single-Version Empty State & BrandLogo Alignment | Replace `notFound()` exception on `/diff` with friendly dark charcoal empty state card ("Need at least 2 commit snapshots"); standardize `BrandLogo` component with dark charcoal background `#1D1D22` and blue `GitFork` icon |
| 2026-08-08 | Dashboard Sidebar Logo SVG & Landing Navigation Link | Replace `>_` terminal icon in `DashboardSidebar` with official `/logo.svg`; set sidebar logo link to `/` (Home Landing Page); add "Landing Page" navigation item to sidebar nav |
| 2026-08-08 | Complete Live Studio Suite & Sample Starter Onboarding Flow | Build Live AI Execution Sandbox Runner (Groq/OpenRouter), REST cURL Code Drawer, Full Bundle Inspector (Model Config + Response Format), 1-click Sample Repo Starter on empty state, and Delete Repository action in Studio |
| 2026-08-08 | Site-Wide Logo SVG Standardization & Zero Emoji Policy | Update `Navbar.tsx`, `FaqFooter.tsx`, and `layout.tsx` metadata to render `/logo.svg` site-wide, and purge all AI slop emojis across all UI files and responses |
| 2026-08-08 | Sticky Top Bar Breadcrumbs, Home Page #1 Sidebar, & Pure Real Data | Add sticky Top Header Path Bar with interactive breadcrumbs in `(dashboard)/layout.tsx`, move "Home Page" (`/`) to position #1 in `DashboardSidebar`, and purge all mock fallback arrays |
| 2026-08-08 | Layout Restructuring & Refinement Across All Dashboard Routes | Enforce executive metrics + sticky search overview canvas, wide Monaco studio canvas + 340px right inspector panel, and integrated edit bundle editor with model drawer & sticky commit bar |
| 2026-08-08 | Dashboard Explore Route Alignment & Layout Consolidation | Route "Explore Community" in `DashboardSidebar` directly to `/dashboard/explore` for perfect workspace integration, leaving `/explore` for public landing visitors |
| 2026-08-08 | Active Subnav Tabs & Timeline Version Restore Action | Make Diff and Compare tabs in `PromptSubnav` clickable even with 1 version, and add a "Restore Version" action in the timeline panel |
| 2026-08-09 | Navbar Get Started Action Route | Route unauthenticated 'Get Started' button in Navbar to /sign-in page where user can log in via Google SSO or email, redirecting to /dashboard |
| 2026-08-09 | Auth Canvas & Sign-In Copy Redesign | Update AuthLayout header with official /logo.svg & badge; standardize Sign-In card copy to 'Sign in to Git for Prompts / Local-first prompt package manager for AI engineering'; position Google SSO at top |
| 2026-08-09 | Dedicated Auth Canvas & Hide Floating Navbar | Hide floating Navbar on /sign-in and /sign-up; update email input label to 'Email' with 'developer@example.com' placeholder; add '← Back to Home' link |
| 2026-08-09 | Single-Card Auth UI Redesign & Website Color Alignment | Redesign sign-in/sign-up cards to spacious max-w-md single container (rounded-3xl, bg-[#161619], border-zinc-800) with top logo header inside card, matching website dark charcoal & electric blue color system |





---

## Bugs Fixed

_Append-only. Never repeat these._

| Date | Bug | Fix |
|------|-----|-----|
| — | Missing ownerId check on DB query | `WHERE ownerId = auth().userId()` — every query, no exceptions |
| — | API key visible in client | Move all key operations to Server Actions |
| 2026-07-24 | `webhooks.ts`: `&&` used instead of Drizzle `and()` | ownerId filter was silently dropped — all users' webhooks fired for every save |
| 2026-07-24 | `push route`: race condition on `versionNumber` | Two concurrent pushes could both read same max version; fixed with `pg_advisory_xact_lock` |
| 2026-07-24 | Test isolation: `afterAll` didn't clean `test_results` | FK violation silently swallowed; cleanup now runs in order: results → cases → versions → prompts |
