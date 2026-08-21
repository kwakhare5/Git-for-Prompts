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

### [GFP — Brutal Strategy Teardown, Whole-Repo Ponytail Cleanup & Master 2K Launch Video Export] 2026-08-21
 
- **Commit**: `c7fda83`
- **Shipped**:
  - Executed brutal product strategy audit: aligned product positioning on **Atomic Local-First Prompt Bundling (`Prompt + Model Parameters + Schema` in a zero-dependency SQLite repository)**.
  - Purged non-core distraction features: deleted public Explore gallery routes (`src/app/(landing)/explore/` and `src/app/(dashboard)/dashboard/explore/`), public fork button/action, and serverless keep-alive cron.
  - Conducted complete documentation cleanup: deleted 29 obsolete intermediate stage/scratch reports from `docs/` and `docs/archive/`, establishing a clean 10-file canonical documentation tree.
  - Completed Ponytail whole-repo deep cleanup: purged 8.3 MB of obsolete video renders, stray npm lockfiles, scratch Python scripts, unused dependencies in `launch-video/package.json`, and duplicate root audio.
  - Synchronized 100% ground-truth across all core markdown files (`README.md`, `ARCHITECTURE.md`, `CONTEXT.md`, `AUDIT_REPORT.md`, `LAUNCH_PLAN.md`, `.agents/AGENTS.md`).
  - Configured [`.graphifyignore`](file:///d:/Git%20for%20Prompts/.graphifyignore) to ignore non-code assets and third-party skills, eliminating 26 warnings and generating a lean AST code graph (686 nodes, 1343 edges, 50 communities).
  - Reorganized bloated 828-line `dashboard-workspace-view.tsx` into two focused modules: `prompt-repositories-list.tsx` (clean dashboard workspace table/grid) and `DashboardHeroReplica.tsx` (isolated landing page interactive demo with pure static demo data).
  - Expanded test coverage across packages: wrote `packages/cli/src/__tests__/cli-sqlite.test.ts` (Wasm SQLite storage, table creation, auto-incrementing immutable versions, test case/result persistence) and core engine test suites (`diff.test.ts`, `variables.test.ts`, `eval.test.ts`).
  - Standardized CLI version batch to `v0.1.0` ground truth across all packages, configs, scenes, and terminal windows.
  - Updated Scene 4 model latency benchmarks to real August 2026 frontier AI measurements: **Groq / Llama 3.3 70B (140ms, 6.2x FASTER)**, **OpenAI / GPT-5.6 Sol (650ms)**, and **Anthropic / Claude Opus 5 (1250ms)**.
  - Sourced and integrated studio-grade Mixkit acoustic Foley suite: mechanical keyboard typing, Holy Panda Enter keystrokes, slot machine lock tick, 6.2x Groq speed surge whoosh, and close-mic mouse click + celebration chime on 1-click CTA Copy.
  - Upgraded all 5 Remotion scenes with Emil Kowalski design engineering principles: 2-frame micro-blur bridges, tactile slot machine deceleration curves, cryptographic pill badges, snappy Groq surge physics, and active click compression.
  - Exported master 2K Retina launch video (`launch-video/out/launch-video-master.mp4`) with CRF 12 visually pristine compression, 320 kbps studio master AAC audio, and YUV420p universal web compatibility.
  - Relaxed Act 1 typewriter effect and synchronized camera pan from 50 frames to 58 frames (`0.67 chars/frame`), delivering a smoother reading cadence and zero transition jarring.
  - Conducted full web performance & Vercel optimization pass: added `poweredByHeader: false`, enabled Brotli/Gzip server response `compress: true`, added modular tree-shaking `optimizePackageImports: ["lucide-react", "date-fns"]`, added production security headers, and configured 1-year immutable caching for static assets in `next.config.ts`.
  - Added font loading optimization with `display: "swap"` and `preload: true` for `Instrument_Serif` and `Plus_Jakarta_Sans` in `src/app/layout.tsx` to eliminate layout shift (CLS) and invisible text flash (FOIT).
  - Configured hardware-accelerated rendering in `launch-video/remotion.config.ts` (`angle` OpenGL renderer, 95% JPEG quality, YUV420p universal web pixel format, 320kbps AAC, CRF 12).
  - Executed whole-scene Emil Kowalski polish: continuous left menu sliding indicator (`continuousIdx * 56px`), overlapping card cross-morph (eliminating 8-frame blackout flash), cubic ease-out diff wipes, deterministic frame-math blinking cursors (`Math.floor(local / 8) % 2 === 0`), and haptic button press compression (`scale: 1.0 ➔ 0.97`).
  - Re-rendered master 2K Retina launch video (`launch-video/out/launch-video-master.mp4`, 3.1 MB) and verified 1:1 playback parity in `launch-video-player.html`.
  - Verification: 154/154 Vitest tests passing across 20 test files (100% green), Next.js 16 Turbopack production compilation passing in 1.9s, and 686 clean AST code nodes in knowledge graph.
- **Vibe**: ⚡ 100% Web-Perf & Vercel Optimized, Fluid Launch Video Master Rendered!

### [GFP — 26.5s Master Launch Video Edit, Direction 1 Linear/Warp Organic Audio & 2026 Live Benchmarks] 2026-08-20

- **Commit**: `1e89b42`
- **Shipped**:
  - Relaxed Act 1 slot reel word flip animation to 1.0s per word (`["diffs.", "evals.", "tests.", "history."]` at `[90, 115, 140]`) with a 1.67-second static hero hold.
  - Tightened scene transition gaps across all 5 acts, bringing total master video duration from 900f to **795f (~26.5s @ 30fps)** with zero transition lag or dead air.
  - Updated model benchmark cards (Cut 2) and terminal output text to match August 2026 live web ground-truth latencies: Groq Llama 3.3 70B (`120ms` [6.5x FASTER]), OpenAI GPT-5.2 (`800ms`), and Anthropic Claude Sonnet 5 (`1500ms`).
  - Synthesized Direction 1 Linear/Warp organic tech soundtrack ([`bgm.wav`](file:///D:/Git%20for%20Prompts/launch-video/public/bgm.wav) — 26.5s stereo 44.1kHz WAV @ 110 BPM): soft Rhodes piano chord build in Act 1 ➔ glass bell chime & warm bass swell in Act 2 ➔ **Organic Tech Beat Drop @ 9.5s (`285f`)** ➔ Ebmaj7 arpeggiated showcase ➔ Eb major resolution chord & logarithmic fade out.
  - Upgraded sound effect suite to 100% organic acoustic audio: **Thocky custom mechanical switch clicks** (`click.wav`), sub-air sweeps (`whoosh.wav`), glass bell chime (`chime.wav`), dual-note acoustic marimba ping (`success.wav`), and haptic button pop (`pop.wav`).
  - Built explicit `<audio>` playback engine and `🔊 Sound: ON` toggle control into [`launch-video-player.html`](file:///D:/Git%20for%20Prompts/launch-video-player.html) to bypass browser autoplay policies.
  - Verification: 100% clean TypeScript check (`npx tsc --noEmit`), 795/795 frames rendered without errors in HTML player simulation, and pushed directly to `origin/main`.
- **Vibe**: 🎵 Direction 1 Linear/Warp Organic Tech Soundtrack & Thocky Mechanical Switch SFX!

### [GFP — Remotion Launch Video Engine, File Reorganization & Codebase Pruning] 2026-08-19

- **Commit**: `d1779e8`
- **Shipped**:
  - Reorganized `launch-video/src/scenes/` folder to map 1:1 with the 5-Act product storyboard (`Act1Pain.tsx`, `Act2Reveal.tsx`, `Act3Terminal.tsx`, `Act4Showcase.tsx`, `Act5Outro.tsx`).
  - Purged dead, unreferenced scene files (`Scene3Tagline.tsx`, `Scene4Positioning.tsx`, `Scene6Value.tsx`) and legacy imports in `LaunchVideo.tsx`.
  - Fixed vertical centering in `Act3Terminal.tsx` and `launch-video-player.html` (Act 3): wrapped header block and terminal card in `flex flex-col items-center justify-center`, placing the entire assembly at exact 50% Y vertical center with 140px margin breathing room top & bottom.
  - Locked terminal body height (`h-[290px]` in Remotion / `h-[250px]` in player), completely eliminating vertical layout shifting as commands reveal.
  - Re-anchored floating success toast (`bottom-4 right-5`) inside the terminal card so it never overlaps terminal output text.
  - Refactored CLI workflow scene into a strict sequential execution loop: Command 1 (`npx gfp init`) types out with active cursor ➔ Enter pressed ➔ Spinner executes ➔ Result printed ➔ Command 2 (`gfp eval --all`) types out ➔ Executed ➔ Result printed ➔ Command 3 (`gfp push main.prompt`) types out ➔ Executed ➔ Toast popup slides up.
  - Replaced colored/gradient spotlight with pure monochrome dark theme (`#0D0D10`): seamless optical focus pull and de-blur on the central Brand Icon Tile (`blur(14px) -> blur(0px)` + `scale(0.94 -> 1.0)`) into Title and Subtitle.
  - Symmetrically aligned and vertically/horizontally centered the Hero Reveal layout (Tile + Title + Subtitle) in `Act2Reveal.tsx` and `launch-video-player.html`.
  - Purged all bottom feature badges from `Act2Reveal.tsx`, directing 100% viewer focus to the clean Brand Icon Tile, Title, and Subtitle.
  - Reduced typewriter typing speed in `Act1Pain.tsx` (expanded to 64 frames, 6f–70f) for a calm, easily readable cadence with subpixel camera dolly tracking.
  - Set stationary static white `"No"` on the left while only the emerald words (`diffs.`, `evals.`, `tests.`, `history.`) rotate in the slot reel with zero blur filters for razor-sharp typography.
  - Synchronized single-screen interactive studio player (`launch-video-player.html`) with real-time parameter tuning and 5 scene selectors.
  - Verification: 0 TypeScript errors (`npx tsc --noEmit`), clean frame previews, and verified smooth playback.
- **Vibe**: 🧹 Clean 5-Act File Structure, Zero Dead Scenes, 100% Dead-Center UI!

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
