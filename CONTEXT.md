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
