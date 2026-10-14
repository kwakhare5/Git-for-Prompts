# ARCHITECTURE.md — The Technical Blueprint (Version 1)

_This document is for HUMANS to read. The AI will only read this when explicitly commanded via `@ZOOM` or when investigating complex database/architecture tasks._

## 1. PROJECT OVERVIEW & BUSINESS LOGIC

### The Core Problem
AI teams manage prompts in Google Docs, Notion, or hardcoded strings. When production breaks, nobody knows what changed. But the problem is **deeper** than text versioning:

1. **The "ghost drift" problem:** A prompt rollback doesn't fix the bug because the *model*, *temperature*, *tools*, or *output schema* also changed. Nobody tracked those.
2. **The "another SaaS" problem:** Every prompt tool wants your prompts in their cloud. Developers in 2026 have subscription fatigue (41% report it) and want data ownership.
3. **The "5-minute wall" problem:** Self-hosted alternatives (Langfuse) require Docker + Postgres + ClickHouse. Too heavy for a solo dev who just wants to version prompts on their laptop.

### The Solution
A **local-first prompt package manager** that versions the entire "prompt bundle" — not just text:

- **Full bundle versioning:** System prompt + user template + model config (provider, model, temperature, topP, maxTokens) + function/tool definitions + output schema — all versioned as a single immutable snapshot
- **Local-first CLI:** `npx gitforprompts init` → SQLite database on your laptop. Zero cloud dependency. Zero subscriptions.
- **Cloud sync (optional):** `gitforprompts push` / `gitforprompts pull` with API key to sync bundles to hosted SaaS for team collaboration
- **Comprehensive toolset:** Visual diff, A/B compare, test runner, webhooks, REST API, CLI

### What Differentiates Us
| Feature | Langfuse | Braintrust | PromptLayer | **Git for Prompts (v1)** |
| :--- | :--- | :--- | :--- | :--- |
| Prompt text versioning | ✅ | ✅ | ✅ | ✅ |
| Model config versioning | Partial | ✅ | ✅ | ✅ |
| Tool/schema versioning | ❌ | ✅ | ✅ | ✅ |
| Self-hosted | Docker+PG+CH | ❌ (SaaS) | ❌ (SaaS) | **`npx gitforprompts` + SQLite** |
| Zero-dependency local | ❌ | ❌ | ❌ | **✅** |
| Offline eval runner | ❌ | ❌ | ❌ | **✅** |
| Free & MIT licensed | ✅ | ❌ | ❌ | **✅** |

## 2. SYSTEM ARCHITECTURE

