# Git for Prompts — Current-Product Capability Map

## Executive Summary

This document represents an evidence-grounded capability inventory of **Git for Prompts** generated directly from the source tree on `main` at commit `e5210a0`. Zero application code changes were made during this inventory pass.

---

## 1. Core Data Model & Relational Schema

Ground-truth database tables defined in [schema.ts](file:///d:/Git%20for%20Prompts/src/db/schema.ts):

| Entity / Table | Primary Key | Description & Key Columns | Constraints & Indexes |
| :--- | :--- | :--- | :--- |
| **`prompts`** | UUID `id` | Metadata container for prompt repositories (`name`, `description`, `ownerId` [Clerk user ID], `isPublic`, `currentVersionId`, `testSchedule` [`daily` \| `weekly`]). | `uniqueIndex(ownerId, name)` (names unique per owner); `index(isPublic)` for explore gallery. |
| **`versions`** | UUID `id` | Immutable commit snapshots (`promptId`, `versionNumber` [1, 2, 3...], `content` [raw text], `bundle` [`PromptBundle` JSON], `commitMessage`, `createdBy`, `variables` [`text[]`]). | `uniqueIndex(promptId, versionNumber)`; cascade deletion from `prompts`. |
| **`test_cases`** | UUID `id` | Test definitions for evaluation (`promptId`, `name`, `inputText`, `expectedCriteria`). | `index(promptId)`; cascade deletion from `prompts`. |
| **`test_results`** | UUID `id` | Evaluation execution log (`versionId`, `testCaseId`, `passed` [boolean], `actualOutput`, `score` [0–100], `runAt`). | `uniqueIndex(versionId, testCaseId)` enables upsert logic on test re-runs. |
| **`api_keys`** | UUID `id` | External developer access tokens (`ownerId`, `name`, `keyLookupHash` [SHA-256], `keyPrefix`, `scopes` [`text[]`], `revokedAt`, `expiresAt`, `lastUsedAt`). | `uniqueIndex(keyLookupHash)`. |
| **`webhooks`** | UUID `id` | Real-time event notifications (`ownerId`, `url`, `secret`, `events` [`text[]`], `createdAt`). | `index(ownerId)`. |

---

## 2. Authentication & Multi-Tenant Authorization

- **Provider**: Integrated with Clerk Auth (`@clerk/nextjs`).
- **Fail-Closed Security**: `getAuthUserId()` ([auth.ts](file:///d:/Git%20for%20Prompts/src/lib/auth.ts)) enforces session validation in production (`NODE_ENV === 'production'`). Unauthenticated requests yield `null`.
- **BOLA Protection**: All database queries inside Server Actions ([prompts.ts](file:///d:/Git%20for%20Prompts/src/lib/actions/prompts.ts), [versions.ts](file:///d:/Git%20for%20Prompts/src/lib/actions/versions.ts), [tests.ts](file:///d:/Git%20for%20Prompts/src/lib/actions/tests.ts)) strictly enforce `eq(prompts.ownerId, userId)`.

---

## 3. Studio Prompt Editing & Versioning Engine

- **Format Support**: Supports both V1 (legacy string prompt) and V2 (`PromptBundle` JSON specification from `@gfp/core`).
- **Monaco Editor Integration**: Custom syntax highlighting theme `gfp-dark` in `PromptEditor.tsx` with dynamic fallback loading.
- **Concurrency & Locking**: Version creation in `createVersion` ([versions.ts](file:///d:/Git%20for%20Prompts/src/lib/actions/versions.ts)) invokes PostgreSQL `pg_advisory_xact_lock` to guarantee gapless, collision-free integer version sequences (`1, 2, 3...`).
- **Unsaved Changes Guard**: `beforeunload` listener triggers native browser alert if `isDirty === true`.
- **Variable Parsing**: Auto-extracts `{{variable}}` placeholders into `versions.variables` array via regex parser.

---

## 4. AI Testing & Evaluation Suite

- **LLM Evaluator Provider**: Integrates with Groq (`groq-sdk`) and OpenRouter (`@openrouter/ai-sdk-provider`) in `src/lib/ai.ts`.
- **Evaluator Role Isolation**: Evaluator instructions are passed in `messages[0]` with `role: 'system'` to insulate control prompts from untrusted model outputs.
- **Depth-Tracking JSON Parser**: Robust `extractJson` parser extracts structured evaluation decisions (`{ passed: boolean, score: number, actualOutput: string }`) from model responses.
- **Parallel Runner**: `runComparisonForVersions` parallelizes test evaluation calls using `Promise.all`.

---

## 5. Diff & Comparison Engine

- **Diff Viewer**: Side-by-side Monaco diff model comparison (`DiffViewer.tsx`) between any two versions of a prompt. Single-version prompts render a dedicated empty state card.
- **A/B Compare Runner**: Interactive runner ([CompareRunner.tsx](file:///d:/Git%20for%20Prompts/src/components/domain/diff/compare-runner.tsx)) compares any two prompt versions side-by-side against a test suite in real time, rendering pass/fail progress bars, score cards, and winner banners.

---

## 6. External Developer API & Webhook Infrastructure

- **Public API Route**: `GET /api/v1/prompts/[id]/latest` ([route.ts](file:///d:/Git%20for%20Prompts/src/app/api/v1/prompts/%5Bid%5D/latest/route.ts)) returns the current prompt version for integration into customer LLM pipelines.
- **API Key Security**: Keys use `gfp_live_` prefixes, 32-byte secret entropy, SHA-256 lookup hashes, non-blocking 10-minute throttled `lastUsedAt` updates, and scope enforcement (`prompts:read`, `versions:write`).
- **Webhook Delivery Engine**: [webhooks.ts](file:///d:/Git%20for%20Prompts/src/lib/webhooks.ts) dispatches HMAC-SHA256 signed payloads on version creation events.
- **SSRF Validation**: [ssrf.ts](file:///d:/Git%20for%20Prompts/src/lib/security/ssrf.ts) resolves DNS pre-flight and blocks private IP ranges (RFC1918, loopback, cloud metadata `169.254.169.254`), non-HTTPS schemes, and non-443 ports.

---

## 7. Public Explore Gallery & Forking System

- **Public Gallery**: `/explore` lists public prompts (`isPublic = true`) with search filters.
- **Fork Engine**: `forkPrompt` Server Action duplicates prompt metadata and latest version snapshot under the requesting user's `ownerId` namespace.

---

## 8. Cron Subsystem & Automated Regression Suite

- **Scheduled Tests Endpoint**: `/api/cron/regression-tests` executes automated test suites for prompts with `testSchedule` set to `daily` or `weekly`.
- **Keep-Alive Endpoint**: `/api/cron/keep-alive` maintains database connection warmth.

---

## 9. Capability Summary Matrix

| Product Subsystem | Production Readiness Status | Primary File Reference |
| :--- | :--- | :--- |
| **Authentication & Auth Security** | Ready (Fail-closed) | `src/lib/auth.ts` |
| **Prompt Repository CRUD** | Ready (BOLA protected) | `src/lib/actions/prompts.ts` |
| **Version History & Locking** | Ready (PG Advisory Locks) | `src/lib/actions/versions.ts` |
| **Monaco Studio Editor** | Ready (V1/V2 bundle support) | `src/components/domain/prompts/prompt-editor.tsx` |
| **Diff Viewer** | Ready (Monaco side-by-side) | `src/components/domain/diff/diff-viewer.tsx` |
| **A/B Compare Runner** | Ready (Dark theme aligned) | `src/components/domain/diff/compare-runner.tsx` |
| **AI Evaluation Engine** | Ready (Groq/OpenRouter) | `src/lib/ai.ts` |
| **API Keys Management** | Ready (SHA-256 lookup) | `src/lib/api-auth.ts` |
| **Webhooks SSRF Engine** | Ready (DNS pre-flight validation) | `src/lib/security/ssrf.ts` |
| **Public Explore & Forking** | Ready | `src/app/(website)/explore/page.tsx` |

---

## 10. Conclusion

The current product baseline is feature-complete for core prompt versioning, side-by-side testing, AI evaluation, and developer API delivery.
