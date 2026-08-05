# CLAUDE.md — Project Context
# Hard cap: 200 lines. Global rules are in C:\Users\kwakh\.gemini\config\AGENTS.md
# Domain terms → CONTEXT.md (read every session)
# Heavy architecture → ARCHITECTURE.md (load on-demand)

---

## 1. PROJECT IDENTITY

**Name:** Git for Prompts
**Tagline:** The local-first prompt package manager
**Goal:** Open-source, local-first tool for versioning full prompt bundles (text + model config + tools + output schema). Runs entirely offline via CLI + SQLite. Optional cloud sync to hosted SaaS for team collaboration.
**Status:** V1 live on Vercel (`https://gitforprompts.vercel.app`). V2 pivot in progress.
**License:** MIT
**Stack type:** Monorepo — `packages/core` (shared engine), `packages/cli` (local CLI + SQLite), Next.js app (cloud SaaS)

---

## 2. TECH STACK

### Cloud (Next.js SaaS — existing, evolving)
- **Frontend:** Next.js 15 App Router, React, TypeScript (strict), Tailwind CSS v4
- **Auth:** Clerk only — never add Supabase Auth. User ID always from `auth().userId()`
- **Database:** Drizzle ORM only — PostgreSQL via Supabase. Never supabase-js for DB queries
- **AI:** Groq (primary), OpenRouter (fallback). Dual-model setup for speed + accuracy
- **Rate limiting:** Upstash Redis + `@upstash/ratelimit`
- **Hosting:** Vercel

### Local (CLI + SQLite — NEW)
- **CLI:** `packages/cli` — `gfp` command (`gfp init`, `gfp add`, `gfp run`, `gfp push`, `gfp pull`, `gfp auth`, `gfp history`, `gfp diff`)
- **Local DB:** `sql.js` (Wasm SQLite engine) — zero-dependency, zero native build requirement for cross-platform reliability
- **AI (local evals):** User-provided API key (any OpenAI-compatible provider). No key storage on our side.
- **Shared engine:** `packages/core` (`@gfp/core`) — pure TypeScript, zero framework deps

---

## 3. DEV COMMANDS

```bash
pnpm dev           # start dev server (Next.js cloud app)
pnpm build         # production build — must pass before any commit
pnpm test          # run vitest test suite
npx tsc --noEmit   # type check only
```

---

## 4. LOCAL RULES

1. **Database — Drizzle only, ownership & advisory locking (CLOUD):**
   - Drizzle ORM only. Never supabase-js for DB queries.
   - Every DB read/write MUST check `ownerId = auth().userId()`. No exceptions.
   - Versions are IMMUTABLE — every save creates a new row in `versions` table. Never update existing.
   - All version writes MUST use `insertNextVersion` — `pg_advisory_xact_lock` is mandatory to prevent version races.
   - `revalidatePath()` after every DB mutation.

2. **Bundle schema — the atomic unit of versioning (V2 NEW):**
   - Each version stores both `content` (legacy text) AND `bundle` (full JSON payload).
   - Bundle shape: `{ systemPrompt, userTemplate, modelConfig: { provider, model, temperature, topP, maxTokens }, tools: [...], responseFormat: { type, schema } }`
   - Old V1 versions: `content` populated, `bundle` is null. Read code MUST handle both.
   - New V2 versions: both `content` (extracted from bundle.userTemplate) AND `bundle` populated.
   - Validate all bundles with Zod schemas from `@gfp/core`.

3. **Dual storage — Postgres (cloud) + SQLite (local):**
   - `@gfp/core` defines storage interfaces. Never import Drizzle/Postgres in `packages/core`.
   - Cloud adapter: `src/db/` (Drizzle + Postgres). Local adapter: `packages/cli/src/db/` (better-sqlite3).
   - Same immutable version semantics in both — every save = new row.

4. **API Keys — security critical:**
   - Stored as SHA-256 lookup hash (`keyLookupHash`) with `gfp_live_` prefix for O(1) fast indexed lookup.
   - Auth logic isolated in `src/lib/api-auth.ts` (`authenticateApiKey`). Never show plaintext key after creation.
   - Cloud sync (`gfp push`/`gfp pull`) authenticates via the same API key infrastructure.