### Monorepo Structure
```text
git-for-prompts/
├── packages/
│   ├── core/                        # @gfp/core — shared engine (pure TS, zero deps)
│   │   ├── src/
│   │   │   ├── ai-config.ts         # Central AI timeouts, default models, and system parameters
│   │   │   ├── bundle.ts            # Bundle Zod schema, validation, type exports
│   │   │   ├── diff.ts              # Structural bundle diff engine (text + JSON)
│   │   │   ├── eval.ts              # Provider-agnostic evaluation runner
│   │   │   ├── variables.ts         # {{var}} extraction + interpolation
│   │   │   ├── storage.ts           # Storage interface (implemented by adapters)
│   │   │   └── index.ts             # Public API barrel export
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── cli/                         # gitforprompts CLI — local-first prompt manager
│       ├── src/
│       │   ├── index.ts             # CLI entry point (commander.js)
│       │   ├── commands/
│       │   │   ├── init.ts          # gitforprompts init — create .gitforprompts/ + SQLite DB
│       │   │   ├── add.ts           # gitforprompts add — create/update prompt bundle
│       │   │   ├── run.ts           # gitforprompts run — execute evals locally
│       │   │   ├── list.ts          # gitforprompts list — list local prompts and active versions
│       │   │   ├── test-add.ts      # gitforprompts test-add — add evaluation test cases
│       │   │   ├── history.ts       # gitforprompts history — show version log
│       │   │   ├── diff.ts          # gitforprompts diff — compare two versions
│       │   │   ├── push.ts          # gitforprompts push — sync local → cloud
│       │   │   ├── pull.ts          # gitforprompts pull — sync cloud → local
│       │   │   └── auth.ts          # gitforprompts auth — set API key for cloud sync
│       │   ├── db/
│       │   │   ├── sqlite.ts        # sql.js (Wasm SQLite) adapter (implements StorageAdapter)
│       │   │   ├── mappers.ts       # Row serialization and bundle mapper helpers
│       │   │   └── migrations.ts    # SQLite schema migrations
│       │   └── config.ts            # .gitforprompts/config.json reader/writer
│       ├── package.json
│       └── tsconfig.json
│
├── src/                             # Next.js 16.3.1 cloud SaaS app (16 static routes + 9 API route handlers)
│   ├── app/
│   │   ├── (auth)/                  # Route group — auth pages (sign-in, sign-up)
│   │   ├── (dashboard)/             # Route group — protected app layout
│   │   │   ├── layout.tsx           # Collapsible sidebar + path header wrapper
│   │   │   ├── error.tsx            # Dashboard error boundary
│   │   │   ├── not-found.tsx        # Dashboard not-found boundary
│   │   │   └── dashboard/           # Workspace pages
│   │   │       ├── page.tsx         # Dashboard — prompt list & metrics
│   │   │       ├── new/page.tsx     # Create prompt repository
│   │   │       ├── api-keys/        # API key manager page
│   │   │       ├── webhooks/        # Webhook manager page
│   │   │       └── prompts/[id]/
│   │   │           ├── page.tsx     # Prompt detail + version history
│   │   │           ├── edit/        # Edit prompt bundle (tabbed Monaco editor)
│   │   │           ├── diff/        # Visual bundle diff comparison
│   │   │           ├── compare/     # A/B version comparison
│   │   │           └── tests/       # Test suite runner
│   │   ├── (landing)/               # Marketing landing page (force-static, sub-50ms TTFB)
│   │   │   └── page.tsx             # Landing page with interactive hero and showcase
│   │   ├── about/, contact/, privacy/ # Static trust anchor pages & security policy
│   │   ├── developers/              # Public API documentation, CLI quickstart, & MCP instructions
│   │   ├── not-found.tsx            # Agent-friendly 404 with machine-readable recovery paths
│   │   ├── llms.txt/route.ts        # Dynamic plaintext LLM documentation endpoint
│   │   └── api/
│   │       ├── markdown/route.ts    # AcceptMarkdown content negotiation handler
│   │       ├── status/route.ts      # Health check and service status endpoint
│   │       ├── v1/mcp/route.ts      # Model Context Protocol server manifest
│   │       ├── v1/openapi.json/     # Scoped OpenAPI 3.1 spec with CORS headers
│   │       ├── v1/prompts/          # REST endpoints: prompt listing and creation
│   │       ├── v1/prompts/[id]/
│   │       │   ├── latest/route.ts  # GET: fetch latest version (returns bundle)
│   │       │   └── versions/route.ts # POST: push new version (accepts bundle)
│   │       └── cron/regression-tests/ # Scheduled prompt regression evaluator
│   ├── components/                  # React components
│   │   ├── domain/                  # Feature domain components
│   │   │   ├── dashboard/           # prompt-repositories-list.tsx, dashboard-sidebar.tsx
│   │   │   ├── prompts/             # prompt-editor.tsx, bundle-editor.tsx, version-history.tsx
│   │   │   ├── diff/                # diff-viewer.tsx, compare-runner.tsx
│   │   │   ├── testing/             # test-runner.tsx, use-test-runner-state.ts
│   │   │   └── api-keys/            # api-keys-manager.tsx
│   │   ├── layout/                  # brand-logo.tsx, feedback-modal.tsx, top-header-bar.tsx
│   │   └── website/                 # Navbar.tsx, DeveloperFooter.tsx, HeroSection.tsx, AboutSection.tsx
│   ├── db/
│   │   ├── schema.ts                # Drizzle schema — bundle JSONB column + BOLA indexes
│   │   ├── index.ts                 # Drizzle client instance
│   │   └── migrations/              # Drizzle migrations
│   └── lib/
│       ├── actions/                 # Server Actions: prompts.ts, versions.ts, tests.ts, api-keys.ts, webhooks.ts
│       ├── validations/             # Zod schema validation: prompt.ts, version.ts, test.ts, api-key.ts
│       ├── api-auth.ts              # Shared API key authentication (SHA-256)
│       ├── rate-limit.ts            # Upstash Redis token bucket + fail-closed protection
│       ├── security/ssrf.ts         # Outbound URL security firewall & IP-pinning
│       ├── test-runner.ts           # Cloud test runner (delegates to @gfp/core eval)
│       ├── webhooks.ts              # HMAC-SHA256 webhook delivery
│       └── ai.ts                    # Groq + OpenRouter client with test-mode fallback
│
├── public/                          # Static assets (icon.svg, llms.txt, openapi.json, .well-known/mcp.json)
├── docker-compose.yml               # Local PostgreSQL container configuration
└── vitest.config.ts                 # Hermetic Vitest test runner configuration (150 passing tests)
```

### Data Flow

