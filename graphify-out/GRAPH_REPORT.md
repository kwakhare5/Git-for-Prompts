# Graph Report - Git for Prompts  (2026-09-04)

## Corpus Check
- 159 files · ~68,688 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 690 nodes · 1350 edges · 56 communities (49 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dcf03779`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- prompts/index.ts
- core/src/index.ts
- test-runner.tsx
- ui-tokens.tsx
- createSqliteAdapter
- regression-tests/route.ts
- prompt-editor.tsx
- sqlite.ts
- cli/README.md
- getAuthUserId
- webhooks-client.tsx
- checkRateLimit
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
- ARCHITECTURE.md — The Technical Blueprint (Version 1)
- AI fills and maintains this via @GRILL. You rarely edit this manually.
- 2. Deep Module-by-Module Audit
- Log Entries
- 2. 5-Act Master Storyboard (26.5s / 795 Frames @ 30fps)
- Git for Prompts — Design System Specification
- StorageAdapter
- Threat Model — Git for Prompts
- API Security Matrix
- validations.test.ts
- api-keys-manager.tsx
- tests.ts
- compare-runner.tsx
- diff-version-selector.tsx
- relative-time.tsx

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
- `EditPromptPage()` --calls--> `getAuthUserId()`  [EXTRACTED]
  src/app/(dashboard)/dashboard/prompts/[id]/edit/page.tsx → src/lib/auth.ts
- `generateMetadata()` --calls--> `getAuthUserId()`  [EXTRACTED]
  src/app/(dashboard)/dashboard/prompts/[id]/edit/page.tsx → src/lib/auth.ts
- `CreatePromptForm()` --calls--> `createPrompt()`  [EXTRACTED]
  src/components/domain/prompts/create-prompt-form.tsx → src/lib/actions/prompts.ts
- `createPrompt()` --calls--> `checkRateLimit()`  [EXTRACTED]
  src/lib/actions/prompts.ts → src/lib/rate-limit.ts
- `TestRunner()` --calls--> `createTestCase()`  [EXTRACTED]
  src/components/domain/testing/test-runner.tsx → src/lib/actions/tests.ts

## Import Cycles
- None detected.

## Communities (56 total, 7 thin omitted)

### Community 0 - "prompts/index.ts"
Cohesion: 0.22
Nodes (5): dynamic, metadata, CreatePromptForm(), PromptSubnav(), PromptSubnavProps

### Community 1 - "core/src/index.ts"
Cohesion: 0.08
Nodes (50): DEFAULT_AI_TIMEOUT_MS, DEFAULT_GROQ_EVALUATION_MODEL, DEFAULT_GROQ_EXECUTION_MODEL, DEFAULT_MAX_CONCURRENT_TESTS, DEFAULT_OPENROUTER_EVALUATION_MODEL, DEFAULT_OPENROUTER_EXECUTION_MODEL, FRONTIER_OPENROUTER_EVALUATION_MODEL, GROQ_URL (+42 more)

### Community 2 - "test-runner.tsx"
Cohesion: 0.17
Nodes (13): TestCaseCard(), TestCaseCardProps, TestResult, AddTestCaseForm, addTestCaseSchema, TestRunner(), TestRunnerProps, TestCase (+5 more)

### Community 3 - "ui-tokens.tsx"
Cohesion: 0.07
Nodes (34): Home(), instrumentSerif, metadata, plusJakartaSans, viewport, PromptRepositoriesList(), PromptRepositoriesListProps, PromptWithStats (+26 more)

### Community 4 - "createSqliteAdapter"
Cohesion: 0.12
Nodes (33): AddOptions, cmdAdd(), AuthOptions, cmdAuth(), cmdDiff(), cmdHistory(), cmdInit(), cmdList() (+25 more)

### Community 5 - "regression-tests/route.ts"
Cohesion: 0.14
Nodes (20): dynamic, maxDuration, POST(), testResults, AIPurpose, AIResponse, callAI(), evaluateOutput() (+12 more)

### Community 6 - "prompt-editor.tsx"
Cohesion: 0.09
Nodes (25): DiffStats, DiffViewer(), DiffViewerProps, MonacoDiffEditor, StandaloneDiffEditor, BundleModelTab(), BundleModelTabProps, DEFAULT_MODELS (+17 more)

### Community 7 - "sqlite.ts"
Cohesion: 0.15
Nodes (10): runMigrations(), mapPrompt(), mapTestCase(), mapTestResult(), mapVersion(), parseBundle(), parseVariables(), query() (+2 more)

### Community 8 - "cli/README.md"
Cohesion: 0.40
Nodes (4): Commands, Global Installation, Links, Quickstart

### Community 9 - "getAuthUserId"
Cohesion: 0.06
Nodes (66): bodySchema, dynamic, POST(), DashboardPage(), dynamic, getPromptsWithStats(), metadata, ComparePage() (+58 more)

### Community 10 - "webhooks-client.tsx"
Cohesion: 0.13
Nodes (16): RFC-1918, dynamic, metadata, WebhooksPage(), Webhook, WebhooksClient(), WebhooksClientProps, DeleteConfirmButton() (+8 more)

### Community 11 - "checkRateLimit"
Cohesion: 0.18
Nodes (17): dynamic, GET(), createPromptBodySchema, dynamic, GET(), POST(), authenticateApiKey(), AuthenticatedKey (+9 more)

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
Cohesion: 0.10
Nodes (19): Code of Conduct, Contributing to Git for Prompts, Development Setup, How Can I Contribute?, Pull Requests, Reporting Bugs, Style Guide, Suggesting Enhancements (+11 more)

### Community 41 - "ARCHITECTURE.md — The Technical Blueprint (Version 1)"
Cohesion: 0.11
Nodes (17): 1. PROJECT OVERVIEW & BUSINESS LOGIC, 2. SYSTEM ARCHITECTURE, 3. DATABASE SCHEMA, 4. DEEP MODULE ARCHITECTURE & SEAMS, 5. SYNC PROTOCOL (cloud ↔ local), 6. ADRs — Architecture Decision Records, ARCHITECTURE.md — The Technical Blueprint (Version 1), Bundle JSON Schema (stored in `bundle` column) (+9 more)

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

### Community 50 - "validations.test.ts"
Cohesion: 0.23
Nodes (9): RFC-4122, createApiKeySchema, deleteApiKeySchema, CreatePromptInput, createPromptSchema, deletePromptSchema, updatePromptSchema, createVersionSchema (+1 more)

### Community 51 - "api-keys-manager.tsx"
Cohesion: 0.22
Nodes (12): ApiKeysPage(), dynamic, metadata, ApiKeyRow, ApiKeysManager(), emptySubscribe(), getOrigin(), getSSROrigin() (+4 more)

### Community 52 - "tests.ts"
Cohesion: 0.29
Nodes (9): ComparisonResult, runComparisonForVersions(), runTestsForVersion(), TestCaseOutcome, persistResults(), createTestCaseSchema, deleteTestCaseSchema, runComparisonSchema (+1 more)

### Community 53 - "compare-runner.tsx"
Cohesion: 0.29
Nodes (7): CompareRunner(), CompareRunnerProps, CellStatus, TestCase, useCompareRunner(), Version, VersionResults

### Community 54 - "diff-version-selector.tsx"
Cohesion: 0.43
Nodes (4): DiffVersionSelector(), DiffVersionSelectorProps, Version, formatVersionLabel()

### Community 55 - "relative-time.tsx"
Cohesion: 0.60
Nodes (5): emptySubscribe(), getRelativeTimeString(), getServerSnapshot(), getSnapshot(), RelativeTime()

## Knowledge Gaps
- **217 isolated node(s):** `How to Maintain This Journal (For the Agent)`, `[GFP — Adversarial Security Hardening, Whole-Repo Audit & Production Launch Readiness] 2026-09-04`, `[GFP — Brutal Strategy Teardown, Whole-Repo Ponytail Cleanup & Master 2K Launch Video Export] 2026-08-21`, `[GFP — 26.5s Master Launch Video Edit, Direction 1 Linear/Warp Organic Audio & 2026 Live Benchmarks] 2026-08-20`, `[GFP — Remotion Launch Video Engine, File Reorganization & Codebase Pruning] 2026-08-19` (+212 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getAuthUserId()` connect `getAuthUserId` to `webhooks-client.tsx`, `test-runner.tsx`, `api-keys-manager.tsx`, `tests.ts`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `db` connect `getAuthUserId` to `checkRateLimit`, `tests.ts`, `regression-tests/route.ts`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `versions` connect `getAuthUserId` to `checkRateLimit`, `tests.ts`, `regression-tests/route.ts`, `diff-version-selector.tsx`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `How to Maintain This Journal (For the Agent)`, `[GFP — Adversarial Security Hardening, Whole-Repo Audit & Production Launch Readiness] 2026-09-04`, `[GFP — Brutal Strategy Teardown, Whole-Repo Ponytail Cleanup & Master 2K Launch Video Export] 2026-08-21` to the rest of the system?**
  _217 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `core/src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08038075092543628 - nodes in this community are weakly interconnected._
- **Should `ui-tokens.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06972789115646258 - nodes in this community are weakly interconnected._
- **Should `createSqliteAdapter` be split into smaller, more focused modules?**
  _Cohesion score 0.11690821256038647 - nodes in this community are weakly interconnected._