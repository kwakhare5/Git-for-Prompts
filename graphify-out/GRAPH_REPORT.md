# Graph Report - Git for Prompts  (2026-10-14)

## Corpus Check
- 176 files · ~76,238 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 764 nodes · 1460 edges · 54 communities (42 shown, 12 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.61)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0c97be6d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- DeveloperFooter.tsx
- core/src/index.ts
- test-runner.tsx
- ui-tokens.tsx
- createSqliteAdapter
- validations.test.ts
- prompt-editor.tsx
- rate-limit.ts
- cli/README.md
- getAuthUserId
- webhooks-client.tsx
- SqliteStorageAdapter
- [[...sign-in]]/page.tsx
- AGENTS.md - Git for Prompts
- brand-logo.tsx
- opengraph-image.tsx
- status/route.ts
- proxy.ts
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- robots.ts
- sitemap.ts
- prompt-detail-client.tsx
- README.md
- ARCHITECTURE.md — The Technical Blueprint (Version 1)
- AI fills and maintains this via @GRILL. You rarely edit this manually.
- ai.ts
- Log entries
- Core API
- Git for Prompts — Design System Specification
- Threat Model — Git for Prompts
- API Security Matrix
- validations.ts
- markdown/route.ts
- mcp/route.ts
- llms.txt/route.ts
- app/not-found.tsx

## God Nodes (most connected - your core abstractions)
1. `getAuthUserId()` - 45 edges
2. `db` - 28 edges
3. `createSqliteAdapter()` - 21 edges
4. `getDbPath()` - 20 edges
5. `checkRateLimit()` - 20 edges
6. `SqliteStorageAdapter` - 18 edges
7. `Log entries` - 17 edges
8. `prompts` - 16 edges
9. `versions` - 16 edges
10. `StorageAdapter` - 15 edges

## Surprising Connections (you probably didn't know these)
- `generateMetadata()` --calls--> `getAuthUserId()`  [EXTRACTED]
  src/app/(dashboard)/dashboard/prompts/[id]/compare/page.tsx → src/lib/auth.ts
- `ComparePage()` --calls--> `getAuthUserId()`  [EXTRACTED]
  src/app/(dashboard)/dashboard/prompts/[id]/compare/page.tsx → src/lib/auth.ts
- `generateMetadata()` --calls--> `getAuthUserId()`  [EXTRACTED]
  src/app/(dashboard)/dashboard/prompts/[id]/diff/page.tsx → src/lib/auth.ts
- `DiffPage()` --calls--> `getAuthUserId()`  [EXTRACTED]
  src/app/(dashboard)/dashboard/prompts/[id]/diff/page.tsx → src/lib/auth.ts
- `generateMetadata()` --calls--> `getAuthUserId()`  [EXTRACTED]
  src/app/(dashboard)/dashboard/prompts/[id]/edit/page.tsx → src/lib/auth.ts

## Import Cycles
- None detected.

## Communities (54 total, 12 thin omitted)

### Community 0 - "DeveloperFooter.tsx"
Cohesion: 0.12
Nodes (11): dynamic, metadata, dynamic, metadata, EndpointsSection(), dynamic, metadata, dynamic (+3 more)

### Community 1 - "core/src/index.ts"
Cohesion: 0.06
Nodes (51): DEFAULT_AI_TIMEOUT_MS, DEFAULT_GROQ_EVALUATION_MODEL, DEFAULT_GROQ_EXECUTION_MODEL, DEFAULT_MAX_CONCURRENT_TESTS, DEFAULT_OPENROUTER_EVALUATION_MODEL, DEFAULT_OPENROUTER_EXECUTION_MODEL, FRONTIER_OPENROUTER_EVALUATION_MODEL, GROQ_URL (+43 more)

### Community 2 - "test-runner.tsx"
Cohesion: 0.09
Nodes (23): CellStatus, CompareRunner(), CompareRunnerProps, TestCase, Version, DiffVersionSelector(), DiffVersionSelectorProps, Version (+15 more)

### Community 3 - "ui-tokens.tsx"
Cohesion: 0.06
Nodes (42): dynamic, Home(), instrumentSerif, metadata, plusJakartaSans, viewport, PromptGridView(), PromptGridViewProps (+34 more)

### Community 4 - "createSqliteAdapter"
Cohesion: 0.12
Nodes (34): AddOptions, cmdAdd(), AuthOptions, cmdAuth(), cmdDiff(), cmdHistory(), cmdInit(), cmdList() (+26 more)

### Community 5 - "validations.test.ts"
Cohesion: 0.17
Nodes (13): RFC-4122, createApiKeySchema, deleteApiKeySchema, CreatePromptInput, createPromptSchema, deletePromptSchema, updatePromptSchema, createTestCaseSchema (+5 more)

### Community 6 - "prompt-editor.tsx"
Cohesion: 0.09
Nodes (28): DiffStats, DiffViewer(), DiffViewerProps, MonacoDiffEditor, StandaloneDiffEditor, BundleModelTab(), BundleModelTabProps, DEFAULT_MODELS (+20 more)

### Community 7 - "rate-limit.ts"
Cohesion: 0.19
Nodes (16): dynamic, GET(), POST(), dynamic, GET(), POST(), authenticateApiKey(), checkRateLimit() (+8 more)

### Community 8 - "cli/README.md"
Cohesion: 0.40
Nodes (4): Commands, Global Installation, Links, Quickstart

### Community 9 - "getAuthUserId"
Cohesion: 0.06
Nodes (78): dynamic, GET(), maxDuration, POST(), bodySchema, dynamic, ApiKeysPage(), dynamic (+70 more)

