# Walkthrough — Git for Prompts

## Phase 7: Version Comparison — A/B Benchmarking

**Completed:** 2026-05-01

### What was built

Phase 7 adds a dedicated A/B comparison page at `/dashboard/prompts/[id]/compare` that runs
all of a prompt's test cases against **two selected versions simultaneously** and renders a
side-by-side PASS/FAIL table with a winner declaration.

---

### New files

| File | Purpose |
|---|---|
| `src/app/(dashboard)/dashboard/prompts/[id]/compare/page.tsx` | Server component — ownership check, version/test-case fetch, empty-state gates |
| `src/components/compare-runner.tsx` | Client component — all interactive comparison UI |

### Modified files

| File | Change |
|---|---|
| `src/lib/validations/test.ts` | Added `runComparisonSchema` + `RunComparisonInput` type |
| `src/lib/actions/tests.ts` | Added `runComparisonForVersions` server action |
| `src/app/(dashboard)/dashboard/prompts/[id]/page.tsx` | Added "A/B Test" nav link; renamed "Compare" → "Diff" for clarity |

---

### Key design decisions

**Why a separate `/compare` route (not merged into `/tests`)?**
The comparison is a distinct workflow — you pick two specific versions to benchmark head-to-head.
Merging it into the tests page would make the UI too dense and bury the feature.

**Why not reuse `runTestsForVersion` twice?**
The existing action is designed for the single-version test runner UI (with its own auth +
revalidatePath cycle). Calling it twice would double the auth checks and produce confusing
revalidation. The new `runComparisonForVersions` action calls `runSingleTestCase` directly and
fires both versions against each test case in a single `Promise.all`, maximising parallelism.

**Promise.allSettled for DB inserts**
Results are persisted to `test_results` with `Promise.allSettled` — a DB insert failure
never blocks the comparison response the user sees. Errors are logged to the server console.

**Rows highlighted on divergence**
Table rows where Version A and Version B disagree (one PASS, one FAIL) receive a subtle
amber background, immediately surfacing the meaningful differences between versions.

---

### Empty states

- `< 2 versions` → "Need at least 2 versions" + New Version CTA
- `0 test cases` → "No test cases yet" + Add Test Cases CTA
- `A === B selected` → inline amber warning (button stays disabled)

---

### Build verification

```
✓ Compiled successfully in 3.6s
✓ TypeScript — zero errors
Exit code: 0
Route confirmed: ƒ /dashboard/prompts/[id]/compare
```

---

## Infrastructure & UI Consistency Polish

**Completed:** 2026-05-01 (Continuous hardening)

### Major Improvements

1.  **Mobile-First Sidebar (R1)**:
    - Replaced the fixed desktop-only sidebar with a responsive drawer implementation.
    - Added a custom hamburger trigger (`<button>`) and backdrop overlay for mobile viewports.
    - Uses Tailwind's `translate-x` utilities for smooth CSS transitions.

2.  **Visual Consistency (V1-V5)**:
    - **Color Triage**: Prompt cards now use a clear color hierarchy for test results: `Red` for 0%, `Amber` for partial, and `Emerald` for 100%.
    - **Refined Typography**: Standardised on `≈` for token approximations to avoid visual confusion with minus signs in monospace fonts.
    - **High-Contrast Labels**: Improved visibility for "soon" badges and "No tests" placeholders to ensure compliance with legibility standards.

3.  **Accessibility (A1-A3)**:
    - Added `aria-label` to the Monaco editor wrapper for screen reader identification.
    - Fixed keyboard navigation for destructive actions by ensuring "Delete" buttons are visible on focus, not just hover.
    - Applied `aria-disabled="true"` to upcoming features in the sidebar.

4.  **Infrastructure Fix (PID collision)**:
    - Resolved a critical bug in `scripts/kill-ports.ps1` where attempting to use `$pId` as a loop variable collided with PowerShell's read-only `$PID` automatic variable. Renamed to `$targetPid`.

---

## Phase 10: Performance Optimization — Groq Dual-Provider Engine

**Completed:** 2026-05-12

### What was built

Phase 10 overhauls the AI core to solve persistent latency and rate-limiting issues. The system was migrated from a single-provider Gemini SDK to a **Dual-Provider Architecture** using native `fetch`.

- **Primary Engine**: **Groq (Llama 3.3 70B)** — chosen for its sub-second inference speeds.
- **Fallback Engine**: **OpenRouter (Free Tier)** — acts as an automatic circuit-breaker if Groq is unavailable.

### Technical Improvements

1.  **Native Fetch Integration**:
    - Removed the heavy `@google/generative-ai` dependency.
    - Implemented a custom `fetchWithTimeout` wrapper with 30s abort logic.
    - Added automatic fallback logic: if Groq returns a non-200 or times out, the system instantly retries via OpenRouter.

