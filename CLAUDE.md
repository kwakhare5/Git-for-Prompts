# CLAUDE.md — Project Context
# Hard cap: 200 lines. Global rules are in C:\Users\kwakh\.gemini\config\AGENTS.md
# Domain terms → CONTEXT.md (read every session)
# Heavy architecture → ARCHITECTURE.md (load on-demand)

---

## 1. PROJECT IDENTITY

**Name:** Git for Prompts
**Goal:** SaaS tool for versioning, organizing, and managing AI prompts with GitHub-style workflows
**Status:** Live on Vercel (`https://gitforprompts.vercel.app`)
**Stack type:** Full-stack Next.js SaaS with API keys, CLI, webhooks & AI calls

---

## 2. TECH STACK

- **Frontend:** Next.js 15 App Router, React, TypeScript (strict), Tailwind CSS v4
- **Auth:** Clerk only — never add Supabase Auth. User ID always from `auth().userId()`
- **Database:** Drizzle ORM only — PostgreSQL via Supabase. Never supabase-js for DB queries
- **AI:** Groq (primary), OpenRouter (fallback). Dual-model setup for speed + accuracy
- **Rate limiting:** Upstash Redis + `@upstash/ratelimit`
- **Hosting:** Vercel

---

## 3. DEV COMMANDS

```bash
pnpm dev           # start dev server
pnpm build         # production build — must pass before any commit
pnpm test          # run vitest test suite (81/81 passing)
npx tsc --noEmit   # type check only
```

---

## 4. LOCAL RULES

1. **Database — Drizzle only, ownership & advisory locking:**
   - Drizzle ORM only. Never supabase-js for DB queries.
   - Every DB read/write MUST check `ownerId = auth().userId()`. No exceptions.
   - Versions are IMMUTABLE — every save creates a new row in `versions` table. Never update existing.
   - All version writes MUST use `insertNextVersion` — `pg_advisory_xact_lock` is mandatory to prevent version races.
   - `revalidatePath()` after every DB mutation.

2. **API Keys — security critical:**
   - Stored as SHA-256 lookup hash (`keyLookupHash`) with `gfp_live_` prefix for O(1) fast indexed lookup.
   - Auth logic isolated in `src/lib/api-auth.ts` (`authenticateApiKey`). Never show plaintext key after creation.

3. **AI calls & Test Runner — server only:**
   - All AI calls in Server Actions or API routes. Never in Client Components.
   - Evaluation & persistence handled by `src/lib/test-runner.ts` (`runEvaluations` + `persistResults`).

4. **Webhooks — fire-and-forget:**
   - Webhooks fired via `src/lib/webhooks.ts` (`fireWebhooks`) after DB commit. Always `void fireWebhooks(...)`, never `await`.

5. **Code style:**
   - Named exports for components. Default export for pages only.
   - `font-mono` class on ALL prompt text and AI output.
   - `unknown + Zod` for external data. Never `any`.
   - Check `src/components/` before building new components.
   - No `console.log` in production code.

6. **Before marking any task done:**
   - `pnpm test && npx tsc --noEmit` → zero errors

---

## 5. PROJECT PATTERNS

### Deep Modules
- `src/lib/api-auth.ts`: `authenticateApiKey(req)` → 5-step Bearer auth in one call
- `src/lib/test-runner.ts`: `runEvaluations` + `persistResults` → bulk upsert on `(version_id, test_case_id)`
- `src/lib/actions/versions.ts`: `insertNextVersion` → advisory lock transaction for append-only versioning

### Key constraint — versions table
Every prompt save = INSERT new row. Never UPDATE. Read latest via `orderBy(desc(versions.versionNumber)).limit(1)`.

---

## 6. MISTAKES TO AVOID

- `webhooks.ts`: Do NOT use JS `&&` inside Drizzle `where()` clauses — use Drizzle `and(...)`.
- `tests.test.ts`: FK cleanup in `afterAll` must delete `test_results` before `test_cases`, `versions`, and `prompts`.
- `push route`: Do NOT query max version number without `pg_advisory_xact_lock` — concurrent pushes will collision.

---

## 7. SESSION RESUME

**Last session date:** 2026-07-24

**What we built / changed:**
- Refactored API Auth, TestRunner, and `forkPrompt` into 3 deep modules (`api-auth.ts`, `test-runner.ts`, `insertNextVersion`).
- Curated top 4 landing page features & graphics ([features.tsx](file:///d:/Git%20for%20Prompts/src/app/%28landing%29/_components/features.tsx)).
- Updated documentation across [README.md](file:///d:/Git%20for%20Prompts/README.md), [CONTEXT.md](file:///d:/Git%20for%20Prompts/CONTEXT.md), and [ARCHITECTURE.md](file:///d:/Git%20for%20Prompts/ARCHITECTURE.md).
- Squashed commits cleanly into `ba79937` and pushed to `main`.

**Immediate next task:**
- None pending — codebase clean, 81/81 tests passing, `tsc --noEmit` zero errors.

**Open blockers:**
- None.

**Files most recently changed:**
- `src/app/(landing)/_components/features.tsx`
- `README.md`
- `CONTEXT.md`
- `ARCHITECTURE.md`
- `CLAUDE.md`
