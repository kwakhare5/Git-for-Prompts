# Graph Report - Git for Prompts  (2026-09-06)

## Corpus Check
- 166 files · ~70,766 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 689 nodes · 1348 edges · 56 communities (38 shown, 18 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `768a0b1a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- about/page.tsx
- core/src/index.ts
- test-runner.tsx
- ui-tokens.tsx
- sqlite.ts
- regression-tests/route.ts
- prompt-editor.tsx
- tests.ts
- cli/README.md
- versions.ts
- actions/webhooks.ts
- SqliteStorageAdapter
- [[...sign-in]]/page.tsx
- brand-logo.tsx
- opengraph-image.tsx
- status/route.ts
- proxy.ts
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- robots.ts
- sitemap.ts
- README.md
- ARCHITECTURE.md — The Technical Blueprint (Version 1)
- AI fills and maintains this via @GRILL. You rarely edit this manually.
- Log Entries
- Git for Prompts — Design System Specification
- StorageAdapter
- Threat Model — Git for Prompts
- API Security Matrix
- contact/page.tsx
- privacy/page.tsx
- mcp/route.ts
- markdown/route.ts
- llms.txt/route.ts
- app/not-found.tsx
- getAuthUserId
- d9f8e7c6b5a41230e9d8c7b6a5f4e321.txt/route.ts
- security.txt/route.ts

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

## Communities (56 total, 18 thin omitted)

### Community 1 - "core/src/index.ts"
Cohesion: 0.08
Nodes (50): DEFAULT_AI_TIMEOUT_MS, DEFAULT_GROQ_EVALUATION_MODEL, DEFAULT_GROQ_EXECUTION_MODEL, DEFAULT_MAX_CONCURRENT_TESTS, DEFAULT_OPENROUTER_EVALUATION_MODEL, DEFAULT_OPENROUTER_EXECUTION_MODEL, FRONTIER_OPENROUTER_EVALUATION_MODEL, GROQ_URL (+42 more)

### Community 2 - "test-runner.tsx"
Cohesion: 0.11
Nodes (20): DiffVersionSelector(), DiffVersionSelectorProps, Version, DeleteConfirmButton(), DeleteConfirmButtonProps, TestCaseCard(), TestCaseCardProps, TestResult (+12 more)

### Community 3 - "ui-tokens.tsx"
Cohesion: 0.06
Nodes (36): dynamic, Home(), instrumentSerif, metadata, plusJakartaSans, viewport, FeedbackModal(), PromptRepositoriesList() (+28 more)

### Community 4 - "sqlite.ts"
Cohesion: 0.11
Nodes (35): AddOptions, cmdAdd(), AuthOptions, cmdAuth(), cmdDiff(), cmdHistory(), cmdInit(), cmdList() (+27 more)

### Community 5 - "regression-tests/route.ts"
Cohesion: 0.09
Nodes (29): dynamic, maxDuration, POST(), CompareRunner(), CompareRunnerProps, CellStatus, TestCase, useCompareRunner() (+21 more)

### Community 6 - "prompt-editor.tsx"
Cohesion: 0.09
Nodes (25): DiffStats, DiffViewer(), DiffViewerProps, MonacoDiffEditor, StandaloneDiffEditor, BundleModelTab(), BundleModelTabProps, DEFAULT_MODELS (+17 more)

### Community 7 - "tests.ts"
Cohesion: 0.11
Nodes (24): RFC-4122, ApiKeysPage(), dynamic, metadata, ApiKeyRow, ApiKeysManager(), emptySubscribe(), getOrigin() (+16 more)

### Community 8 - "cli/README.md"
Cohesion: 0.40
Nodes (4): Commands, Global Installation, Links, Quickstart

### Community 9 - "versions.ts"
Cohesion: 0.08
Nodes (36): dynamic, metadata, CreatePromptForm(), CreateSamplePromptButton(), emptySubscribe(), getOrigin(), getSSROrigin(), PromptDetailClient() (+28 more)

### Community 10 - "actions/webhooks.ts"
Cohesion: 0.16
Nodes (16): RFC-1918, dynamic, metadata, WebhooksPage(), Webhook, WebhooksClient(), WebhooksClientProps, createWebhook() (+8 more)

### Community 11 - "SqliteStorageAdapter"
Cohesion: 0.17
Nodes (8): mapPrompt(), mapTestCase(), mapTestResult(), mapVersion(), parseBundle(), parseVariables(), query(), SqliteStorageAdapter

### Community 12 - "[[...sign-in]]/page.tsx"
Cohesion: 0.20
Nodes (5): hasClerkKeys, metadata, hasClerkKeys, metadata, clerkAppearance

### Community 15 - "opengraph-image.tsx"
Cohesion: 0.40
Nodes (3): alt, contentType, size

### Community 17 - "proxy.ts"
Cohesion: 0.47
Nodes (5): config, hasClerkKeys, isAuthRoute, isProtectedRoute, middleware()

### Community 40 - "README.md"
Cohesion: 0.10
Nodes (19): Code of Conduct, Contributing to Git for Prompts, Development Setup, How Can I Contribute?, Pull Requests, Reporting Bugs, Style Guide, Suggesting Enhancements (+11 more)

### Community 41 - "ARCHITECTURE.md — The Technical Blueprint (Version 1)"
Cohesion: 0.11
Nodes (17): 1. PROJECT OVERVIEW & BUSINESS LOGIC, 2. SYSTEM ARCHITECTURE, 3. DATABASE SCHEMA, 4. DEEP MODULE ARCHITECTURE & SEAMS, 5. SYNC PROTOCOL (cloud ↔ local), 6. ADRs — Architecture Decision Records, ARCHITECTURE.md — The Technical Blueprint (Version 1), Bundle JSON Schema (stored in `bundle` column) (+9 more)

### Community 42 - "AI fills and maintains this via @GRILL. You rarely edit this manually."
Cohesion: 0.14
Nodes (13): ADRs — Architecture Decision Records, AI fills and maintains this via @GRILL. You rarely edit this manually., Bugs Fixed, Business Rules (Never Break), CONTEXT.md — Domain Language, Core Entities, Database Schema, Feature Status (+5 more)

### Community 44 - "Log Entries"
Cohesion: 0.14
Nodes (13): [GFP — 26.5s Master Launch Video Edit, Direction 1 Linear/Warp Organic Audio & 2026 Live Benchmarks] 2026-08-20, [GFP — Adversarial Security Hardening, Whole-Repo Audit & Production Launch Readiness] 2026-09-04, [GFP — Brutal Strategy Teardown, Whole-Repo Ponytail Cleanup & Master 2K Launch Video Export] 2026-08-21, [GFP — Color Token Purge, Vercel Pure Black Migration & Build Optimizations] 2026-08-10, [GFP — GitHub Actions CI Package Filter Fix & Monorepo Alignment] 2026-09-05, [GFP — Hero Dashboard Replica, Mobile Overhaul, SEO & GitHub Actions CI Fix] 2026-08-12, [GFP — Icon & Favicon Dark Background Standardization] 2026-08-13, [GFP — Master Design System, Motion Engineering, P0 Security Engine & CI Hardening] 2026-08-11 (+5 more)

### Community 46 - "Git for Prompts — Design System Specification"
Cohesion: 0.25
Nodes (7): 1. Product Identity & Aesthetics, 2. Color Palette & Dark Theme Tokens, 3. Typography Hierarchy, 4. Motion & Micro-Interactions, 5. Touch Target & Accessibility Standards, Git for Prompts — Design System Specification, Semantic Badges & Accents

### Community 48 - "Threat Model — Git for Prompts"
Cohesion: 0.40
Nodes (4): 1. Attacker Personas, 2. Asset Inventory & Protection Requirements, 3. Vulnerability Vector Evaluation Matrix, Threat Model — Git for Prompts

### Community 58 - "getAuthUserId"
Cohesion: 0.06
Nodes (58): dynamic, GET(), bodySchema, dynamic, POST(), createPromptBodySchema, dynamic, GET() (+50 more)

## Knowledge Gaps
- **202 isolated node(s):** `eslintConfig`, `nextConfig`, `AddOptions`, `AuthOptions`, `PullOptions` (+197 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getAuthUserId()` connect `getAuthUserId` to `test-runner.tsx`, `regression-tests/route.ts`, `tests.ts`, `versions.ts`, `actions/webhooks.ts`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `db` connect `getAuthUserId` to `versions.ts`, `actions/webhooks.ts`, `regression-tests/route.ts`, `tests.ts`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `DashboardSidebar()` connect `ui-tokens.tsx` to `getAuthUserId`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `AddOptions` to the rest of the system?**
  _202 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `core/src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08038075092543628 - nodes in this community are weakly interconnected._
- **Should `test-runner.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10846560846560846 - nodes in this community are weakly interconnected._
- **Should `ui-tokens.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06485671191553545 - nodes in this community are weakly interconnected._