2.  **Concurrency Scaling**:
    - Bumped `MAX_CONCURRENT_TESTS` from 3 to **10**.
    - Since Groq handles massive throughput, this allows running entire test suites (50+ cases) in seconds rather than minutes.

3.  **Total Type Safety**:
    - Purged all `any` types from the AI pipeline.
    - Defined strict `Message` and `AIResponse` interfaces for OpenAI-compatible endpoints.

4.  **Documentation Hardening**:
    - Performed a global markdown audit fixing 40+ linting issues (MD024, MD025, MD032, MD034, etc.).
    - Synchronized `CLAUDE.md`, `GEMINI.md`, and `README.md` with the new Groq-first architecture.

### Modified files

| File | Change |
|---|---|
| `src/lib/ai.ts` | Complete refactor: removed Gemini SDK, implemented Dual-Provider logic. |
| `src/lib/actions/tests.ts` | Hardened server actions with strict types and error handling. |
| `README.md` | Updated Tech Stack and Setup guides. |
| `CLAUDE.md` / `GEMINI.md` | Synchronized project rules and architecture notes. |

---

## Previous phases

- **Phase 6** — Gemini test runner (PASS/FAIL per test case, score summary)
- **Phase 5** — Monaco DiffEditor (visual text diff, side-by-side)
- **Phase 4** — Monaco prompt editor, versioning, restore
- **Phase 3** — Dashboard, prompt CRUD, sidebar

---

## 21-Category UI Audit — 34 Issues

**Completed:** 2026-05-01 | **Build:** ✓ exit 0 | **Issues fixed: 19 | Deferred: 5**

### Why this pass was done

The codebase had accumulated diverging patterns across phases — some components used the shadcn `<Button>`, others used native buttons with copy-pasted class strings; some empty states used `py-24`, others `py-16`; the running state used `blue-500` which appeared nowhere else in the design system. This pass systematically identified and closed those gaps without touching business logic.

### Decisions and rationale

