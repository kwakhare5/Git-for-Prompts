# ARCHITECTURE.md — The Technical Blueprint (V2)

_This document is for HUMANS to read. The AI will only read this when explicitly commanded via `@ZOOM` or when investigating complex database/architecture tasks._

## 1. PROJECT OVERVIEW & BUSINESS LOGIC

### The Core Problem (V2 — Expanded)
AI teams manage prompts in Google Docs, Notion, or hardcoded strings. When production breaks, nobody knows what changed. But the problem is **deeper** than text versioning:

1. **The "ghost drift" problem:** A prompt rollback doesn't fix the bug because the *model*, *temperature*, *tools*, or *output schema* also changed. Nobody tracked those.
2. **The "another SaaS" problem:** Every prompt tool wants your prompts in their cloud. Developers in 2026 have subscription fatigue (41% report it) and want data ownership.
3. **The "5-minute wall" problem:** Self-hosted alternatives (Langfuse) require Docker + Postgres + ClickHouse. Too heavy for a solo dev who just wants to version prompts on their laptop.

### The Solution (V2)
A **local-first prompt package manager** that versions the entire "prompt bundle" — not just text:

- **Full bundle versioning:** System prompt + user template + model config (provider, model, temperature, topP, maxTokens) + function/tool definitions + output schema — all versioned as a single immutable snapshot
- **Local-first CLI:** `npx gfp init` → SQLite database on your laptop. Zero cloud dependency. Zero subscriptions.
- **Cloud sync (optional):** `gfp push` / `gfp pull` with API key to sync bundles to hosted SaaS for team collaboration
- **Everything from V1:** Visual diff, A/B compare, test runner, webhooks, REST API, CLI, Explore page

### What Differentiates Us
| Feature | Langfuse | Braintrust | PromptLayer | **Git for Prompts V2** |
| :--- | :--- | :--- | :--- | :--- |
| Prompt text versioning | ✅ | ✅ | ✅ | ✅ |
| Model config versioning | Partial | ✅ | ✅ | ✅ |
| Tool/schema versioning | ❌ | ✅ | ✅ | ✅ |
| Self-hosted | Docker+PG+CH | ❌ (SaaS) | ❌ (SaaS) | **`npx gfp` + SQLite** |
| Zero-dependency local | ❌ | ❌ | ❌ | **✅** |
| Offline eval runner | ❌ | ❌ | ❌ | **✅** |
| Free & MIT licensed | ✅ | ❌ | ❌ | **✅** |

## 2. SYSTEM ARCHITECTURE

### Monorepo Structure (V2)
```text
git-for-prompts/
├── packages/
│   ├── core/                        # @gfp/core — shared engine (pure TS, zero deps)
│   │   ├── src/
│   │   │   ├── bundle.ts            # Bundle Zod schema, validation, type exports
│   │   │   ├── diff.ts              # Structural bundle diff engine (text + JSON)
│   │   │   ├── eval.ts              # Provider-agnostic evaluation runner
│   │   │   ├── variables.ts         # {{var}} extraction + interpolation
│   │   │   ├── storage.ts           # Storage interface (implemented by adapters)
│   │   │   └── index.ts             # Public API barrel export
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── cli/                         # gfp CLI — local-first prompt manager
│       ├── src/
│       │   ├── index.ts             # CLI entry point (commander.js)
│       │   ├── commands/
│       │   │   ├── init.ts          # gfp init — create .gfp/ + SQLite DB
│       │   │   ├── add.ts           # gfp add — create/update prompt bundle
│       │   │   ├── run.ts           # gfp run — execute evals locally
│       │   │   ├── history.ts       # gfp history — show version log
│       │   │   ├── diff.ts          # gfp diff — compare two versions
│       │   │   ├── push.ts          # gfp push — sync local → cloud
│       │   │   ├── pull.ts          # gfp pull — sync cloud → local
│       │   │   └── auth.ts          # gfp auth — set API key for cloud sync
│       │   ├── db/
│       │   │   ├── sqlite.ts        # better-sqlite3 adapter (implements @gfp/core StorageAdapter)
│       │   │   └── migrations.ts    # SQLite schema migrations
│       │   └── config.ts            # .gfp/config.json reader/writer
│       ├── package.json
│       └── tsconfig.json
│
├── src/                             # Next.js cloud SaaS app
│   ├── app/
│   │   ├── (auth)/                  # Route group — auth pages (sign-in, sign-up)
│   │   ├── (dashboard)/             # Route group — protected app pages
│   │   │   ├── layout.tsx           # Sidebar + nav wrapper
│   │   │   ├── page.tsx             # Dashboard — all prompts
│   │   │   ├── api-keys/            # API key manager page
│   │   │   ├── webhooks/            # Webhook manager page
│   │   │   └── prompts/[id]/
│   │   │       ├── page.tsx         # Prompt detail + version history
│   │   │       ├── edit/            # Edit prompt bundle (V2: tabbed editor)
│   │   │       ├── diff/            # Visual bundle diff comparison
│   │   │       ├── compare/         # A/B version comparison
│   │   │       └── tests/           # Test suite runner
│   │   ├── (landing)/               # Marketing page & Explore page
│   │   │   ├── page.tsx             # Landing page (V2: local-first messaging)
│   │   │   └── explore/             # Public prompt discovery page
│   │   └── api/
│   │       ├── v1/prompts/[id]/
│   │       │   ├── latest/route.ts  # GET: fetch latest version (returns bundle)
│   │       │   └── versions/route.ts # POST: push new version (accepts bundle)
│   │       └── cron/                # Cron endpoints (keep-alive, regression-tests)
│   ├── components/                  # React components
│   │   ├── prompt-editor.tsx        # Monaco editor (V2: tabbed for bundle fields)
│   │   ├── diff-viewer.tsx          # Monaco diff (V2: multi-section bundle diff)
│   │   ├── bundle-editor.tsx        # NEW: Visual editor for model config + tools + schema
│   │   ├── compare-runner.tsx
│   │   ├── test-runner.tsx
│   │   ├── version-history.tsx
│   │   └── api-keys-manager.tsx
│   ├── db/
│   │   ├── schema.ts               # Drizzle schema — V2: bundle JSONB column added
│   │   ├── index.ts                 # Drizzle client instance
│   │   └── migrations/             # V2: migration 0008 adds bundle column
│   └── lib/
│       ├── actions/                 # Next.js Server Actions
│       ├── api-auth.ts              # Shared API key authentication
│       ├── test-runner.ts           # Cloud test runner (delegates to @gfp/core eval)
│       ├── webhooks.ts              # HMAC-SHA256 webhook delivery
│       └── ai.ts                    # Groq + OpenRouter client
│
├── docker-compose.yml               # NEW: One-command self-hosted deployment
├── Dockerfile                        # NEW: Container image for self-hosting
└── README.md                        # V2: local-first messaging + install instructions
```

