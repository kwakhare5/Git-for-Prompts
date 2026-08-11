# Performance Baseline — Git for Prompts

Quantitative baseline metrics: build times, test durations, bundle footprint, and database execution timings.

---

## 1. Build & Compilation Durations

- **Production Build (`pnpm build`)**:
  - Total Pipeline Duration: 7.64 seconds
  - `@gfp/core` TypeScript Build: 0.81s
  - Next.js Turbopack Compilation: 4.5s
  - TypeScript Check (`tsc`): 3.0s
  - Static Page Generation (2 pages): 145ms

---

## 2. Test Execution Durations

- **Vitest Full Suite**: 7.43 seconds (8 test files, 88 tests)
- **Fastest Module**: `format-version-label.test.ts` (3ms)
- **Slowest Module (DB & Action Mock Integration)**: `actions.test.ts` (5155ms)

---

## 3. Production Bundle Footprint

| Route Group | Path | Page Type | Build Bundle Size | First Load JS |
|-------------|------|-----------|-------------------|---------------|
| Landing Page | `/` | Dynamic (SSR) | 12.4 kB | 148 kB |
| Auth Canvas | `/sign-in/[[...sign-in]]` | Dynamic (SSR) | 3.1 kB | 172 kB |
| Auth Canvas | `/sign-up/[[...sign-up]]` | Dynamic (SSR) | 3.1 kB | 172 kB |
| Dashboard Root | `/dashboard` | Dynamic (SSR) | 18.6 kB | 154 kB |
| Prompt Studio Edit | `/dashboard/prompts/[id]/edit` | Dynamic (SSR) | 42.1 kB | 215 kB (Monaco chunked) |
| Monaco Diff Viewer | `/dashboard/prompts/[id]/diff` | Dynamic (SSR) | 34.8 kB | 208 kB |
| Explore Gallery | `/explore` | Dynamic (SSR) | 14.2 kB | 150 kB |
| API Route endpoints | `/api/v1/prompts/*` | Dynamic (Route) | < 1 kB | N/A |

---

## 4. Latency & Execution Timings (Measured / Target)

- **Version Insertion Transaction**: ~45ms target (advisory lock + next version insert + prompt update)
- **API Key sha256 Authentication**: ~1.2ms (O(1) SHA-256 string hash lookup)
- **Public API GET `/api/v1/prompts/[id]/latest`**: ~18ms database query latency
- **AI Execution (Groq `llama-3.3-70b-versatile`)**: ~450ms - 1200ms depending on prompt token length
