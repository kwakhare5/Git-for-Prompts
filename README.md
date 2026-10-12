<div align="center">

  <a href="https://gitforprompts.vercel.app">
    <img src="public/icon.svg" alt="Git for Prompts Logo" width="72" height="72" />
  </a>

  # Git for Prompts

  ### *The local-first prompt package manager. Version, diff, and evaluate your AI prompts.*

  <br/>

  ![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
  ![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
  ![Language](https://img.shields.io/badge/Language-TypeScript-blue?style=for-the-badge&logo=typescript&logoColor=white)
  ![Framework](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)
  ![Database](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white)

  <br/>

  <a href="#key-features">Features</a> &nbsp;·&nbsp;
  <a href="#getting-started">Quickstart</a> &nbsp;·&nbsp;
  <a href="#architecture">Architecture</a> &nbsp;·&nbsp;
  <a href="#testing">Testing</a> &nbsp;·&nbsp;
  <a href="#deployment">Deployment</a>

</div>

---

A local-first prompt package manager and version control system for AI engineering. Version, diff, evaluate, and deploy prompts like production code.

Git for Prompts (`gitforprompts`) treats prompt templates, hyperparameter configs, tools, and output schemas as immutable, versioned code units. Work completely offline with an in-process WebAssembly SQLite database, run regression evaluations in your terminal, and push to a collaborative cloud studio with transactional advisory locks.

## Key Features

- **Local-First SQLite Engine**: Work 100% offline. `npx gitforprompts init` provisions a WebAssembly-powered SQLite database in `.gitforprompts/` with zero native compilation dependencies.
- **Structured Prompt Bundles**: Versions track system prompts, user templates, variable interpolation (`{{var}}`), model parameters (provider, model, temperature, topP, maxTokens), tools, and response format schemas.
- **Monaco Diff Engine**: Visual side-by-side comparison with inline additions, deletions, variable highlights, and model config differences.
- **Automated Regression Evals**: Execute batch test cases against live models (Groq, OpenRouter, OpenAI, Anthropic, Ollama) and score responses against criteria.
- **Advisory-Locked Cloud Sync**: Synchronize local prompt snapshots with cloud PostgreSQL using transaction-level advisory locks (`pg_advisory_xact_lock`) to eliminate push collisions.
- **Zero Plaintext Key Storage**: Cloud API keys are stored as one-way SHA-256 hashes. Local CLI tests execute using your local shell environment variables.
- **Agent & MCP Ready**: Discoverable Model Context Protocol (MCP) server manifest at `/.well-known/mcp.json` and `/api/v1/mcp` for autonomous agents (Claude Desktop, Cursor).
- **HMAC-Signed Webhooks**: Fire-and-forget `version.created` payloads with HMAC-SHA256 signatures to trigger downstream deployment pipelines.

---

## Tech Stack

- **Framework**: Next.js 16.3.1 (Turbopack + App Router) + React 19.2.8 + TypeScript 6.0
- **Editor & UI**: Monaco Editor (`@monaco-editor/react`) + Tailwind CSS v4 + Lucide Icons
- **Database & ORM**: PostgreSQL 16 + Drizzle ORM (`drizzle-orm` 0.45.2, `drizzle-kit` 0.31.10)
- **Local CLI Database**: WebAssembly SQLite (`sql.js` 1.14.1)
- **Authentication**: Clerk (`@clerk/nextjs` 7.7.9)
- **Rate Limiting**: Upstash Redis (`@upstash/ratelimit`, `@upstash/redis`) with in-memory fallback
- **Monorepo Architecture**: pnpm workspaces (`@gfp/core` shared domain engine + `gitforprompts` CLI)
- **Testing**: Vitest 4.1.11 (real PostgreSQL integration tests, zero internal DB mocks) + Playwright

---

## Prerequisites

- **Node.js**: `v20.0.0` or higher (`v22.x` recommended)
- **Package Manager**: `pnpm` `v9.0.0` or higher (`v11.x` recommended)
- **PostgreSQL**: `v15` or higher running locally (or via Docker on port `5432`)
- **LLM API Key** (optional, for test runs): Groq or OpenRouter API key

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/kwakhare5/git-for-prompts.git
cd git-for-prompts
```

### 2. Install Workspace Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Copy the example configuration to `.env.local`:

```bash
cp .env.example .env.local
```

Configure your local database connection and auth keys:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/git_for_prompts"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
GROQ_API_KEY="gsk_..."
```

### 4. Start Local PostgreSQL Database

If you have Docker installed, start a container:

```bash
docker run -d \
  --name gfp-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=git_for_prompts \
  -p 5432:5432 \
  postgres:16-alpine
```

### 5. Apply Database Schema

Push the Drizzle schema directly to your PostgreSQL instance:

```bash
pnpm db:push
```

### 6. Build Shared Packages & Start Development Server

```bash
pnpm build
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Architecture

### Directory Structure

```
Git-for-Prompts/
├── packages/
│   ├── core/                        # @gfp/core: Domain bundle types, diff calculation, variable interpolation
│   └── cli/                         # gitforprompts CLI: sql.js WebAssembly SQLite repository, commands (init, add, run, diff, push, pull)
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── (dashboard)/             # Authenticated workspace: prompts, versions, test cases, diff, API keys, webhooks
│   │   ├── (landing)/               # High-contrast marketing homepage with real-time prompt editor preview
│   │   ├── about/, contact/, privacy/ # Static trust anchor pages & security disclosures
│   │   ├── developers/              # Public API documentation, CLI quickstart, & MCP instructions
│   │   └── api/                     # Edge & serverless API route handlers
│   │       ├── v1/prompts/          # REST endpoints: name resolution, prompt creation, latest snapshot, version commit
│   │       ├── v1/mcp/              # MCP Server manifest endpoint
│   │       └── cron/                # Scheduled regression tests handler
│   ├── components/
│   │   ├── domain/                  # Studio feature components: prompt-editor, compare-runner, test-runner, api-keys-manager
│   │   ├── layout/                  # Navbar, developer footer, dashboard sidebar, feedback modal
│   │   └── website/                 # Landing page sections, hero preview, bento grid, showcase
│   ├── db/                          # Drizzle ORM schema definitions and PostgreSQL connection client
│   └── lib/                         # Server actions, authentication guards, SSRF validator, rate limiting
├── public/                          # Static assets, llms.txt, openapi.json, .well-known/mcp.json
├── docker-compose.yml               # Production container configuration
└── vitest.config.ts                 # Vitest test runner configuration
```

### Request Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor User as Developer / Agent
    participant Web as Next.js Web / API (/api/v1)
    participant Auth as Clerk / API Key Auth
    participant SSRF as SSRF Firewall (ssrf.ts)
    participant DB as PostgreSQL (Drizzle ORM)
    participant Model as LLM Provider (Groq / OpenRouter)

    User->>Web: POST /api/v1/prompts/:id/versions (Commit Version)
    Web->>Auth: Assert getAuthUserId() / SHA-256 API Key
    Auth-->>Web: Authenticated UserId
    Web->>DB: Begin Transaction & pg_advisory_xact_lock(promptId)
    DB-->>Web: Lock Acquired
    Web->>DB: Insert new version (versionNumber = max + 1)
    Web->>DB: Update prompts.currentVersionId
    Web-->>User: 201 Created (Immutable version snapshot)
```

### Data Flow

```
Local CLI (.gitforprompts/ SQLite Wasm)
   │
   ├── npx gitforprompts add    → Writes version snapshot to local SQLite
   ├── npx gitforprompts run    → Executes test cases against local environment LLM keys
   └── npx gitforprompts push   → Serializes bundle and calls POST /api/v1/prompts/:id/versions
                                     │
                                     ▼
                               Cloud PostgreSQL (Advisory Transaction Lock)
                                     │
                                     ├── Serves GET /api/v1/prompts/:id/latest (Production API)
                                     └── Triggers HMAC-SHA256 webhooks to subscriber URLs
```

### Database Schema

```
prompts
├── id (uuid, PK)
├── name (varchar(255), unique per owner)
├── description (text)
├── owner_id (varchar(255), Clerk userId, indexed)
├── is_public (boolean, default: false)
├── current_version_id (uuid, FK → versions.id)
├── test_schedule (varchar(10), 'daily' | 'weekly' | null)
├── last_scheduled_test_at (timestamp)
├── created_at (timestamp)
└── updated_at (timestamp)

versions (Immutable snapshots)
├── id (uuid, PK)
├── prompt_id (uuid, FK → prompts.id, cascade)
├── version_number (integer, sequential 1, 2, 3...)
├── content (text, prompt string / user template)
├── bundle (jsonb, PromptBundle: systemPrompt, modelConfig, tools, responseFormat)
├── commit_message (varchar(500))
├── created_by (varchar(255), Clerk userId)
├── created_at (timestamp)
└── variables (text[], extracted {{var}} tags)

test_cases
├── id (uuid, PK)
├── prompt_id (uuid, FK → prompts.id, cascade)
├── name (varchar(255))
├── input_text (text, input payload)
├── expected_criteria (text, evaluation assertion rule)
└── created_at (timestamp)

test_results
├── id (uuid, PK)
├── version_id (uuid, FK → versions.id, cascade)
├── test_case_id (uuid, FK → test_cases.id, cascade)
├── passed (boolean)
├── actual_output (text)
├── score (integer 0-100)
└── run_at (timestamp)

api_keys
├── id (uuid, PK)
├── owner_id (varchar(255), Clerk userId)
├── name (varchar(255))
├── key_prefix (varchar(10), "gfp_live_")
├── key_lookup_hash (varchar(64), SHA-256 for O(1) query)
├── scopes (text[], ['prompts:read', 'prompts:write', 'versions:write'])
├── revoked_at (timestamp, soft deletion)
├── expires_at (timestamp, optional expiry)
├── last_used_at (timestamp)
└── created_at (timestamp)

webhooks
├── id (uuid, PK)
├── owner_id (varchar(255), Clerk userId)
├── prompt_id (uuid, nullable: null = global account events)
├── url (varchar(2048), SSRF validated)
├── secret_hash (varchar(64), SHA-256 HMAC secret hash)
├── label (varchar(255))
└── created_at (timestamp)
```

---

## Environment Variables

### Required

| Variable | Description | Example / Notes |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/git_for_prompts` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public authentication key | `pk_test_...` or `pk_live_...` |
| `CLERK_SECRET_KEY` | Clerk secret backend key | `sk_test_...` or `sk_live_...` |

### Optional

| Variable | Description | Default |
|---|---|---|
| `GROQ_API_KEY` | Groq LLM API key for automated test evaluations | — |
| `OPENROUTER_API_KEY` | OpenRouter LLM API key for multi-model comparisons | — |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL for distributed rate limiting | In-memory fallback if unset |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token | In-memory fallback if unset |
| `CRON_SECRET` | Secret token to authenticate scheduled cron triggers | — |
| `NEXT_PUBLIC_APP_URL` | Canonical URL of the web platform | `http://localhost:3000` |

---

## Available Scripts

| Command | Action |
|---|---|
| `pnpm dev` | Start local Next.js development server with Turbopack |
| `pnpm build` | Build `@gfp/core`, CLI package, and compile Next.js production build |
| `pnpm test` | Run complete Vitest suite (unit, BOLA security, and real DB integration) |
| `pnpm test:unit` | Run fast zero-network unit tests |
| `pnpm lint` | Run ESLint validation across the workspace |
| `pnpm db:push` | Push Drizzle schema changes directly to PostgreSQL |
| `pnpm db:studio` | Launch Drizzle Studio database viewer in browser |

---

## Testing

Git for Prompts enforces a strict zero-internal-mocking policy. Integration tests run directly against real database state in PostgreSQL to guarantee authorization guards, transaction advisory locks, and unique constraint invariants.

### Running Tests

```bash
# Run all 150 integration & unit tests
pnpm test

# Run tests in watch mode during development
pnpm test -- --watch

# Run a specific test suite
pnpm test src/lib/__tests__/authorization-bola.test.ts
```

### Test Organization

- `src/lib/__tests__/authorization-bola.test.ts`: Cross-tenant Broken Object Level Authorization (BOLA) security matrix verifying strict isolation across prompts, versions, API keys, test cases, and webhooks.
- `src/lib/__tests__/api-auth.test.ts`: SHA-256 API key authentication, scope permissions, and expiration validation against real PostgreSQL tables.
- `src/lib/__tests__/api-key-lifecycle.test.ts`: Real DB lifecycle testing verifying key generation caps (`MAX_ACTIVE_KEYS_PER_USER = 10`), soft revocation, and `lastUsedAt` throttling.
- `src/lib/__tests__/database-correctness.test.ts`: PostgreSQL transaction lock verification and prompt bundle JSONB preservation.
- `src/lib/__tests__/ssrf.test.ts`: SSRF defense testing blocking private IP subnets, loopbacks, AWS/GCP metadata endpoints (`169.254.169.254`), and malformed protocol schemes.
- `packages/core/src/__tests__/`: Unit tests for bundle schemas, template variable extraction (`{{var}}`), and semantic diff generation.

---

## Deployment

### Vercel (Production Cloud Platform)

1. Connect your repository to Vercel.
2. In Project Settings, set Build Command to `pnpm build`.
3. Add the required environment variables:
   - `DATABASE_URL`: Hosted PostgreSQL connection string (Supabase, Neon, or AWS RDS).
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` & `CLERK_SECRET_KEY`: Production Clerk keys (`pk_live_...`).
   - `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN`: Upstash Redis instance.
4. Deploy.

### Docker Self-Hosting

Deploy the complete stack (app + database) on your private server:

```bash
# Clone the repository
git clone https://github.com/kwakhare5/git-for-prompts.git
cd git-for-prompts

# Set environment variables
export NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_..."
export CLERK_SECRET_KEY="sk_live_..."

# Start containers
docker compose up -d
```

The application is accessible on port `3000`.

---

## Troubleshooting

### Database Connection Refused (`connect ECONNREFUSED 127.0.0.1:5432`)
Ensure your PostgreSQL instance is running:
```bash
docker ps -a
# If gfp-postgres is stopped:
docker start gfp-postgres
```

### Upstash Redis Rate Limiting Timeout
During offline local development or when Redis environment variables are unset, the system automatically falls back to an in-process memory map without failing user requests. For distributed multi-instance production environments, ensure `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are populated.

### Pending Schema Updates
If schema definitions diverge from database state:
```bash
pnpm db:push
```

---

## License

MIT © [Karan Wakhare](https://github.com/kwakhare5)