### Data Flow

```text
┌─────────────────────────────────────────────────────────────────┐
│                        @gfp/core                                │
│  Bundle Schema (Zod) │ Diff Engine │ Eval Runner │ Variables     │
└────────────┬─────────────────────────────────┬──────────────────┘
             │                                 │
    ┌────────▼────────┐              ┌─────────▼──────────┐
    │   packages/cli   │              │   Next.js Cloud     │
    │  (local-first)   │   gfp push   │   (hosted SaaS)     │
    │                  │ ──────────►  │                     │
    │  better-sqlite3  │              │  Drizzle + Postgres  │
    │  .gfp/bundles.db │  ◄────────  │  Supabase            │
    │  User's API key  │   gfp pull   │  Clerk Auth          │
    └──────────────────┘              └─────────────────────┘
```

## 3. DATABASE SCHEMA (V2)

### Table: `versions` (V2 — bundle column added)
```typescript
export const versions = pgTable("versions", {
  id: uuid("id").defaultRandom().primaryKey(),
  promptId: uuid("prompt_id").notNull().references(() => prompts.id, { onDelete: "cascade" }),
  versionNumber: integer("version_number").notNull(),
  content: text("content").notNull(),                    // LEGACY: plain prompt text (always populated)
  bundle: jsonb("bundle").$type<PromptBundle | null>(),  // V2 NEW: full bundle payload (null for V1 versions)
  commitMessage: varchar("commit_message", { length: 500 }),
  variables: text("variables").array().default([]).notNull(),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### Bundle JSON Schema (stored in `bundle` column)
```typescript
// Defined in packages/core/src/bundle.ts
interface PromptBundle {
  systemPrompt: string | null;         // System message / instructions
  userTemplate: string;                // User prompt with {{variables}}
  modelConfig: {
    provider: string;                  // "openai" | "anthropic" | "groq" | etc.
    model: string;                     // "gpt-4o" | "claude-sonnet-4-20250514" | etc.
    temperature: number;               // 0.0 - 2.0
    topP?: number;                     // 0.0 - 1.0
    maxTokens?: number;                // Max output tokens
  };
  tools?: Array<{                      // Function/tool calling definitions
    name: string;
    description: string;
    parameters: Record<string, unknown>; // JSON Schema for tool parameters
  }>;
  responseFormat?: {                   // Structured output format
    type: "text" | "json_object" | "json_schema";
    schema?: Record<string, unknown>;  // JSON Schema for structured output
  };
}
```

### SQLite Schema (local CLI — mirrors Postgres)
```sql
-- packages/cli/src/db/migrations.ts
CREATE TABLE IF NOT EXISTS prompts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  current_version_id TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS versions (
  id TEXT PRIMARY KEY,
  prompt_id TEXT NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  bundle TEXT,                -- JSON string (parsed as PromptBundle)
  commit_message TEXT,
  variables TEXT DEFAULT '[]', -- JSON array of variable names
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(prompt_id, version_number)
);