5. **AI calls & Test Runner — server only (cloud) / CLI only (local):**
   - Cloud: All AI calls in Server Actions or API routes. Never in Client Components.
   - Local: `gfp run` sends AI calls using user-provided API key. Key stored in local `.gfp/config.json`, never transmitted.
   - Evaluation & persistence: `@gfp/core` `runEvaluations` + adapter-specific `persistResults`.

6. **Webhooks — fire-and-forget (cloud only):**
   - Webhooks fired via `src/lib/webhooks.ts` (`fireWebhooks`) after DB commit. Always `void fireWebhooks(...)`, never `await`.

7. **Code style:**
   - Named exports for components. Default export for pages only.
   - `font-mono` class on ALL prompt text and AI output.
   - `unknown + Zod` for external data. Never `any`.
   - Check `src/components/` before building new components.
   - No `console.log` in production code.

8. **Before marking any task done:**
   - `pnpm test && npx tsc --noEmit` → zero errors

---

## 5. PROJECT PATTERNS

### Deep Modules
- `packages/core/src/bundle.ts`: Bundle Zod schema + validation + diff logic
- `packages/core/src/eval.ts`: `runEvaluations` — provider-agnostic eval runner
- `src/lib/api-auth.ts`: `authenticateApiKey(req)` → 5-step Bearer auth in one call
- `src/lib/actions/versions.ts`: `insertNextVersion` → advisory lock transaction for append-only versioning

### Key constraint — versions table
Every prompt save = INSERT new row. Never UPDATE. Read latest via `orderBy(desc(versions.versionNumber)).limit(1)`.

### Monorepo packages
- `packages/core` (`@gfp/core`): Bundle types, Zod schemas, diff engine, eval runner, variable interpolation. Zero framework deps.
- `packages/cli` (`gfp`): CLI commands + better-sqlite3 local storage. Imports from `@gfp/core`.
- Root Next.js app: Cloud SaaS. Imports from `@gfp/core`.

---

## 6. MISTAKES TO AVOID

- `webhooks.ts`: Do NOT use JS `&&` inside Drizzle `where()` clauses — use Drizzle `and(...)`.
- `tests.test.ts`: FK cleanup in `afterAll` must delete `test_results` before `test_cases`, `versions`, and `prompts`.
- `push route`: Do NOT query max version number without `pg_advisory_xact_lock` — concurrent pushes will collision.
- Bundle reads: ALWAYS check `if (version.bundle)` before accessing bundle fields — V1 versions have null bundles.

---

## 7. SESSION RESUME

**Last session date:** 2026-08-05

**What we accomplished (Phases 1-8 Overhaul Complete):**
- **Phase 1 (`@gfp/core`):** Extracted shared library package with Zod schemas for V2 PromptBundles, diff engine, variable extractor, and eval runner.
- **Phase 2 (Cloud Bundle Support):** Migrated database schema with `bundle` JSONB column, updated Drizzle queries & API routes.
- **Phase 3 (`gfp` CLI):** Built Wasm SQLite-powered (`sql.js`) local CLI with `init`, `add`, `history`, `diff`, `run`, and `auth` commands.
- **Phase 4 (Cloud Sync):** Built `push` and `pull` commands with cloud prompt name-to-ID resolution and local cloud ID caching.
- **Phase 5 (UI Enhancements):** Built 3-tab `BundleEditor`, V1/V2 mode toggle, model badges in history, and structural diff header in `DiffViewer`.
- **Phase 6 (Docker Self-Hosting):** Created multi-stage `Dockerfile`, `docker-compose.yml` (App + Postgres 16), `.dockerignore`, and standalone config.
- **Phase 7 (Landing Page Rewrite):** Redesigned marketing landing page with Geist font, matte charcoal theme (`#111111`), animated terminal hero, feature cards, interactive quickstart, and competitor matrix.
- **Phase 8 (Documentation & Verification):** Rewrote `README.md`, verified zero TypeScript errors, and passed 81/81 tests.

**Immediate next task:**
- Ready for production deployment or launch announcement (`/ship` or `/tweet-crafter`).

**Open blockers:**
- None. All 8 phases completed.

**Files most recently changed:**
- `README.md`
- `CLAUDE.md`
- `src/app/(landing)/_components/hero.tsx`
- `src/components/bundle-editor.tsx`
- `packages/cli/src/commands/push.ts`
- `packages/cli/src/commands/pull.ts`
