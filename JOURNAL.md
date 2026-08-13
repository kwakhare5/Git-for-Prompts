# Product Journal

A chronological record of project milestones, features shipped, and metrics. This file is append-only.

---

## How to Maintain This Journal (For the Agent)

During the Session End ritual (called automatically whenever significant changes are made), the agent:

1. Reads the current `JOURNAL.md`.
2. Formats all work under **at most ONE date heading per calendar day** (`### [Project — Summary] YYYY-MM-DD`).
3. If today's date heading (`YYYY-MM-DD`) already exists under `## Log Entries`, merges/appends the new bullet points under `- **Shipped**:`, updates `- **Commit**:`, and updates `- **Vibe**:`.
4. If today's date heading does NOT exist, prepends a new date heading `### [Project — Summary] YYYY-MM-DD` directly under `## Log Entries` (newest date on top).

---

## Log Entries

### [GFP — Icon & Favicon Dark Background Standardization] 2026-08-13

- **Commit**: `2ecf4ec`
- **Shipped**:
  - Conducted full line-by-line codebase & architecture audit across database schema, server actions, REST API routes, CLI, and frontend dashboard components (`AUDIT_REPORT.md`).
  - Standardized logo separation: `public/logo.svg` is transparent stroke for in-app UI (`Navbar`, `Sidebar`, `BrandLogo`, `Footer`), while `src/app/icon.svg` & `src/app/apple-icon.svg` feature the dark background tile (`#09090b`) for favicons, Web Manifest (`manifest.ts`), and Google Search Console crawlers.
  - Hardened integration test suite by isolating test tenant user IDs and ensuring 100% test concurrency safety across Postgres connection pools.
  - Verification: 100% clean test suite (138/138 passing across all 17 test files), 0 TypeScript compilation errors (`tsc --noEmit`), successful production build (`next build`).
- **Vibe**: 🛡️ 100% Green Test Suite, Full Codebase Line-by-Line Audit Complete & Ready for Launch!

### [GFP — Hero Dashboard Replica, Mobile Overhaul, SEO & GitHub Actions CI Fix] 2026-08-12

- **Commit**: `36d854f`
- **Shipped**:
  - Fixed GitHub Actions CI test failure in `src/lib/__tests__/api-security.test.ts` where `vi.spyOn(Promise, 'all')` intercepted Upstash Redis internal `Promise.all` inside `checkRateLimit`, causing rate limit checks to fail-closed with 429 instead of reaching 404 route logic.
  - Rebuilt homepage hero preview box (`DashboardHeroScreen.tsx` & `DashboardWorkspaceView.tsx`) to render the 100% exact live `/dashboard` Overview Page on initial load: Header bar (`Prompt Repositories`), 4 Metric Summary Cards (`Total Prompts: 3`, `Total Versions: 12`, `Avg Pass Rate: 98%`, `API Credentials: 2`), Search input, and interactive repository table (`PromptRepositoriesList`).
  - Completely eliminated all unicode emojis/slop across the hero preview frame and dashboard domain components, replacing them with clean SVG Lucide icons (`FolderGit2`, `LayoutDashboard`, `Terminal`, `CheckIcon`).
  - Implemented interactive prompt detail view switching (`security-audit-v2`, `rag-knowledge-assistant`, `code-reviewer-pro`) with a `← Back to Repositories` button to return to the overview page.
  - Standardized left/right inline layout margins to `16px` (`px-4 sm:px-6`) across all website sections (`Navbar`, `HeroSection`, `DashboardHeroScreen`, `PromptStudioShowcase`, `BentoFeatures`, `EngineShowcase`, `FaqFooter`).
  - Executed comprehensive mobile responsiveness redesign across top Navbar (`Navbar.tsx` un-squished Get Started CTA + mobile slide-out drawer menu with backdrop blur), high-impact serif Hero section, and responsive Bento features.
  - Built custom monid.ai-style `@vercel/og` 1200x630px social share card generator (`src/app/opengraph-image.tsx`) featuring website dark charcoal theme, enlarged 3-circle git-fork logo icon, title ("Git for Prompts"), and hero command pill (`$ npx gfp init`).
  - Implemented complete pre-launch SEO infrastructure: `robots.ts` crawler policy, dynamic `sitemap.ts`, `manifest.ts` PWA spec, native `icon.svg` / `apple-icon.svg`, and JSON-LD structured data (`SoftwareApplication`).
  - Configured Google Search Console verification via HTML verification file (`public/googleXSkLpDVzfOoqfrH0Te2qtiwn9hcFgkre7xwviSaDWKY.html`) & layout meta tag hook.
  - Resolved Vitest cross-file database race condition (`fileParallelism: false`, `maxConcurrency: 1`, `sequence: { concurrent: false }` in `vitest.config.ts`) and fixed `drizzle.config.ts` (`strict: false`) for non-interactive CI runs.
  - Added creator credits for Karan Wakhare with GitHub profile link in website footer (`FaqFooter.tsx`).
  - Verification: 0 TS compilation errors, 100% clean test suite (138/138 passing), and successful Next.js production build (`npm run build`).
- **Vibe**: 🚀 100% Green GitHub Actions CI, Exact Dashboard Hero Preview & Search Console Verified!

### [GFP — Master Design System, Motion Engineering, P0 Security Engine & CI Hardening] 2026-08-11

