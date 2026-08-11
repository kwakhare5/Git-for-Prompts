# Backend Audit Baseline — Git for Prompts

Quality, correctness, security, dependency, and compliance audit baseline.

---

## 1. Test Suite Execution Baseline

- **Runner**: Vitest v4.1.10
- **Total Test Files**: 8 passed (8)
- **Total Individual Tests**: 88 passed (88)
- **Execution Duration**: 7.43 seconds
- **Test Modules Verified**:
  - `src/lib/__tests__/format-version-label.test.ts` (3 tests)
  - `packages/core/src/__tests__/bundle.test.ts` (7 tests)
  - `src/lib/variables.test.ts` (20 tests)
  - `src/lib/__tests__/ai.test.ts` (11 tests)
  - `src/lib/__tests__/validations.test.ts` (16 tests)
  - `src/app/api/v1/prompts/[id]/latest/route.test.ts` (5 tests)
  - `src/lib/actions/__tests__/tests.test.ts` (16 tests)
  - `src/lib/actions/__tests__/actions.test.ts` (10 tests)

---

## 2. Static Analysis & Type Safety Baseline

- **TypeScript Typecheck (`tsc --noEmit`)**: 0 errors.
- **ESLint Analysis (`pnpm lint`)**: 0 errors, 0 warnings.

---

## 3. Dependency Vulnerability Audit (`pnpm audit`)

- **Audit Result**: Exit code 1 (29 vulnerabilities detected)
- **Vulnerability Breakdown**:
  - **Low**: 6
  - **Moderate**: 16
  - **High**: 7
- **Primary Source**: Transitive dependency `dompurify` (via `@monaco-editor/react -> monaco-editor -> dompurify`).
  - High advisory: GHSA-c2j3-45gr-mqc4, GHSA-vxr8-fq34-vvx9, GHSA-gvmj-g25r-r7wr, GHSA-x4vx-rjvf-j5p4.

---

## 4. Engineering & Security Rule Audit

### Authentication Fallback Hazard (Section 5 Compliance)
- **Status**: ⚠️ **VULNERABLE**
- **Location**: `src/lib/auth.ts` lines 38-40
- **Finding**: In `src/lib/auth.ts`, if Clerk keys (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` & `CLERK_SECRET_KEY`) are missing, `getAuthUserId()` falls back to returning `'user_local_dev'` regardless of whether `NODE_ENV === 'production'`.
- **Target Policy**: Must fail-closed in `production` and return `null` or throw unauthorized exception when session keys are invalid or missing.

### Authorization & Tenant Isolation (Section 6 Compliance)
- **Status**: 🟢 Pass in current action routines; needs system-wide authorization test suite.
- **Finding**: Server actions check `ownerId = auth().userId()`. However, query helper functions and REST APIs must enforce DB-level predicates on all child relation queries (`versions`, `test_cases`, `test_results`).

### Database Constraints & Invariants (Section 10 Compliance)
- **Status**: ⚠️ Partial
- **Finding 1**: The `prompts` table lacks `UNIQUE(owner_id, name)` constraint, allowing a user to create multiple prompts with duplicate names.
- **Finding 2**: `prompts.currentVersionId` FK references `versions.id`, but cannot enforce a strict non-null foreign key at prompt creation without two-step insertion or transaction handling due to circular dependency.

### Outbound Webhook Security & SSRF (Section 13 Compliance)
- **Status**: ⚠️ **VULNERABLE**
- **Location**: `src/lib/webhooks.ts`
- **Finding**: Webhooks execute via direct `fetch(hook.url)`. No IP address resolution or RFC1918 private network / cloud metadata (169.254.169.254) blocking is performed prior to sending the HTTP request.