### Community 10 - "webhooks-client.tsx"
Cohesion: 0.16
Nodes (13): RFC-1918, dynamic, metadata, WebhooksPage(), Webhook, WebhooksClient(), WebhooksClientProps, createWebhook() (+5 more)

### Community 11 - "SqliteStorageAdapter"
Cohesion: 0.17
Nodes (9): mapPrompt(), mapTestCase(), mapTestResult(), mapVersion(), parseBundle(), parseVariables(), query(), RawRow (+1 more)

### Community 12 - "[[...sign-in]]/page.tsx"
Cohesion: 0.20
Nodes (5): hasClerkKeys, metadata, hasClerkKeys, metadata, clerkAppearance

### Community 13 - "AGENTS.md - Git for Prompts"
Cohesion: 0.25
Nodes (7): AGENTS.md - Git for Prompts, Commands (how to run/build/test), Design source of truth, Gotchas (project decisions), Issue tracker, Stack, What this is

### Community 15 - "opengraph-image.tsx"
Cohesion: 0.40
Nodes (3): alt, contentType, size

### Community 17 - "proxy.ts"
Cohesion: 0.47
Nodes (5): config, hasClerkKeys, isAuthRoute, isProtectedRoute, middleware()

### Community 38 - "prompt-detail-client.tsx"
Cohesion: 0.09
Nodes (25): dynamic, metadata, ApiKeyRow, ApiKeysManager(), emptySubscribe(), getOrigin(), getSSROrigin(), Props (+17 more)

### Community 40 - "README.md"
Cohesion: 0.05
Nodes (38): Code of Conduct, Contributing to Git for Prompts, Development Setup, How Can I Contribute?, Pull Requests, Reporting Bugs, Style Guide, Suggesting Enhancements (+30 more)

### Community 41 - "ARCHITECTURE.md — The Technical Blueprint (Version 1)"
Cohesion: 0.11
Nodes (17): 1. PROJECT OVERVIEW & BUSINESS LOGIC, 2. SYSTEM ARCHITECTURE, 3. DATABASE SCHEMA, 4. DEEP MODULE ARCHITECTURE & SEAMS, 5. SYNC PROTOCOL (cloud ↔ local), 6. ADRs — Architecture Decision Records, ARCHITECTURE.md — The Technical Blueprint (Version 1), Bundle JSON Schema (stored in `bundle` column) (+9 more)

### Community 42 - "AI fills and maintains this via @GRILL. You rarely edit this manually."
Cohesion: 0.14
Nodes (13): ADRs — Architecture Decision Records, AI fills and maintains this via @GRILL. You rarely edit this manually., Bugs Fixed, Business Rules (Never Break), CONTEXT.md — Domain Language, Core Entities, Database Schema, Feature Status (+5 more)

### Community 43 - "ai.ts"
Cohesion: 0.27
Nodes (9): AIPurpose, AIResponse, callAI(), evaluateOutput(), evaluationResultSchema, fetchWithTimeout(), Message, runPromptAgainstInput() (+1 more)

### Community 44 - "Log entries"
Cohesion: 0.08
Nodes (24): Entry schema, [GFP — 26.5s Master Launch Video Edit, Direction 1 Linear/Warp Organic Audio & 2026 Live Benchmarks] 2026-08-20, [GFP — Adversarial Security Hardening, Whole-Repo Audit & Production Launch Readiness] 2026-09-04, [GFP — Brutal Strategy Teardown, Whole-Repo Ponytail Cleanup & Master 2K Launch Video Export] 2026-08-21, [GFP — Color Token Purge, Vercel Pure Black Migration & Build Optimizations] 2026-08-10, [GFP — GitHub Actions CI Package Filter Fix & Monorepo Alignment] 2026-09-05, [GFP — Hero Dashboard Replica, Mobile Overhaul, SEO & GitHub Actions CI Fix] 2026-08-12, [GFP — Icon & Favicon Dark Background Standardization] 2026-08-13 (+16 more)

### Community 45 - "Core API"
Cohesion: 0.20
Nodes (9): 1. Bundle Validation & Schema, 2. Variable Extraction & Interpolation, 3. Structural Diffing, 4. Running Evaluations, Capabilities, Core API, @gfp/core, Installation (+1 more)

### Community 46 - "Git for Prompts — Design System Specification"
Cohesion: 0.25
Nodes (7): 1. Product Identity & Aesthetics, 2. Color Palette & Dark Theme Tokens, 3. Typography Hierarchy, 4. Motion & Micro-Interactions, 5. Touch Target & Accessibility Standards, Git for Prompts — Design System Specification, Semantic Badges & Accents

### Community 48 - "Threat Model — Git for Prompts"
Cohesion: 0.40
Nodes (4): 1. Attacker Personas, 2. Asset Inventory & Protection Requirements, 3. Vulnerability Vector Evaluation Matrix, Threat Model — Git for Prompts

### Community 51 - "validations.ts"
Cohesion: 0.12
Nodes (14): createApiKeySchema, CreatePromptInput, createPromptSchema, createTestCaseSchema, createVersionSchema, createWebhookSchema, deleteApiKeySchema, deletePromptSchema (+6 more)

## Knowledge Gaps
- **249 isolated node(s):** `eslintConfig`, `nextConfig`, `AddOptions`, `AuthOptions`, `PullOptions` (+244 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getAuthUserId()` connect `getAuthUserId` to `webhooks-client.tsx`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `db` connect `getAuthUserId` to `rate-limit.ts`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `prompts` connect `getAuthUserId` to `rate-limit.ts`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `AddOptions` to the rest of the system?**
  _249 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `DeveloperFooter.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11688311688311688 - nodes in this community are weakly interconnected._
- **Should `core/src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.058596491228070174 - nodes in this community are weakly interconnected._
- **Should `test-runner.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0855614973262032 - nodes in this community are weakly interconnected._