CREATE TABLE IF NOT EXISTS test_cases (
  id TEXT PRIMARY KEY,
  prompt_id TEXT NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  input_text TEXT NOT NULL,
  expected_criteria TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS test_results (
  id TEXT PRIMARY KEY,
  version_id TEXT NOT NULL REFERENCES versions(id) ON DELETE CASCADE,
  test_case_id TEXT NOT NULL REFERENCES test_cases(id) ON DELETE CASCADE,
  passed INTEGER NOT NULL,      -- 0 or 1
  actual_output TEXT NOT NULL,
  score INTEGER,
  run_at TEXT DEFAULT (datetime('now')),
  UNIQUE(version_id, test_case_id)
);
```

### Other tables (unchanged from V1)
Tables `prompts`, `test_cases`, `test_results`, `api_keys`, `webhooks` remain as documented in V1. See `src/db/schema.ts` for full definitions.

## 4. DEEP MODULE ARCHITECTURE & SEAMS

### V1 Deep Modules (unchanged)
1. **`insertNextVersion`** — Advisory lock transaction, centralized version creation.
2. **`authenticateApiKey`** — Bearer auth, SHA-256 lookup, single-call API key validation.
3. **`fireWebhooks`** — Fire-and-forget HMAC-SHA256 webhook delivery.

### V2 New Deep Modules

4. **`@gfp/core` — Bundle Engine:**
   - `validateBundle(input: unknown): PromptBundle` — Zod parse + strip unknown fields
   - `diffBundles(a: PromptBundle, b: PromptBundle): BundleDiff` — Structural diff for each field
   - `extractVariables(bundle: PromptBundle): string[]` — Extract `{{vars}}` from both systemPrompt and userTemplate
   - `renderBundle(bundle: PromptBundle, vars: Record<string, string>): RenderedBundle` — Interpolate variables

5. **`@gfp/core` — Eval Engine (provider-agnostic):**
   - `runEvaluations(bundle: PromptBundle, testCases: TestCase[], provider: AIProvider): EvalResult[]`
   - `AIProvider` is an interface: `{ chat(messages, config): Promise<string> }` — implemented by cloud (Groq/OpenRouter) and CLI (user's key)

6. **`@gfp/core` — Storage Interface:**
   - `StorageAdapter` interface: `{ getPrompt, listVersions, insertVersion, getTestCases, upsertResults }`
   - Postgres adapter: `src/db/` (Drizzle, advisory locks)
   - SQLite adapter: `packages/cli/src/db/sqlite.ts` (better-sqlite3, auto-increment versioning)

## 5. SYNC PROTOCOL (cloud ↔ local)

```text
gfp push <prompt-name>
  1. Read local prompt + all versions from SQLite
  2. Authenticate via API key (gfp_live_* → SHA-256 lookup)
  3. POST /api/v1/prompts/:id/versions with bundle payload
  4. Server inserts via insertNextVersion (advisory lock)
  5. Webhook fires (version.created)

gfp pull <prompt-name>
  1. Authenticate via API key
  2. GET /api/v1/prompts/:id/latest (returns full bundle)
  3. Insert into local SQLite (auto-increment local version)
```

## 6. ADRs — Architecture Decision Records

| Date | Decision | Why |
|------|---------|-----|
| 2026-07 | Drizzle ORM over Prisma | Better raw SQL control, lighter weight |
| 2026-07 | Clerk over Supabase Auth | Simpler setup, built-in UI components |
| 2026-07 | Immutable versions table | Git-style history — safe, auditable, no data loss |
| 2026-07 | `pg_advisory_xact_lock` for versioning | Prevents concurrent saves from racing |
| 2026-07 | All version writes via `insertNextVersion` | Advisory lock + variable extraction in one place |
| 2026-07 | Webhooks fire-and-forget | Never block a save |
| 2026-08 | **V2: Bundle as single JSONB column** | Cleaner diffs, simpler migrations, flexible schema evolution |
| 2026-08 | **V2: Keep `content` + add `bundle`** | Backward compatible — V1 versions have null bundle |
| 2026-08 | **V2: `@gfp/core` shared package** | Pure TS engine shared by CLI (SQLite) and cloud (Postgres) |
| 2026-08 | **V2: `better-sqlite3` for local** | Fastest native SQLite binding, sync API, perfect for CLI |
| 2026-08 | **V2: User-provided API key for local evals** | No key storage on our side. User controls their own provider. |
| 2026-08 | **V2: MIT license** | Maximum adoption and community trust |
| 2026-08 | **V2: Kill Idea #2 (API Change Detector)** | Wrong audience (DevOps), wrong stack (AST), market eaten by AI agents |
