# Stage 5 — Performance Baseline Reality Check Report

## Executive Summary

Phase A established a fresh, empirical baseline for Git for Prompts at Git commit `5d71dd4`. All commands were executed locally without altering application behavior.

---

## 1. Baseline System Metrics

- **Git Commit SHA**: `5d71dd4`
- **Node.js Environment**: v20.x
- **Package Manager**: `pnpm` v11.20.0
- **Database Engine**: PostgreSQL 15 (Supabase + Drizzle ORM)

---

## 2. Command Execution Baseline

| Command | Status | Duration / Output | Details |
| :--- | :--- | :--- | :--- |
| `pnpm exec tsc --noEmit` | **PASS** | 3.6s | 0 TypeScript errors |
| `pnpm lint` | **PASS** | 7.3s | 0 ESLint errors / 0 warnings |
| `pnpm test` | **PASS** | 5.25s | 137 passed, 2 skipped across 16 files (139 total) |
| `pnpm build` | **PASS** | 1.137s compile time | Static page generation across 24 app routes |
| `pnpm audit` | **FAIL (Expected)** | 29 advisories (6 low, 16 moderate, 7 high) | Transitive DOMPurify inside `@monaco-editor/react` |

---

## 3. Database & Query Baseline

- **Advisory Locks**: `pg_advisory_xact_lock` enforced in version saves (`src/lib/actions/versions.ts:132`).
- **Version Query Limit**: `RECENT_VERSIONS_LIMIT = 50` in `src/lib/constants.ts`.
- **API Key Lookup**: SHA-256 hash lookup via `keyLookupHash` with throttled `touchApiKeyLastUsed` updates.

---

## 4. Protected Invariants Inventory

All Stage 2 & Stage 4 invariants are recorded and protected:
1. **Auth Fail-Closed**: `getAuthUserId()` in `src/lib/auth.ts` rejects unauthenticated production calls.
2. **Tenant Isolation**: Every database read/write checks `ownerId = auth().userId()`.
3. **API Key Security**: Cryptographic 32-byte key generation, SHA-256 hash lookup, scopes, soft revocation.
4. **SSRF Webhook Protection**: Pre-flight DNS resolution, private IP rejection (RFC1918, loopback, cloud metadata), HTTPS enforcement.
5. **Advisory Version Locks**: Version sequence numbers auto-increment without collisions via transaction advisory locks.
6. **AI Evaluator Role Isolation**: System prompt role separation insulates evaluator control instructions from untrusted model outputs.

---

## Baseline Verdict
Phase A complete. Baseline established at `5d71dd4`. Proceeding to Phase B Database & Backend Audit.