- **Commit**: `828373f`
- **Shipped**:
  - Conducted full visual and technical design audit (`/design-review`, `/frontend-design`, `/emil-design-eng`) and created `DESIGN.md` establishing dark mode design system tokens (`#0a0a0a`, `#141414`, `#1e1e1e`, `#27272a`).
  - Centralized CSS motion tokens (`--ease-out-custom`) and master interactive utility classes (`.btn-interactive`, `.card-interactive`, `.tab-interactive`) in `globals.css` for hardware-accelerated micro-interactions across 100% of controls.
  - Defined global `.skeleton` CSS shimmer primitive to eliminate split-second route transition flashes across all 10 route `loading.tsx` files.
  - Re-architected studio page headers (`/edit`, `/diff`, `/compare`, `/tests`) to stack `← Back to Studio` breadcrumbs above page titles, and added custom Lucide chevrons to all `<select>` controls.
  - Converted `HeroSection.tsx` glow to top-bounded bounds and converted `Navbar.tsx` & `top-header-bar.tsx` to 100% solid `bg-bg-card border-zinc-800/90 shadow-2xl`, eliminating top spillage.
  - Unwrapped outer container cards in `PromptStudioShowcase.tsx` and `BentoFeatures.tsx` to eliminate nested double-card wrappers.
  - Enhanced dashboard empty state with a visual 3-step workflow diagram (`1. Create Prompt → 2. Save Version → 3. Add Tests & Compare`) and direct `+ Create Your First Prompt` CTA button (`dashboard-workspace-view.tsx`).
  - Surgically replaced all legacy light-theme classes (`bg-white`, `text-black`, `border-gray-300`) in `CompareRunner.tsx` with dark theme design system tokens (`bg-bg-card`, `bg-bg-page`, `text-zinc-100`, `text-emerald-300`).
  - Implemented production authentication fail-closed policy in `src/lib/auth.ts` and `src/proxy.ts`.
  - Built SSRF validation engine (`src/lib/security/ssrf.ts`) with IP classification, credential stripping, HTTPS/443 restriction, `redirect: 'manual'`, and IP pinning to defeat DNS rebinding TOCTOU attacks.
  - Conducted comprehensive cross-tenant BOLA audit and built automated security test suite (`authorization-bola.test.ts`).
  - Added unique constraint `uniqueIndex('prompts_owner_name_unique')` on `(owner_id, name)` in `src/db/schema.ts` for database-level uniqueness enforcement.
  - Fixed `restoreVersion` in `src/lib/actions/versions.ts` to preserve V2 `PromptBundle` objects (system prompt, model config, temperature, tools) when restoring versions.
  - Expanded `api_keys` schema with `scopes`, `revoked_at`, and `expires_at` columns, enforcing strict Bearer parsing and scope verification (`prompts:read`, `versions:write`).
  - Implemented `touchApiKeyLastUsed()` to throttle `lastUsedAt` database updates to at most once per 10-minute window per key to eliminate DB write amplification.
  - Configured Upstash rate limiters (`standard`: 60 req/min, `expensive`: 20 req/min) in `src/lib/rate-limit.ts` with explicit fail-closed policy for outage resilience.
  - Fixed GitHub Actions CI 35s non-interactive `drizzle-kit push` abort by adding `--force` flag and supplying complete test env variables block in `.github/workflows/ci.yml`.
  - Verification: 138/138 tests passing (`pnpm test`), 0 TS compilation errors (`tsc`), 0 ESLint warnings (`pnpm lint`), and successful Next.js production build (`pnpm build`).
- **Vibe**: 🎨 Pure Design Tokens, Emil Kowalski Motion Engineering, Hardened P0 Security & 100% Green CI Pipeline!

### [GFP — Color Token Purge, Vercel Pure Black Migration & Build Optimizations] 2026-08-10

- **Commit**: `bbc9fd3`
- **Shipped**:
  - Optimized Next.js production build compilation inside `next.config.ts` by enabling package imports optimization (`experimental.optimizePackageImports`) for `lucide-react`.
  - Added build-time automatic console statement stripping (`compiler.removeConsole`) in production environment variables.
  - Deleted empty obsolete folders `src/config` and `src/hooks`, and purged unreferenced heavy image `sendr-3.jpg` (1.17 MB) from root.
  - Aligned Create Prompt Repository page (`new/page.tsx`) layout with standard dashboard designs, implementing a unified flex header and guide sidebar.
  - Purged legacy blue badges (`bg-blue-500/10`) inside forms, refactoring them to use consistent emerald green (`bg-emerald-500/10` / `text-emerald-300`) and neutral borders.
  - Refactored `public/logo.svg` to make it transparent, removing solid dark container background (`<rect fill="#111111">`) to sit naturally across all backgrounds.
  - Migrated application background, card surfaces, and borders to Vercel-style Pure Black Theme (`--bg-page`: `#0a0a0a`, `#141414` cards, `#1e1e1e` panels, `#2a2a2a` borders).
  - Refactored CLI Copy button (`$ npx gfp init`) and Navbar GitHub link to theme-variable elevation (`bg-bg-card/85` with `border-border-subtle`).
  - Purged all legacy hardcoded bluish-slate backgrounds (`bg-[#202024]`, `hover:bg-[#28282D]`) across 18 files, replacing them with neutral `bg-bg-panel` and `hover:bg-zinc-700`.
  - Refactored global color tokens to Spotify-Style Neutral Dark palette (`#121212` background, `#1c1c1c` cards, `#282828` panels, `#333333` borders) mapped to CSS variables in `globals.css`.
  - Highlighted prompt variables (`{{variable_name}}`) using emerald green formatting across prompt editor and version diff views.
  - Verification: 88 passing tests, 0 TS compilation errors, 0 ESLint warnings, and fast production build compilation (<10s).
- **Vibe**: 🖤 Pure Black Theme Migration, Zero Bluish-Slate Color Purge & Next.js Build Speedup!
