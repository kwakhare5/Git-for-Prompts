# ARCHITECTURE.md — The Technical Blueprint

_This document is for HUMANS to read. The AI will only read this when explicitly commanded via `@ZOOM` or when investigating complex database/architecture tasks._

## 1. PROJECT OVERVIEW & BUSINESS LOGIC

### The Core Problem
Every company building AI products manages prompts in Google Docs, Notion, or hardcoded strings. There is no version history, no rollback, no testing, no review process. When a prompt changes and the AI breaks, nobody knows what changed or how to fix it.

### The Solution
Give prompts the same treatment that code gets:
- Full version history with commit messages (append-only, immutable version snapshots)
- Visual side-by-side diff viewer (Monaco Editor VS Code engine)
- Visual A/B test comparison between any two versions with parallel AI scoring
- Automated test cases with pass/fail scoring and single bulk-upsert per test run
- Variable extraction and runtime interpolation (`{{variable}}`)
- Public REST API (`GET /api/v1/prompts/:id/latest`, `POST /api/v1/prompts/:id/versions`)
- Developer CLI (`gfp auth`, `gfp pull`, `gfp push`)
- Webhooks with HMAC-SHA256 signature verification (`version.created`)
- Scheduled regression testing via cron
- Public prompt Explore page and one-click Fork mechanism

## 2. SYSTEM ARCHITECTURE

- **Frontend/Backend:** Next.js 15 (App Router) — full-stack application repository. API logic lives in Next.js Server Actions and Route Handlers (`app/api/`), achieving **~20ms response latencies**.
- **Language:** TypeScript — strict mode enabled. Every file is `.ts` or `.tsx`. Zero `any` types allowed.
- **Database:** Supabase (PostgreSQL) — connection via `DATABASE_URL` environment variable. Drizzle ORM for all database operations. Leverages `pg_advisory_xact_lock` for a **0% concurrency failure rate**.
- **Authentication:** Clerk — GitHub OAuth and Email authentication. Middleware at `src/proxy.ts` protects dashboard and API routes. `userId` from Clerk is stored as `owner_id`.
- **API Key Auth:** SHA-256 hash lookup (`keyLookupHash`) with `gfp_live_` prefix for O(1) indexed authentication via the shared `authenticateApiKey` module.
- **Styling:** Tailwind CSS v4 — shadcn/ui components. Dark theme by default. Monospace font (`font-mono`) for all prompt text.
- **Diff Viewer:** Monaco Editor (`@monaco-editor/react`) in diff mode (`plaintext`, `vs-dark`).
- **AI Engine:** Groq (Primary) + OpenRouter (Fallback) — Dual-model configuration separating fast execution models from heavy evaluation models.
- **Validation:** Zod — schema validation everywhere.
- **Deployment:** Vercel — automatic deploys from GitHub main branch (`https://gitforprompts.vercel.app`).

### Project Structure
```text
git-for-prompts/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Route group — auth pages (sign-in, sign-up)
│   ├── (dashboard)/              # Route group — protected app pages
│   │   ├── layout.tsx            # Sidebar + nav wrapper
│   │   ├── page.tsx              # Dashboard — all prompts
│   │   ├── api-keys/             # API key manager page
│   │   ├── webhooks/             # Webhook manager page
│   │   └── prompts/[id]/
│   │       ├── page.tsx          # Prompt detail + version history
│   │       ├── edit/             # Edit prompt text
│   │       ├── diff/             # Visual diff comparison
│   │       ├── compare/          # A/B version comparison
│   │       └── tests/            # Test suite runner
│   ├── (landing)/                # Marketing page & Explore page
│   │   ├── page.tsx              # Main landing page
│   │   └── explore/              # Public prompt discovery page
│   ├── api/                      # API Route Handlers
│   │   ├── v1/prompts/[id]/
│   │   │   ├── latest/route.ts   # GET /api/v1/prompts/:id/latest
│   │   │   └── versions/route.ts # POST /api/v1/prompts/:id/versions
│   │   └── cron/                 # Cron endpoints (keep-alive, regression-tests)
│   ├── layout.tsx                # Root layout — ClerkProvider, ThemeProvider
│   └── globals.css
├── src/
│   ├── components/               # React components (editor, diff, test-runner, etc.)
│   ├── db/
│   │   ├── schema.ts             # Drizzle schema — 6 core tables
│   │   ├── index.ts              # Drizzle client instance
│   │   └── migrations/           # 8 migrations applied (0000–0007)
│   ├── lib/
│   │   ├── actions/              # Next.js Server Actions (prompts, versions, tests, webhooks)
│   │   ├── api-auth.ts           # Shared API key authentication deep module
│   │   ├── test-runner.ts        # Deep TestRunner module (runEvaluations + persistResults)
│   │   ├── webhooks.ts           # HMAC-SHA256 signed webhook delivery module
│   │   ├── variables.ts          # {{variable}} extraction and interpolation
│   │   ├── ai.ts                 # Dual-provider Groq + OpenRouter client
│   │   └── proxy.ts              # Clerk auth middleware
├── packages/
│   └── cli/                      # gfp CLI (auth, pull, push)
├── e2e/                          # Playwright test suite
├── drizzle.config.ts             # Drizzle Kit config
├── next.config.ts
├── tsconfig.json                 # TypeScript config (with vitest/globals)
└── README.md
```