```text
┌─────────────────────────────────────────────────────────────────┐
│                        @gfp/core                                │
│  Bundle Schema (Zod) │ Diff Engine │ Eval Runner │ Variables     │
└────────────┬─────────────────────────────────┬──────────────────┘
             │                                 │
    ┌────────▼────────┐              ┌─────────▼──────────┐
    │   packages/cli   │                  │   Next.js Cloud     │
    │  (local-first)   │ gitforprompts push│  (hosted SaaS)     │
    │                  │ ───────────────► │                     │
    │  sql.js (Wasm)   │                  │  Drizzle + Postgres │
    │.gitforprompts/db │ ◄─────────────── │  Neon / Postgres    │
    │  User's API key  │ gitforprompts pull│ Clerk Auth         │
    └──────────────────┘                  └─────────────────────┘
```

## 3. DATABASE SCHEMA

### Table: `versions`
```typescript
export const versions = pgTable("versions", {
  id: uuid("id").defaultRandom().primaryKey(),
  promptId: uuid("prompt_id").notNull().references(() => prompts.id, { onDelete: "cascade" }),
  versionNumber: integer("version_number").notNull(),
  content: text("content").notNull(),                    // plain prompt text (always populated)
  bundle: jsonb("bundle").$type<PromptBundle | null>(),  // full bundle payload
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

### Schema Invariants & Supporting Tables

1. **Circular Foreign Key Relationship**:
   - `prompts.currentVersionId` references `versions.id` with `onDelete: "set null"`.
   - `versions.promptId` references `prompts.id` with `onDelete: "cascade"`.
   - Initial prompt insertion creates the prompt row first, followed immediately by `versions` snapshot insertion and atomic pointer update within an advisory transaction.

2. **Table: `api_keys` (Zero Plaintext Storage)**:
   - `keyLookupHash`: `varchar(64)` with unique index — SHA-256 hash of the full secret key (`gfp_live_...`). Enables $O(1)$ constant-time lookup without exposing plaintext.
   - `keyPrefix`: `varchar(10)` — Plaintext prefix (`gfp_live_`) for UI identification.
   - `scopes`: `text[]` — Granular API scopes (`['prompts:read', 'prompts:write', 'versions:write']`).
   - `lastUsedAt`: `timestamp` — Throttled write invariant (updated at most once per 10-minute window per key to prevent write amplification).
   - `revokedAt`, `expiresAt`, `createdAt`: Soft-revocation and expiration timestamps.

3. **Supporting Tables**:
   - `test_cases`: Test criteria and input parameters tied to `prompts.id`.
   - `test_results`: Multi-model run outputs and scoring metrics.
   - `webhooks`: Endpoint URLs guarded by SSRF firewall with secret HMAC signing keys.

## 4. DEEP MODULE ARCHITECTURE & SEAMS

### Core Deep Modules
1. **`insertNextVersion`** — Advisory lock transaction, centralized version creation.
2. **`authenticateApiKey`** — Bearer auth, SHA-256 lookup, single-call API key validation.
3. **`fireWebhooks`** — Fire-and-forget HMAC-SHA256 webhook delivery.
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
   - SQLite adapter: `packages/cli/src/db/sqlite.ts` (sql.js Wasm, auto-increment versioning)

## 5. SYNC PROTOCOL (cloud ↔ local)

```text
gitforprompts push <prompt-name>
  1. Read local prompt + all versions from SQLite
  2. Authenticate via API key (gfp_live_* → SHA-256 lookup)
  3. POST /api/v1/prompts/:id/versions with bundle payload
  4. Server inserts via insertNextVersion (advisory lock)
  5. Webhook fires (version.created)

gitforprompts pull <prompt-name>
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
| 2026-08 | Bundle as single JSONB column | Cleaner diffs, simpler migrations, flexible schema evolution |
| 2026-08 | Dual-format support: `content` + `bundle` | Backwards compatibility and multi-modal template flexibility |
| 2026-08 | `@gfp/core` shared package | Pure TS engine shared by CLI (SQLite) and cloud (Postgres) |
| 2026-08 | `sql.js` (Wasm SQLite) for local | Zero native C++ compilation dependencies, runs identically on any OS |
| 2026-08 | User-provided API key for local evals | No key storage on our side. User controls their own provider. |
| 2026-08 | MIT license | Maximum adoption and community trust |
| 2026-09 | Speed Insights & Edge Caching | Removed RootLayout blocking auth, enabling sub-50ms TTFB static cache HIT |
| 2026-09 | Agentic Standards & MCP Discovery | Added Accept: text/markdown negotiation, public/llms.txt, and /api/v1/mcp endpoint |
| 2026-09 | Public Developer Portal & OpenAPI 3.1 | Interactive /developers portal with scoped OpenAPI 3.1 schema and CORS headers |
| 2026-10 | Module Decomposition & Ponytail Audit | Decomposed oversized files (>250 LOC) into focused single-responsibility modules |
| 2026-10 | Hermetic Zero-Mock Verification | 150/150 tests pass hermetically in CI without ambient external API keys |
| 2026-10 | Semantic Git History Curation | Curated 304 commits to 150 clean semantic commits matching engineering timeline |