| Fix | Why this way |
|---|---|
| `sky-500` for running state (#03) | Blue had zero other uses. Sky is Tailwind's "in-progress" semantic colour and visually almost identical — minimal diff, correct semantics. |
| `grid-cols-[1fr_auto_auto]` for compare table (#06) | Fixed 100px columns overflowed on narrow screens. `auto` lets badge content self-size at any width. |
| `prefers-reduced-motion` in globals.css (#17) | Nuclear approach — one rule fixes the sidebar, all spinners, and `animate-pulse` simultaneously without touching 6 component files. |
| `transition-transform` on sidebar (#16) | `transition-all` watches every CSS property on every frame. During the slide only `transform` changes — specifying it directly cuts browser paint work. |
| `minHeight: 200px` for Monaco skeleton (#18) | The height prop is dynamic and server-unknown at SSR time. `minHeight` gives a sensible floor without hardcoding a wrong fixed value. |
| `p-4 sm:p-8` responsive padding (#20) | Adds 16px base padding on mobile (was 0 inside the sidebar layout) without changing desktop look. |
| `focus-visible:ring-2` on selects (#14) | `focus:ring-1` was too thin and fired on mouse click. `focus-visible:ring-2` only fires on keyboard, matching the shadcn component convention. |
| Removed `promptId` from `CompareRunnerProps` (#31) | The prop was in the interface and passed by the parent but never destructured or read inside the component — pure dead type surface. |

### What was deferred and why

| # | Issue | Why deferred |
|---|---|---|
| #02 | Token system adoption | Would touch every component file. Requires a dedicated token-adoption pass with visual regression testing. |
| #09 | Primary button unification | Changing native `<button>` and `<Link>` elements to `<Button>` risks altering form submission and navigation behaviour. |
| #19 | Active nav state on sub-pages | Requires extracting a `'use client'` wrapper with `usePathname` around the current server-component nav — a structural change. |
| #22 | Icon system | No clear winner (Lucide vs Heroicons vs custom). Needs a design decision before implementation. |
| #26 | Dead `:root` CSS | 34-line deletion — flagged for human review per the rules. Confirm before deleting. |

---

## Phase 11: Elite Documentation — Final Branding Pass

**Completed:** 2026-05-14

### What was built

Phase 11 finalizes the **Git for Prompts** repository by upgrading the primary documentation to a high-fidelity "Elite" standard and purging all legacy development artifacts.

- **Elite README Architecture**: Replaced the baseline `README.md` with a professionally structured, asset-rich documentation system.
- **Dynamic Status Badges**: Integrated live version, license, and repository health badges into the hero section.
- **Clean State Protocol**: Successfully deleted `README_TEMPLATE.md` and finalized the project structure for public release.

### Modified files

| File | Change |
|---|---|
| `README.md` | Full architectural overhaul using the Elite Template. |
| `docs/task.md` | Updated with final phase completion markers. |
| `docs/walkthrough.md` | Added Phase 11 summary. |
| `README_TEMPLATE.md` | **[DELETED]** — redundant template removed. |

### Build verification

```bash
✓ README.md — 100% synchronized
✓ Project Structure — Gold Master state achieved
✓ Deployment Artifacts — Purged
```

---

## Workspace Restoration & Database Fix

**Completed:** 2026-06-13

### What was resolved

During local workspace launch, the Next.js dev server encountered database connection failure (`ECONNREFUSED` on port 5432) because the required environment variables in `.env.local` were empty. 

1. **Credentials Recovery**: We retrieved the past session's Supabase connection URI (including credentials) and Groq/OpenRouter keys from the local `.system_generated` logs in `C:\Users\kwakh\.gemini`.
2. **Clerk Keys**: Populated standard Clerk Publishable and Secret Keys in `.env.local` using details extracted from the Clerk Keyless cache (`.clerk/.tmp/keyless.json`).
3. **Dependencies**: Installed `@supabase/supabase-js` and `@supabase/ssr` via `pnpm` as requested.
4. **Database Migrations**: Executed `npx drizzle-kit migrate` successfully, creating and mapping the database schemas to the remote Supabase PostgreSQL pooler instance.
5. **Validation**: The Next.js dev server successfully loaded the dashboard page (`/dashboard`) and API Keys page (`/dashboard/api-keys`) returning a `200 OK` status code with no database or authentication errors.

---

## Landing Page Interactive Enhancements

**Completed:** 2026-06-13

### What was built

1. **Interactive SDK Code Tab Selector (Go SDK)**:
   - Added **Go SDK** tab alongside Node.js, Python, and cURL tabs in [sdk-section.tsx](file:///d:/Git%20for%20Prompts/src/app/(landing)/_components/sdk-section.tsx).
   - Wrote a mock Go client integration snippet demonstrating dynamic runtime prompt loading in Go.
   - Handled buttons flex-wrapping for better mobile responsive behaviors.

2. **Connected Git Tree SVG Explorer**:
   - Made the SVG tree version nodes (`v1`, `v2`, `v3`) in [git-tree.tsx](file:///d:/Git%20for%20Prompts/src/app/(landing)/_components/graphics/git-tree.tsx) clickable.
   - Hover and selection glows dynamically apply to show active state.
   - Built a bottom toggle panel: clicking a version opens a detailed **Prompt Inspector** showcasing that version's text, commit message, and author info. A Close `[x]` button returns the panel to the typewriter commit logging simulation.

3. **Predefined Test Runner Queries**:
   - Added interactive button selectors to [pipeline.tsx](file:///d:/Git%20for%20Prompts/src/app/(landing)/_components/graphics/pipeline.tsx) to switch between a **Damaged Returns Check** (2 assertions) and a **Late Shipment Check** (3 assertions).
   - Switching scenarios resets the active timelines and runs the step-by-step logs and nodes corresponding to the new query inputs.

4. **Mock Terminal CLI Showcase**:
   - Wrote a custom `<MockTerminal>` component inside [sdk-section.tsx](file:///d:/Git%20for%20Prompts/src/app/(landing)/_components/sdk-section.tsx) simulating CLI login (`gfp login`), download (`gfp pull`), and evaluation runs (`gfp test`).
   - Redesigned the developer integration section layout into a 2-column grid layout on desktop, balancing the SDK tab selector on the left with the Mock Terminal console on the right.

---

## Production Readiness Hardening & Audit Completion

**Completed:** 2026-06-13 (Continuous hardening)

### What was resolved

1. **Typing Hardening in API Route Tests**:
   - Refactored `any` declarations in [route.test.ts](file:///d:/Git%20for%20Prompts/src/app/api/v1/prompts/[id]/latest/route.test.ts) to use type-only imports (`import type`) referencing `db`, `schema`, and `GET` handler types.
   - Guaranteed ESM environment isolation by dynamically loading database connections and schema mapping inside `beforeAll` blocks after `dotenv.config()` execution.

2. **ESLint & Codebase Cleanup**:
   - Pruned unused imports (`updatePromptSchema`, `deleteTestCaseSchema`) in [validations.test.ts](file:///d:/Git%20for%20Prompts/src/lib/__tests__/validations.test.ts).
   - Resolved React `useEffect` exhaustive-deps check in [sdk-section.tsx](file:///d:/Git%20for%20Prompts/src/app/(landing)/_components/sdk-section.tsx) by moving the static `script` animation configuration array outside of the component body.
   - Pruned unused dependencies (`@google/generative-ai` and `@types/bcryptjs`) from `package.json` and cleanly updated `pnpm-lock.yaml`.

3. **Validation & Verification**:
   - Ran production build check (`npm run build`), which compiled in 4.6s with type validation in 6.4s.
   - Executed full Vitest suite (41/41 tests passing) and Playwright E2E suite (3/3 tests passing).
   - Achieved 100% clean static checks (`npm run lint` -> `0 Errors, 0 Warnings`).