## 3. DATABASE SCHEMA

All tables defined in `src/db/schema.ts` using Drizzle ORM syntax.

### Table: `prompts`
```typescript
export const prompts = pgTable("prompts", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  ownerId: varchar("owner_id", { length: 255 }).notNull(),
  isPublic: boolean("is_public").default(false).notNull(),
  currentVersionId: uuid("current_version_id"),
  testSchedule: varchar("test_schedule", { length: 50 }),
  lastScheduledTestAt: timestamp("last_scheduled_test_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

### Table: `versions`
```typescript
export const versions = pgTable("versions", {
  id: uuid("id").defaultRandom().primaryKey(),
  promptId: uuid("prompt_id").notNull().references(() => prompts.id, { onDelete: "cascade" }),
  versionNumber: integer("version_number").notNull(),
  content: text("content").notNull(),
  commitMessage: varchar("commit_message", { length: 500 }),
  variables: jsonb("variables").$type<string[]>().default([]).notNull(),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### Table: `test_cases`
```typescript
export const testCases = pgTable("test_cases", {
  id: uuid("id").defaultRandom().primaryKey(),
  promptId: uuid("prompt_id").notNull().references(() => prompts.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  inputText: text("input_text").notNull(),
  expectedCriteria: text("expected_criteria").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### Table: `test_results`
```typescript
export const testResults = pgTable("test_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  versionId: uuid("version_id").notNull().references(() => versions.id, { onDelete: "cascade" }),
  testCaseId: uuid("test_case_id").notNull().references(() => testCases.id, { onDelete: "cascade" }),
  passed: boolean("passed").notNull(),
  actualOutput: text("actual_output").notNull(),
  runAt: timestamp("run_at").defaultNow().notNull(),
});
```

### Table: `api_keys`
```typescript
export const apiKeys = pgTable("api_keys", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: varchar("owner_id", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  keyLookupHash: varchar("key_lookup_hash", { length: 64 }).notNull().unique(),
  keyPrefix: varchar("key_prefix", { length: 20 }).notNull(),
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### Table: `webhooks`
```typescript
export const webhooks = pgTable("webhooks", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: varchar("owner_id", { length: 255 }).notNull(),
  url: text("url").notNull(),
  secret: varchar("secret", { length: 255 }).notNull(),
  events: jsonb("events").$type<string[]>().default(['version.created']).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

## 4. DEEP MODULE ARCHITECTURE & SEAMS

1. **`insertNextVersion` (Advisory Lock Transaction):**
   - Centralized version creation function used by `createVersion`, `restoreVersion`, `forkPrompt`, and `POST /api/v1/prompts/:id/versions`.
   - Uses `pg_advisory_xact_lock(hashtext(promptId))` to guarantee 0% concurrency failure rate when determining `nextVersionNumber`.

2. **`authenticateApiKey` (Shared API Auth):**
   - Encapsulates Bearer header parsing, `gfp_live_` prefix validation, SHA-256 hash calculation, and DB lookup into a single call returning `{ ownerId, keyId }` or `NextResponse(401)`.

3. **`TestRunner` (AI & Results Persistence):**
   - `runEvaluations(promptContent, testCases)` handle AI model interaction with concurrency limits.
   - `persistResults(rows)` performs a single bulk upsert on `test_results` on conflict of `(version_id, test_case_id)`.

4. **`fireWebhooks` (Background Event Dispatch):**
   - Asynchronously queries user webhooks matching `ownerId` and dispatches HTTP POST payloads signed with `X-GFP-Signature` (HMAC-SHA256).
