# Graph Report - Git for Prompts  (2026-09-09)

## Corpus Check
- 168 files · ~72,166 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 695 nodes · 1366 edges · 58 communities (43 shown, 15 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1dd6cde6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- DeveloperFooter.tsx
- core/src/index.ts
- test-runner.tsx
- ui-tokens.tsx
- createSqliteAdapter
- (landing)/page.tsx
- prompt-editor.tsx
- api-keys.ts
- cli/README.md
- getAuthUserId
- ssrf.ts
- sqlite.ts
- [[...sign-in]]/page.tsx
- schema.ts
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
- ai.ts
- Log Entries
- StorageAdapter
- Git for Prompts — Design System Specification
- (dashboard)/layout.tsx
- Threat Model — Git for Prompts
- API Security Matrix
- app/layout.tsx
- relative-time.tsx
- mcp/route.ts
- markdown/route.ts
- llms.txt/route.ts
- app/not-found.tsx
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
- `generateMetadata()` --calls--> `getAuthUserId()`  [EXTRACTED]
  src/app/(dashboard)/dashboard/prompts/[id]/diff/page.tsx → src/lib/auth.ts
- `DiffPage()` --calls--> `getAuthUserId()`  [EXTRACTED]
  src/app/(dashboard)/dashboard/prompts/[id]/diff/page.tsx → src/lib/auth.ts
- `DashboardLayout()` --calls--> `getAuthUserId()`  [EXTRACTED]
  src/app/(dashboard)/layout.tsx → src/lib/auth.ts
- `createSqliteAdapter()` --calls--> `runMigrations()`  [EXTRACTED]
  packages/cli/src/db/sqlite.ts → packages/cli/src/db/migrations.ts
- `ApiKeysPage()` --calls--> `getAuthUserId()`  [EXTRACTED]
  src/app/(dashboard)/dashboard/api-keys/page.tsx → src/lib/auth.ts

## Import Cycles
- None detected.

## Communities (58 total, 15 thin omitted)

### Community 0 - "DeveloperFooter.tsx"
Cohesion: 0.17
Nodes (8): dynamic, metadata, dynamic, metadata, dynamic, metadata, DeveloperFooter(), GithubIcon()

### Community 1 - "core/src/index.ts"
Cohesion: 0.08
Nodes (50): DEFAULT_AI_TIMEOUT_MS, DEFAULT_GROQ_EVALUATION_MODEL, DEFAULT_GROQ_EXECUTION_MODEL, DEFAULT_MAX_CONCURRENT_TESTS, DEFAULT_OPENROUTER_EVALUATION_MODEL, DEFAULT_OPENROUTER_EXECUTION_MODEL, FRONTIER_OPENROUTER_EVALUATION_MODEL, GROQ_URL (+42 more)

### Community 2 - "test-runner.tsx"
Cohesion: 0.08
Nodes (27): Webhook, WebhooksClientProps, CompareRunner(), CompareRunnerProps, DiffVersionSelector(), DiffVersionSelectorProps, Version, CellStatus (+19 more)

### Community 3 - "ui-tokens.tsx"
Cohesion: 0.19
Nodes (13): PromptRepositoriesList(), PromptRepositoriesListProps, PromptWithStats, DashboardHeroReplicaProps, DEMO_PROMPTS, PromptSummary, BadgePastel(), ButtonPrimary() (+5 more)

### Community 4 - "createSqliteAdapter"
Cohesion: 0.12
Nodes (33): AddOptions, cmdAdd(), AuthOptions, cmdAuth(), cmdDiff(), cmdHistory(), cmdInit(), cmdList() (+25 more)

### Community 5 - "(landing)/page.tsx"
Cohesion: 0.19
Nodes (9): dynamic, AboutSection(), BentoFeatures(), EngineShowcase(), FaqFooter(), HeroSection(), JsonLd(), PromptStudioShowcase() (+1 more)

### Community 6 - "prompt-editor.tsx"
Cohesion: 0.07
Nodes (29): dynamic, metadata, DiffStats, DiffViewer(), DiffViewerProps, MonacoDiffEditor, StandaloneDiffEditor, BundleModelTab() (+21 more)

### Community 7 - "api-keys.ts"
Cohesion: 0.12
Nodes (22): RFC-4122, ApiKeysPage(), dynamic, metadata, ApiKeyRow, ApiKeysManager(), emptySubscribe(), getOrigin() (+14 more)

### Community 8 - "cli/README.md"
Cohesion: 0.40
Nodes (4): Commands, Global Installation, Links, Quickstart

### Community 9 - "getAuthUserId"
Cohesion: 0.07
Nodes (46): ComparePage(), generateMetadata(), dynamic, EditPromptPage(), generateMetadata(), generateMetadata(), PromptDetailPage(), generateMetadata() (+38 more)

### Community 10 - "ssrf.ts"
Cohesion: 0.43
Nodes (5): RFC-1918, DnsLookupFn, isPrivateOrReservedIp(), SsrfValidationResult, validateWebhookUrl()

### Community 11 - "sqlite.ts"
Cohesion: 0.15
Nodes (10): runMigrations(), mapPrompt(), mapTestCase(), mapTestResult(), mapVersion(), parseBundle(), parseVariables(), query() (+2 more)

### Community 12 - "[[...sign-in]]/page.tsx"
Cohesion: 0.20
Nodes (5): hasClerkKeys, metadata, hasClerkKeys, metadata, clerkAppearance

### Community 13 - "schema.ts"
Cohesion: 0.06
Nodes (62): dynamic, maxDuration, POST(), dynamic, GET(), bodySchema, dynamic, POST() (+54 more)

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

### Community 43 - "ai.ts"
Cohesion: 0.27
Nodes (10): AIPurpose, AIResponse, callAI(), evaluateOutput(), evaluationResultSchema, extractJson(), fetchWithTimeout(), Message (+2 more)

### Community 44 - "Log Entries"
Cohesion: 0.12
Nodes (15): [GFP — 26.5s Master Launch Video Edit, Direction 1 Linear/Warp Organic Audio & 2026 Live Benchmarks] 2026-08-20, [GFP — Adversarial Security Hardening, Whole-Repo Audit & Production Launch Readiness] 2026-09-04, [GFP — Brutal Strategy Teardown, Whole-Repo Ponytail Cleanup & Master 2K Launch Video Export] 2026-08-21, [GFP — Color Token Purge, Vercel Pure Black Migration & Build Optimizations] 2026-08-10, [GFP — GitHub Actions CI Package Filter Fix & Monorepo Alignment] 2026-09-05, [GFP — Hero Dashboard Replica, Mobile Overhaul, SEO & GitHub Actions CI Fix] 2026-08-12, [GFP — Icon & Favicon Dark Background Standardization] 2026-08-13, [GFP — Icon & Favicon Unification on src/app/icon.svg] 2026-09-07 (+7 more)

### Community 46 - "Git for Prompts — Design System Specification"
Cohesion: 0.25
Nodes (7): 1. Product Identity & Aesthetics, 2. Color Palette & Dark Theme Tokens, 3. Typography Hierarchy, 4. Motion & Micro-Interactions, 5. Touch Target & Accessibility Standards, Git for Prompts — Design System Specification, Semantic Badges & Accents

### Community 47 - "(dashboard)/layout.tsx"
Cohesion: 0.16
Nodes (11): DashboardLayout(), Home(), FeedbackModal(), DashboardSidebar(), DashboardSidebarProps, PromptSummary, TopHeaderBar(), DashboardHeroReplica() (+3 more)

### Community 48 - "Threat Model — Git for Prompts"
Cohesion: 0.40
Nodes (4): 1. Attacker Personas, 2. Asset Inventory & Protection Requirements, 3. Vulnerability Vector Evaluation Matrix, Threat Model — Git for Prompts

### Community 50 - "app/layout.tsx"
Cohesion: 0.29
Nodes (5): instrumentSerif, metadata, plusJakartaSans, viewport, Navbar()

### Community 51 - "relative-time.tsx"
Cohesion: 0.60
Nodes (5): emptySubscribe(), getRelativeTimeString(), getServerSnapshot(), getSnapshot(), RelativeTime()

## Knowledge Gaps
- **204 isolated node(s):** `eslintConfig`, `nextConfig`, `AddOptions`, `AuthOptions`, `PullOptions` (+199 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getAuthUserId()` connect `getAuthUserId` to `(dashboard)/layout.tsx`, `schema.ts`, `api-keys.ts`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `db` connect `schema.ts` to `getAuthUserId`, `api-keys.ts`, `(dashboard)/layout.tsx`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `prompts` connect `schema.ts` to `getAuthUserId`, `(dashboard)/layout.tsx`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `AddOptions` to the rest of the system?**
  _204 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `core/src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08038075092543628 - nodes in this community are weakly interconnected._
- **Should `test-runner.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07564102564102564 - nodes in this community are weakly interconnected._
- **Should `createSqliteAdapter` be split into smaller, more focused modules?**
  _Cohesion score 0.11690821256038647 - nodes in this community are weakly interconnected._