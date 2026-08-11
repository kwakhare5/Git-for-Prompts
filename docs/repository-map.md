# Repository Map — Git for Prompts

Architectural inventory of entry points, data access, authentication, external network interfaces, secrets, client/server boundaries, and security-critical primitives.

---

## 1. Entry Points

### Next.js Route Pages (UI)
| Route Path | Component Type | Access Level | Description |
|------------|----------------|--------------|-------------|
| `/` | Server Component | Public | Marketing landing page & hero demo replica |
| `/(landing)/explore/` | Server Component + Client | Public | Public prompt discovery gallery |
| `/(landing)/explore/[id]/` | Server Component | Public | Public prompt detail view |
| `/(auth)/sign-in/` | Client Component | Public | Clerk authentication sign-in canvas |
| `/(auth)/sign-up/` | Client Component | Public | Clerk authentication sign-up canvas |
| `/(dashboard)/dashboard/` | Server Component | Clerk Session | Workspace prompt listing & metrics dashboard |
| `/(dashboard)/dashboard/new/` | Server Component + Client | Clerk Session | Interactive prompt creation form |
| `/(dashboard)/dashboard/prompts/[id]/` | Server Component + Client | Owner / Clerk Session | Prompt detail view & version timeline |
| `/(dashboard)/dashboard/prompts/[id]/edit/` | Server Component + Client | Owner / Clerk Session | Monaco prompt & bundle editor studio |
| `/(dashboard)/dashboard/prompts/[id]/diff/` | Server Component + Client | Owner / Clerk Session | Monaco version diff viewer |
| `/(dashboard)/dashboard/prompts/[id]/compare/` | Server Component + Client | Owner / Clerk Session | Side-by-side A/B execution runner |
| `/(dashboard)/dashboard/prompts/[id]/tests/` | Server Component + Client | Owner / Clerk Session | Evaluation suite runner & test manager |
| `/(dashboard)/dashboard/explore/` | Server Component + Client | Clerk Session | Workspace explore view (dashboard iframe wrapper) |
| `/(dashboard)/dashboard/api-keys/` | Server Component + Client | Owner / Clerk Session | API key generation & revocation management |
| `/(dashboard)/dashboard/webhooks/` | Server Component + Client | Owner / Clerk Session | Webhook destination management |

### REST & Public API Routes (`src/app/api/`)
| Route | Method | Auth Scheme | Description |
|-------|--------|-------------|-------------|
| `/api/v1/prompts/` | GET | API Key (`Bearer gfp_live_*`) | List authenticated user's prompts |
| `/api/v1/prompts/[id]/latest/` | GET | API Key (`Bearer gfp_live_*`) | Fetch latest version & interpolated variables |
| `/api/v1/prompts/[id]/versions/` | POST | API Key (`Bearer gfp_live_*`) | Push new immutable version (advisory lock) |
| `/api/status/` | GET | None | Health check & environment status endpoint |
| `/api/cron/regression-tests/` | GET | Cron Secret (`Authorization: Bearer CRON_SECRET`) | Automated daily/weekly regression test runner |
| `/api/cron/keep-alive/` | GET | None | Database connection ping/keep-alive |

### Server Actions (`src/lib/actions/`)
| File | Action Function | Auth Requirement | Description |
|------|-----------------|------------------|-------------|
| `prompts.ts` | `createPromptAction` | `getAuthUserId()` | Insert new prompt + initial version 1 |
| `prompts.ts` | `updatePromptMetadataAction` | `getAuthUserId()` + Owner | Update prompt name/description/schedule |
| `prompts.ts` | `deletePromptAction` | `getAuthUserId()` + Owner | Delete prompt & cascade versions/tests |
| `prompts.ts` | `forkPromptAction` | `getAuthUserId()` | Fork public prompt to private account |
| `versions.ts` | `createVersionAction` | `getAuthUserId()` + Owner | Atomic insert of next version via `insertNextVersion` |
| `versions.ts` | `restoreVersionAction` | `getAuthUserId()` + Owner | Restore previous version as new top version |
| `tests.ts` | `createTestCaseAction` | `getAuthUserId()` + Owner | Create single eval test case |
| `tests.ts` | `runTestsForVersionAction` | `getAuthUserId()` + Owner | Run evaluation tests against Groq/OpenRouter |
| `tests.ts` | `deleteTestCaseAction` | `getAuthUserId()` + Owner | Delete single test case |
| `api-keys.ts` | `createApiKeyAction` | `getAuthUserId()` | Generate random 32-byte key, return raw once |
| `api-keys.ts` | `revokeApiKeyAction` | `getAuthUserId()` + Owner | Revoke API key by ID |
| `webhooks.ts` | `createWebhookAction` | `getAuthUserId()` | Save webhook destination with HMAC secret |
| `webhooks.ts` | `deleteWebhookAction` | `getAuthUserId()` + Owner | Remove webhook destination |

