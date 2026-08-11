# Stage 2G — Codebase Health Baseline

## Executive Summary
This baseline records the exact state of the Git-for-Prompts repository before commencing Stage 2G audits and conservative simplification passes.

---

## Metric Summary

| Check | Result | Details / Metrics |
|-------|--------|-------------------|
| **Test Suite (`pnpm test`)** | 🟢 PASS | **132 passing tests** across 16 test files (2 skipped in concurrency suite when Postgres DB env absent). Run time: ~5.9s. |
| **TypeScript Check (`tsc --noEmit`)** | 🟢 PASS | **0 errors**. |
| **ESLint Check (`pnpm lint`)** | 🟢 PASS | **0 errors, 0 warnings**. |
| **Production Build (`pnpm build`)** | 🟢 PASS | **Successful Turbopack build**. Compile time: 1837ms. Static pages generated in 150ms. |
| **Security Audit (`pnpm audit`)** | 🟡 29 advisories | 6 low, 16 moderate, 7 high. Transitive via `@monaco-editor/react` -> `monaco-editor` -> `dompurify` and `next` transitive dependencies. No direct production exploitation reachable. |

---

## Test File Baseline breakdown (16 active test files)
1. `src/lib/__tests__/ssrf.test.ts` (13 tests)
2. `src/lib/__tests__/rate-limit.test.ts` (2 tests)
3. `src/lib/__tests__/auth.test.ts` (5 tests)
4. `packages/core/src/__tests__/bundle.test.ts` (7 tests)
5. `src/lib/variables.test.ts` (20 tests)
6. `src/lib/__tests__/ai.test.ts` (11 tests)
7. `src/lib/__tests__/validations.test.ts` (16 tests)
8. `src/lib/__tests__/format-version-label.test.ts` (3 tests)
9. `src/lib/__tests__/api-auth.test.ts` (6 tests)
10. `src/lib/__tests__/api-security.test.ts` (1 test)
11. `src/lib/__tests__/api-key-lifecycle.test.ts` (4 tests)
12. `src/lib/__tests__/database-correctness.test.ts` (2 tests)
13. `src/lib/__tests__/authorization-bola.test.ts` (11 tests)
14. `src/lib/actions/__tests__/actions.test.ts` (10 tests)
15. `src/app/api/v1/prompts/[id]/latest/route.test.ts` (5 tests)
16. `src/lib/actions/__tests__/tests.test.ts` (16 tests)
17. *(Skipped when Postgres DB unavailable: `src/lib/__tests__/concurrency.test.ts` - 2 tests)*
