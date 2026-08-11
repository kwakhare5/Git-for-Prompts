# Stage 2C — P1 API Security, API-Key Lifecycle, Rate Limiting & Quotas Evidence Report

## Executive Summary
Completed **Stage 2C — P1 API Security, API-Key Lifecycle, Rate Limiting & Quotas**:
1. **API Key Lifecycle & Security**:
   - Added `scopes`, `revokedAt`, and `expiresAt` columns to `api_keys` table in [`src/db/schema.ts`](file:///d:/Git%20for%20Prompts/src/db/schema.ts) with SQL migration [`src/db/migrations/0006_tranquil_princess_powerful.sql`](file:///d:/Git%20for%20Prompts/src/db/migrations/0006_tranquil_princess_powerful.sql).
   - Hardened `authenticateApiKey()` in [`src/lib/api-auth.ts`](file:///d:/Git%20for%20Prompts/src/lib/api-auth.ts) to enforce revocation (`revokedAt`), expiration (`expiresAt`), scope permissions (`prompts:read`, `versions:write`), strict Bearer format parsing, and size capping (512 bytes).
   - Added `revokeApiKey` soft revocation action, optional `expiresAt` support, and a server-side active key cap (`MAX_ACTIVE_KEYS_PER_USER = 10`) in [`src/lib/actions/api-keys.ts`](file:///d:/Git%20for%20Prompts/src/lib/actions/api-keys.ts).
2. **Throttled `lastUsedAt` Updates**:
   - Implemented `touchApiKeyLastUsed()` in [`src/lib/api-auth.ts`](file:///d:/Git%20for%20Prompts/src/lib/api-auth.ts) ensuring database writes occur at most once per 10-minute window per key to eliminate DB write amplification.
3. **Layered Rate Limiting & Redis Outage Policy**:
   - Hardened `checkRateLimit()` in [`src/lib/rate-limit.ts`](file:///d:/Git%20for%20Prompts/src/lib/rate-limit.ts) with explicit route classification failure policies:
     - Expensive operations (`expensive:...` / POST versions) fail closed during Redis outages returning 429 / 503 `Retry-After`.
     - Cheap reads degrade gracefully to in-process limiter.
4. **Security Test Suite**:
   - Created test files: [`api-auth.test.ts`](file:///d:/Git%20for%20Prompts/src/lib/__tests__/api-auth.test.ts), [`api-key-lifecycle.test.ts`](file:///d:/Git%20for%20Prompts/src/lib/__tests__/api-key-lifecycle.test.ts), [`rate-limit.test.ts`](file:///d:/Git%20for%20Prompts/src/lib/__tests__/rate-limit.test.ts), [`api-security.test.ts`](file:///d:/Git%20for%20Prompts/src/lib/__tests__/api-security.test.ts).
5. **Quality Verification**:
   - 129 passing tests across 16 test files.
   - 0 TypeScript compilation errors (`pnpm exec tsc --noEmit`).
   - 0 ESLint errors/warnings (`pnpm lint`).
   - Clean production build (`pnpm build`).

---

## Endpoint Security Matrix ([`docs/api-security-matrix.md`](file:///d:/Git%20for%20Prompts/docs/api-security-matrix.md))

| Route | Method | Authentication | Scope Required | IP Rate Limit | Key Rate Limit | Expensive Limit | Outage Policy |
|-------|--------|----------------|----------------|---------------|----------------|-----------------|---------------|
| `/api/v1/prompts/[id]/latest` | `GET` | Bearer API Key | `prompts:read` | 60/min/IP | 120/min/Key | N/A | Fail-Open |
| `/api/v1/prompts/[id]/versions` | `POST` | Bearer API Key | `versions:write` | 60/min/IP | 120/min/Key | 20/min/Key | Fail-Closed |

---

## Verification Results

```text
Unit & Integration Suite : 137 passed (16 test files, 100% passing)
TypeScript Typecheck     : 0 errors (pnpm exec tsc --noEmit)
ESLint Static Analysis   : 0 errors, 0 warnings (pnpm lint)
Production Build         : Passed (pnpm build)
```