---

## 2. Data Access & Persistence Layer

- **ORM**: Drizzle ORM (`drizzle-orm` v0.45.2) with `postgres` client driver.
- **Database Schema** (`src/db/schema.ts`):
  - `prompts`: `id` (uuid), `name`, `description`, `ownerId`, `isPublic`, `currentVersionId`, `testSchedule`, `lastScheduledTestAt`.
  - `versions`: `id` (uuid), `promptId` (FK -> prompts), `versionNumber`, `content`, `bundle` (jsonb), `commitMessage`, `createdBy`, `variables` (text[]).
  - `test_cases`: `id` (uuid), `promptId` (FK -> prompts), `name`, `inputText`, `expectedCriteria`.
  - `test_results`: `id` (uuid), `versionId` (FK -> versions), `testCaseId` (FK -> testCases), `passed`, `actualOutput`, `score`, `runAt`.
  - `api_keys`: `id` (uuid), `ownerId`, `name`, `keyHash`, `keyLookupHash`, `keyPrefix`, `lastUsedAt`.
  - `webhooks`: `id` (uuid), `ownerId`, `promptId` (nullable FK -> prompts), `url`, `secretHash`, `label`.

---

## 3. Authentication & Authorization Boundaries

- **Middleware** (`src/proxy.ts`): Wraps Next.js routes with Clerk `clerkMiddleware`. Dashboard paths require `auth.protect()`.
- **Session Auth Helper** (`src/lib/auth.ts`): Calls `@clerk/nextjs/server` `auth()`. Contains local dev fallback to `'user_local_dev'` when Clerk environment variables are absent.
- **API Key Authentication** (`src/lib/api-auth.ts`): Parses `Authorization: Bearer gfp_live_*`, hashes key via `sha256`, and queries `api_keys` by `keyLookupHash`.

---

## 4. External Network Interfaces

- **AI Provider Integrations** (`src/lib/ai.ts`):
  - Primary Provider: Groq API (`https://api.groq.com/openai/v1/chat/completions`)
  - Secondary Provider: OpenRouter API (`https://openrouter.ai/api/v1/chat/completions`)
- **Webhook Dispatch** (`src/lib/webhooks.ts`):
  - Dispatches HTTP POST to user-provided webhook URLs on version insertion.
  - Computes HMAC-SHA256 signature in header `X-GFP-Signature`.
- **OpenGraph Image Proxy** (`src/app/opengraph-image.tsx`):
  - Calls external screenshot API endpoint for dynamic social preview images.

---

## 5. Environment Secrets & Credentials

| Secret Key | Tier / Scope | Purpose | Leakage Prevention |
|------------|--------------|---------|--------------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Public / Client | Clerk Frontend SDK initialization | Embedded in client bundle |
| `CLERK_SECRET_KEY` | Private / Server | Clerk Backend API authentication | Server-only, strict guard |
| `GROQ_API_KEY` | Private / Server | Groq LLM API invocation | Server-only, executed in Server Actions |
| `OPENROUTER_API_KEY` | Private / Server | OpenRouter LLM API invocation | Server-only, executed in Server Actions |
| `UPSTASH_REDIS_REST_URL` | Private / Server | Redis rate limiting backend | Server-only |
| `UPSTASH_REDIS_REST_TOKEN` | Private / Server | Redis rate limiting auth token | Server-only |
| `DATABASE_URL` | Private / Server | Postgres connection string | Server-only |
| `CRON_SECRET` | Private / Server | Bearer token authorization for cron routes | Server-only |

---

## 6. Client / Server Boundaries

- **Client Component Density**: 36 components feature `'use client'`. Monaco editor wrappers (`prompt-editor.tsx`, `diff-viewer.tsx`), interactive forms, and evaluation runner hooks execute in browser.
- **Server Component Layer**: Page routes (`page.tsx`) perform initial DB queries via Drizzle and pass typed props down to Client Components.
- **Server Actions Layer**: All database mutations (`src/lib/actions/`) use `'use server'`.

---

## 7. Security-Sensitive & Dangerous Primitives Check

- `dangerouslySetInnerHTML`: **0 instances** found across codebase.
- `eval()` / `new Function()`: **0 instances** found.
- Shell execution (`child_process`, `exec`, `spawn`): **0 instances** found in application code.
- Dynamic `fetch()` targets: Webhook delivery in `src/lib/webhooks.ts` executes validated HTTPS targets after passing strict DNS resolution, private IP rejection (RFC1918, loopback, cloud metadata), and credential checks via `src/lib/security/ssrf.ts`.
