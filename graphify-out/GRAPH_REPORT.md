# Graph Report - Git for Prompts  (2026-09-04)

## Corpus Check
- 160 files · ~68,045 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 719 nodes · 1380 edges · 50 communities (43 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1af481b7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- getAuthUserId
- core/src/index.ts
- tests.ts
- ui-tokens.tsx
- sqlite.ts
- prompt-detail-client.tsx
- prompt-editor.tsx
- SqliteStorageAdapter
- api-keys.ts
- ai.ts
- actions/webhooks.ts
- Proposed Changes
- [[...sign-in]]/page.tsx
- Validation Playbook — Git for Prompts
- brand-logo.tsx
- opengraph-image.tsx
- status/route.ts
- proxy.ts
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- README.md
- ARCHITECTURE.md — The Technical Blueprint (V2)
- AI fills and maintains this via @GRILL. You rarely edit this manually.
- 2. Deep Module-by-Module Audit
- Log Entries
- 2. 5-Act Master Storyboard (26.5s / 795 Frames @ 30fps)
- Git for Prompts — Design System Specification
- apple-icon.tsx
- Threat Model — Git for Prompts
- API Security Matrix

## God Nodes (most connected - your core abstractions)
1. `getAuthUserId()` - 45 edges
2. `db` - 28 edges
3. `createSqliteAdapter()` - 21 edges
4. `getDbPath()` - 20 edges
5. `checkRateLimit()` - 20 edges
6. `SqliteStorageAdapter` - 18 edges
7. `prompts` - 16 edges
8. `versions` - 16 edges
9. `StorageAdapter` - 15 edges
10. `query()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `ApiKeysPage()` --calls--> `getAuthUserId()`  [EXTRACTED]
  src/app/(dashboard)/dashboard/api-keys/page.tsx → src/lib/auth.ts
- `generateMetadata()` --calls--> `getAuthUserId()`  [EXTRACTED]
  src/app/(dashboard)/dashboard/prompts/[id]/compare/page.tsx → src/lib/auth.ts
- `ComparePage()` --calls--> `getAuthUserId()`  [EXTRACTED]
  src/app/(dashboard)/dashboard/prompts/[id]/compare/page.tsx → src/lib/auth.ts
- `generateMetadata()` --calls--> `getAuthUserId()`  [EXTRACTED]
  src/app/(dashboard)/dashboard/prompts/[id]/diff/page.tsx → src/lib/auth.ts
- `DiffPage()` --calls--> `getAuthUserId()`  [EXTRACTED]
  src/app/(dashboard)/dashboard/prompts/[id]/diff/page.tsx → src/lib/auth.ts

## Import Cycles
- None detected.

## Communities (50 total, 7 thin omitted)

### Community 0 - "getAuthUserId"
Cohesion: 0.05
Nodes (75): dynamic, maxDuration, dynamic, GET(), bodySchema, dynamic, POST(), createPromptBodySchema (+67 more)

### Community 1 - "core/src/index.ts"
Cohesion: 0.06
Nodes (51): DEFAULT_AI_TIMEOUT_MS, DEFAULT_GROQ_EVALUATION_MODEL, DEFAULT_GROQ_EXECUTION_MODEL, DEFAULT_MAX_CONCURRENT_TESTS, DEFAULT_OPENROUTER_EVALUATION_MODEL, DEFAULT_OPENROUTER_EXECUTION_MODEL, FRONTIER_OPENROUTER_EVALUATION_MODEL, GROQ_URL (+43 more)

### Community 2 - "tests.ts"
Cohesion: 0.06
Nodes (40): RFC-4122, CompareRunner(), CompareRunnerProps, DiffVersionSelector(), DiffVersionSelectorProps, Version, CellStatus, TestCase (+32 more)

### Community 3 - "ui-tokens.tsx"
Cohesion: 0.08
Nodes (30): Home(), instrumentSerif, metadata, plusJakartaSans, DashboardSidebar(), DashboardSidebarProps, PromptSummary, BentoFeatures() (+22 more)

### Community 4 - "sqlite.ts"
Cohesion: 0.11
Nodes (35): AddOptions, cmdAdd(), AuthOptions, cmdAuth(), cmdDiff(), cmdHistory(), cmdInit(), cmdList() (+27 more)

### Community 5 - "prompt-detail-client.tsx"
Cohesion: 0.11
Nodes (20): dynamic, metadata, CreatePromptForm(), emptySubscribe(), getOrigin(), getSSROrigin(), PromptDetailClient(), PromptDetailClientProps (+12 more)

### Community 6 - "prompt-editor.tsx"
Cohesion: 0.09
Nodes (25): DiffStats, DiffViewer(), DiffViewerProps, MonacoDiffEditor, StandaloneDiffEditor, BundleModelTab(), BundleModelTabProps, DEFAULT_MODELS (+17 more)

### Community 7 - "SqliteStorageAdapter"
Cohesion: 0.17
Nodes (8): mapPrompt(), mapTestCase(), mapTestResult(), mapVersion(), parseBundle(), parseVariables(), query(), SqliteStorageAdapter

### Community 8 - "api-keys.ts"
Cohesion: 0.18
Nodes (15): ApiKeysPage(), dynamic, metadata, ApiKeyRow, ApiKeysManager(), emptySubscribe(), getOrigin(), getSSROrigin() (+7 more)

### Community 9 - "ai.ts"
Cohesion: 0.14
Nodes (19): POST(), testResults, AIPurpose, AIResponse, callAI(), evaluateOutput(), evaluationResultSchema, extractJson() (+11 more)

### Community 10 - "actions/webhooks.ts"
Cohesion: 0.15
Nodes (17): RFC-1918, dynamic, metadata, WebhooksPage(), Webhook, WebhooksClient(), WebhooksClientProps, webhooks (+9 more)

### Community 11 - "Proposed Changes"
Cohesion: 0.12
Nodes (15): 1. Dependencies in `packages/cli`, 2. Prompt Engineering Tools (`packages/cli/src/agent/`), 3. Terminal UI & Renderer (`packages/cli/src/agent/`), 4. CLI Command Integration, Automated Tests, Implementation Plan: Interactive `gfp agent` CLI Assistant, Manual Verification, [MODIFY] [package.json](file:///d:/Git%20for%20Prompts/packages/cli/package.json) (+7 more)

### Community 12 - "[[...sign-in]]/page.tsx"
Cohesion: 0.20
Nodes (5): hasClerkKeys, metadata, hasClerkKeys, metadata, clerkAppearance

### Community 13 - "Validation Playbook — Git for Prompts"
Cohesion: 0.08
Nodes (23): Cold DM on X — If They Said Something Broke, Cold DM on X (Twitter) — Short Version, DM on Discord, ❌ No validation (wrong audience):, On Discord, On Indie Hackers (indiehackers.com), On Reddit, On X (Twitter) (+15 more)

### Community 15 - "opengraph-image.tsx"
Cohesion: 0.40
Nodes (3): alt, contentType, size

### Community 17 - "proxy.ts"
Cohesion: 0.50
Nodes (3): config, hasClerkKeys, isProtected

### Community 40 - "README.md"
Cohesion: 0.06
Nodes (30): Code of Conduct, Contributing to Git for Prompts, Development Setup, How Can I Contribute?, Pull Requests, Reporting Bugs, Style Guide, Suggesting Enhancements (+22 more)

### Community 41 - "ARCHITECTURE.md — The Technical Blueprint (V2)"
Cohesion: 0.11
Nodes (18): 1. PROJECT OVERVIEW & BUSINESS LOGIC, 2. SYSTEM ARCHITECTURE, 3. DATABASE SCHEMA (V2), 4. DEEP MODULE ARCHITECTURE & SEAMS, 5. SYNC PROTOCOL (cloud ↔ local), 6. ADRs — Architecture Decision Records, ARCHITECTURE.md — The Technical Blueprint (V2), Bundle JSON Schema (stored in `bundle` column) (+10 more)

### Community 42 - "AI fills and maintains this via @GRILL. You rarely edit this manually."
Cohesion: 0.14
Nodes (13): ADRs — Architecture Decision Records, AI fills and maintains this via @GRILL. You rarely edit this manually., Bugs Fixed, Business Rules (Never Break), CONTEXT.md — Domain Language, Core Entities, Database Schema, Feature Status (+5 more)

### Community 43 - "2. Deep Module-by-Module Audit"
Cohesion: 0.18
Nodes (10): 1. Executive Summary & Health Check, 2. Deep Module-by-Module Audit, 3. Findings & Potential Edge Cases Analyzed, 4. Final Verdict, A. Database Layer (`src/db/`), B. Server Actions & Business Logic (`src/lib/actions/`), C. Public REST API Routes (`src/app/api/v1/`), Comprehensive Codebase & Architecture Audit Report (+2 more)

### Community 44 - "Log Entries"
Cohesion: 0.17
Nodes (11): [GFP — 26.5s Master Launch Video Edit, Direction 1 Linear/Warp Organic Audio & 2026 Live Benchmarks] 2026-08-20, [GFP — Adversarial Security Hardening, Whole-Repo Audit & Production Launch Readiness] 2026-09-04, [GFP — Brutal Strategy Teardown, Whole-Repo Ponytail Cleanup & Master 2K Launch Video Export] 2026-08-21, [GFP — Color Token Purge, Vercel Pure Black Migration & Build Optimizations] 2026-08-10, [GFP — Hero Dashboard Replica, Mobile Overhaul, SEO & GitHub Actions CI Fix] 2026-08-12, [GFP — Icon & Favicon Dark Background Standardization] 2026-08-13, [GFP — Master Design System, Motion Engineering, P0 Security Engine & CI Hardening] 2026-08-11, [GFP — Remotion Launch Video Engine, File Reorganization & Codebase Pruning] 2026-08-19 (+3 more)

### Community 45 - "2. 5-Act Master Storyboard (26.5s / 795 Frames @ 30fps)"
Cohesion: 0.22
Nodes (8): 1. Overview, 2. 5-Act Master Storyboard (26.5s / 795 Frames @ 30fps), Act 1: The Pain (0.0s – 5.33s / Frames 0 – 160), Act 2: Hero Reveal (5.33s – 9.50s / Frames 160 – 285), Act 3: Terminal CLI Workflow (9.50s – 14.50s / Frames 285 – 435), Act 4: Deep Tech Showcase (14.50s – 22.50s / Frames 435 – 675), Act 5: Outro & CTA (22.50s – 26.50s / Frames 675 – 795), Git for Prompts — Master 26.5s Launch Video Specification

### Community 46 - "Git for Prompts — Design System Specification"
Cohesion: 0.25
Nodes (7): 1. Product Identity & Aesthetics, 2. Color Palette & Dark Theme Tokens, 3. Typography Hierarchy, 4. Motion & Micro-Interactions, 5. Touch Target & Accessibility Standards, Git for Prompts — Design System Specification, Semantic Badges & Accents

### Community 48 - "Threat Model — Git for Prompts"
Cohesion: 0.40
Nodes (4): 1. Attacker Personas, 2. Asset Inventory & Protection Requirements, 3. Vulnerability Vector Evaluation Matrix, Threat Model — Git for Prompts

## Knowledge Gaps
- **235 isolated node(s):** `eslintConfig`, `nextConfig`, `AddOptions`, `AuthOptions`, `PullOptions` (+230 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getAuthUserId()` connect `getAuthUserId` to `api-keys.ts`, `tests.ts`, `actions/webhooks.ts`, `prompt-detail-client.tsx`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `db` connect `getAuthUserId` to `api-keys.ts`, `ai.ts`, `tests.ts`, `actions/webhooks.ts`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `versions` connect `getAuthUserId` to `tests.ts`, `prompt-detail-client.tsx`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `AddOptions` to the rest of the system?**
  _235 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `getAuthUserId` be split into smaller, more focused modules?**
  _Cohesion score 0.05293931731984829 - nodes in this community are weakly interconnected._
- **Should `core/src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.058596491228070174 - nodes in this community are weakly interconnected._
- **Should `tests.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05889724310776942 - nodes in this community are weakly interconnected._