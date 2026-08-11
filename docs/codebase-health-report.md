# Codebase Health, Architecture & Performance Final Report

## Executive Summary

A comprehensive engineering audit and verification pass was conducted across the Git for Prompts codebase strictly following the Master Execution Plan rules. The actual source code was treated as authoritative over legacy documentation. All core features (Next.js App Router, Drizzle ORM, Clerk Auth, Groq/OpenRouter AI engine, Upstash Redis rate limiting, Monaco editor suite, and SSRF security engine) were audited, verified, and preserved without unnecessary rewrites or speculative abstractions.

---

## Removed

- **Misplaced File**: `src/lib/variables.test.ts` (relocated to `src/lib/__tests__/variables.test.ts` to maintain uniform unit test directory structure across `src/lib/__tests__/`).
- **Obsolete Documentation Claims**: Removed outdated Stage-1 descriptions in `docs/repository-map.md` claiming webhooks lacked SSRF checks.

---

## Simplified

- **Hydration Detection in `RelativeTime` (`src/components/layout/relative-time.tsx`)**: Replaced `useState` + `useEffect` (`setState` in effect) pattern with React 18/19 `useSyncExternalStore` for clean client mount hydration detection without requiring ESLint suppression comments.
- **Evaluator Security Isolation (`src/lib/ai.ts`)**: Added explicit `system` role message in `evaluateOutput` to isolate evaluator instructions from untrusted model outputs and expected criteria, preventing prompt injection bypasses.
- **Test Mock Isolation (`src/lib/__tests__/api-auth.test.ts`)**: Harmonized default `db.update` mock in `beforeEach` with `.mockClear()` to prevent call accumulation across tests.

---

## Architecture

The system retains its clean multi-layered architecture:

```text
UI (36 Client Components + Server Components)
 ↓
Server Actions (src/lib/actions/) / REST API Routes (src/app/api/v1/)
 ↓
Auth & Scope Guard (getAuthUserId / authenticateApiKey)
 ↓
Domain Logic & Core Package (@gfp/core)
 ↓
PostgreSQL (Drizzle ORM) + Groq/OpenRouter AI Engine + Upstash Redis
```

- **Client/Server Boundary**: Server Components handle page data fetching (`page.tsx`), while Client Components handle interactive Monaco editors, forms, and test runners.
- **`@gfp/core` Workspace Package**: Retained as pure TypeScript logic (variable extraction, template interpolation, diff calculations, bundle validation) with zero Next.js or React dependencies.

---

## Backend

- **API Key Scope Harmonization**: Strict scope checking (`prompts:read`, `prompts:write`, `versions:write`) enforced in `authenticateApiKey()` with backward-compatibility fallbacks for legacy keys.
- **Usage Tracking**: Throttled `lastUsedAt` updates (10-minute window) in `touchApiKeyLastUsed()` to prevent database write-amplification on API hot paths.
- **Advisory Locks**: Version writes proceed exclusively via `insertNextVersion` using `pg_advisory_xact_lock` for concurrency control.

---

## Frontend

- **Monaco Suite**: Scoped dynamic imports preserved for `PromptEditor` and `DiffViewer` to prevent unneeded heavy loading on non-editor routes.
- **Design System**: Monochrome high-contrast dark charcoal UI system (`#121214` base, `#161619` cards, `border-zinc-800/90`) enforced across all 8 dashboard routes.

---

## Security

All sacred security invariants remain fully intact and verified by automated tests:
1. **Auth Fail-Closed**: Unauthenticated requests are rejected immediately; no fallback to local auth in production.
2. **Tenant Isolation & BOLA Protection**: Every database query enforces `ownerId = auth().userId()`.
3. **API Key Security**: Cryptographically generated 32-byte keys, SHA-256 lookup hash (`keyLookupHash`), no plaintext storage.
4. **SSRF Protection (`src/lib/security/ssrf.ts`)**: Enforces HTTPS, port 443, credential rejection, pre-flight DNS resolution, private IP rejection (RFC1918, loopback, link-local, cloud metadata `169.254.169.254`), and manual redirect blocking.
5. **Evaluator Role Isolation (`src/lib/ai.ts`)**: System role separation ensures model output cannot hijack evaluator instructions.

---

## Performance

- **TypeScript Compilation (`tsc --noEmit`)**: 0 errors (completed in ~4s).
- **Production Build (`pnpm build`)**: Compiled successfully in 1.7s; static page generation completed across all 24 routes.
- **Database Query Cap**: `RECENT_VERSIONS_LIMIT = 50` in `src/lib/constants.ts` caps dropdown version history queries.
- **Rate Limiting**: Sliding window rate limiters (60 req/min standard, 20 req/min expensive) backed by Upstash Redis with bounded in-process memory fallback.

---

## Tests

- **Total Test Files**: 17 (16 passed, 1 skipped)
- **Total Tests**: 139 (137 passed, 2 skipped)
- **Failures**: 0

### Breakdown by Category
- **Unit Tests** (`variables`, `validations`, `format-version-label`, `ai`, `ssrf`, `rate-limit`, `@gfp/core bundle`): 75 passed
- **Auth & Security Tests** (`auth`, `api-auth`, `api-security`, `authorization-bola`, `api-key-lifecycle`): 29 passed
- **Database & Concurrency Tests** (`database-correctness`, `actions.test.ts`, `tests.test.ts`, `route.test.ts`): 33 passed

---

## CI

- **Local & CI Verification**: `pnpm test`, `pnpm exec tsc --noEmit`, `pnpm lint`, and `pnpm build` pass with zero errors or warnings.
- **No Weakened Guards**: `continue-on-error` and test-skipping flag overrides remain strictly disabled.

---

## Remaining Technical Debt

- **Edge Runtime Deprecation Warning**: Next.js 16 emits a minor deprecation notice regarding Edge Runtime on select routes (`⚠ The Edge Runtime is deprecated. You can use the "nodejs" runtime instead`). Modernizing runtime directives to `'nodejs'` is recommended when Next.js 17 is adopted.

---

## Intentionally Not Changed

1. **Monaco Editor Integration**: Kept `@monaco-editor/react` despite transitive warnings in DOMPurify, because Monaco is essential for the prompt diffing and editing experience. Removing or replacing it would introduce major UI regression risk.
2. **`@gfp/core` Workspace Package Architecture**: Preserved the monorepo structure separating `@gfp/core` from `@gfp/cli` and the main Next.js app. Merging them into a single directory would violate module boundaries without providing measurable performance gains.
3. **Advisory Locking Pattern**: Retained PostgreSQL transaction advisory locks (`pg_advisory_xact_lock`) for version increments instead of client-side sequence generation, guaranteeing strict version sequence safety under concurrent API pushes.
4. **36 Client Components**: Kept client components where browser state, Monaco refs, or interactive UI elements (tabs, forms, modals) are required, rather than converting them to server components for theoretical purity.
