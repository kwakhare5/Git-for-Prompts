# Stage 2G — Codebase Health Audit Report

## 1. Executive Summary
Conducted a thorough engineering-health audit across the entire Git-for-Prompts repository covering architecture, dead code, duplication, database performance, server/client boundaries, API key authentication, rate limiting, and memory management.

---

## 2. Comprehensive Inventory & Structural Audit

### Architecture Breakdown
- **Frontend & App Router**: Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + Radix UI + Monaco Editor. Server components used for main dashboard pages; client components scoped to interactive forms and editors (`prompt-editor.tsx`, `bundle-editor.tsx`, `test-runner.tsx`, `diff-viewer.tsx`).
- **Core Library (`packages/core`)**: Pure TypeScript workspace package containing prompt interpolation, variable extraction, AI evaluation helpers, diff algorithm, and bundle validation (`@gfp/core`). Zero Next.js or UI dependencies.
- **Backend & Database**: Next.js Server Actions (`src/lib/actions/*`) + REST API v1 routes (`src/app/api/v1/*`) + Drizzle ORM + PostgreSQL.
- **Authentication**: Clerk Auth for web UI (`src/lib/auth.ts`); SHA-256 indexed Bearer API Keys (`src/lib/api-auth.ts`) for public API.
- **Security Engine**: Pre-flight DNS validation + private IP blocking + native TLS SNI preservation (`src/lib/security/ssrf.ts`).

---

## 3. Detailed Audit Findings (Phases 2 – 19)

### A. Rate Limiting Architecture & Outage Policy (Phase 6)
- **Finding**: `src/lib/rate-limit.ts` initialized a single Upstash Ratelimit instance with `60, '1 m'` for all keys. Calling `checkRateLimit('expensive:' + keyId)` inside `POST /api/v1/prompts/[id]/versions` was supposed to enforce a stricter 20 req/min limit, but actually ran against the 60 req/min window.
- **Recommendation**: Introduce a separate `expensiveLimiter` (20 req/min) in `src/lib/rate-limit.ts` when prefix starts with `expensive:`.

### B. Memory / Resource Health (Phase 13)
- **Finding**: In-process fallback limiter (`inProcessCounts` Map in `src/lib/rate-limit.ts`) retains expired keys indefinitely if those specific keys/IPs are never re-accessed.
- **Recommendation**: Add a lightweight sweep to clean up expired Map entries whenever `inProcessCounts.size > 500`.

### C. API Key Scope Consistency & Enforcement (Phase 5)
- **Finding**: `GET /api/v1/prompts` and `POST /api/v1/prompts` in `src/app/api/v1/prompts/route.ts` did not pass required scope parameters to `authenticateApiKey()`, leaving `prompts:write` unenforced. They also contained duplicate manual `lastUsedAt` writes.
- **Recommendation**: Pass `'prompts:read'` to `GET /api/v1/prompts` and `'prompts:write'` to `POST /api/v1/prompts`, and remove redundant manual `lastUsedAt` updates.

### D. Dead Code & YAGNI Audit (Phases 2 & 4)
- **Finding**: The codebase is lean and well-maintained overall. All top-level dependencies in `package.json` are actively imported. No unused React components or abandoned experimental abstractions exist.
- **Recommendation**: Maintain strict YAGNI principles—do NOT add generic abstractions, repository layers, or complex event buses.

### E. Security Preservation (Phase 18)
- **Finding**: Auth fail-closed policy, BOLA user-ownership verification, SSRF DNS pre-flight checks, and transaction advisory locks are fully working and well-tested.
- **Recommendation**: Preserved without modification.

---

## 4. Proposed Conservative Plan
1. **Fix Rate Limiter Quota Mismatch**: Configure dedicated 20 req/min limiter for `expensive:` operations in `src/lib/rate-limit.ts`.
2. **Fix In-Process Rate Limiter Memory Leak**: Add auto-cleanup of expired entries in `inProcessCounts` Map.
3. **Harmonize API Key Scopes**: Enforce `prompts:read` on `GET /api/v1/prompts` and `prompts:write` on `POST /api/v1/prompts`, and remove duplicate `lastUsedAt` write calls.
4. **Update Documentation**: Synchronize test count metrics in documentation to match live Vitest runner output (132 passed).
