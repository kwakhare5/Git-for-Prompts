# Graph Report - Git for Prompts  (2026-08-14)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 844 nodes · 1515 edges · 82 communities (62 shown, 20 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a1350816`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- core/src/index.ts
- prompts.ts
- compilerOptions
- devDependencies
- ui-tokens.tsx
- tests.ts
- cli/src/index.ts
- prompt-editor.tsx
- sqlite.ts
- cli/package.json
- getAuthUserId
- components.json
- api-keys.ts
- compilerOptions
- prompts
- ai.ts
- db/index.ts
- schema.ts
- actions/webhooks.ts
- (landing)/explore/page.tsx
- 0000_sparkling_scrambler.sql
- rate-limit.ts
- [[...sign-in]]/page.tsx
- dependencies
- .prettierrc.json
- scripts
- ssrf.ts
- dashboard/page.tsx
- brand-logo.tsx
- package.json
- @clerk/themes
- opengraph-image.tsx
- status/route.ts
- proxy.ts
- 0004_audit_fixes.sql
- "webhooks"
- date-fns
- eslint.config.mjs
- lucide-react
- @monaco-editor/react
- next
- next.config.ts
- postgres
- react
- react-hook-form
- @upstash/ratelimit
- @upstash/redis
- @vercel/analytics
- zod
- postcss.config.mjs
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `getAuthUserId()` - 46 edges
2. `db` - 33 edges
3. `prompts` - 21 edges
4. `versions` - 21 edges
5. `getDbPath()` - 20 edges
6. `createSqliteAdapter()` - 20 edges
7. `SqliteStorageAdapter` - 18 edges
8. `checkRateLimit()` - 17 edges
9. `compilerOptions` - 17 edges
10. `compilerOptions` - 16 edges

## Surprising Connections (you probably didn't know these)
- `exclude` --extends--> `node_modules`  [EXTRACTED]
  packages/cli/tsconfig.json → tsconfig.json
- `exclude` --extends--> `node_modules`  [EXTRACTED]
  packages/core/tsconfig.json → tsconfig.json
- `createPrompt()` --calls--> `getAuthUserId()`  [EXTRACTED]
  src/lib/actions/prompts.ts → src/lib/auth.ts
- `createPrompt()` --calls--> `checkRateLimit()`  [EXTRACTED]
  src/lib/actions/prompts.ts → src/lib/rate-limit.ts
- `deletePrompt()` --calls--> `getAuthUserId()`  [EXTRACTED]
  src/lib/actions/prompts.ts → src/lib/auth.ts

## Import Cycles
- None detected.

## Communities (82 total, 20 thin omitted)

### Community 0 - "core/src/index.ts"
Cohesion: 0.06
Nodes (49): DEFAULT_AI_TIMEOUT_MS, DEFAULT_GROQ_EVALUATION_MODEL, DEFAULT_GROQ_EXECUTION_MODEL, DEFAULT_MAX_CONCURRENT_TESTS, DEFAULT_OPENROUTER_EVALUATION_MODEL, DEFAULT_OPENROUTER_EXECUTION_MODEL, GROQ_URL, OPENROUTER_URL (+41 more)

### Community 1 - "prompts.ts"
Cohesion: 0.09
Nodes (34): dynamic, metadata, CreatePromptForm(), CreateSamplePromptButton(), ForkButton(), ForkButtonProps, emptySubscribe(), getOrigin() (+26 more)

### Community 2 - "compilerOptions"
Cohesion: 0.04
Nodes (46): compilerOptions, declaration, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution, outDir (+38 more)

### Community 3 - "devDependencies"
Cohesion: 0.04
Nodes (45): dotenv, drizzle-kit, eslint, eslint-config-next, devDependencies, dotenv, drizzle-kit, eslint (+37 more)

### Community 4 - "ui-tokens.tsx"
Cohesion: 0.07
Nodes (32): dynamic, Home(), instrumentSerif, metadata, plusJakartaSans, DashboardWorkspaceView(), DashboardWorkspaceViewProps, PromptRepositoriesListProps (+24 more)

### Community 5 - "tests.ts"
Cohesion: 0.08
Nodes (33): CompareRunner(), CompareRunnerProps, DiffVersionSelector(), DiffVersionSelectorProps, Version, CellStatus, TestCase, useCompareRunner() (+25 more)

### Community 6 - "cli/src/index.ts"
Cohesion: 0.12
Nodes (33): AddOptions, cmdAdd(), AuthOptions, cmdAuth(), cmdDiff(), cmdHistory(), cmdInit(), cmdList() (+25 more)

### Community 7 - "prompt-editor.tsx"
Cohesion: 0.09
Nodes (25): DiffStats, DiffViewer(), DiffViewerProps, MonacoDiffEditor, StandaloneDiffEditor, BundleModelTab(), BundleModelTabProps, DEFAULT_MODELS (+17 more)

### Community 8 - "sqlite.ts"
Cohesion: 0.15
Nodes (10): runMigrations(), mapPrompt(), mapTestCase(), mapTestResult(), mapVersion(), parseBundle(), parseVariables(), query() (+2 more)

### Community 9 - "cli/package.json"
Cohesion: 0.07
Nodes (27): commander, @gfp/core, @gfp/core, bin, gfp, dependencies, commander, @gfp/core (+19 more)

### Community 10 - "getAuthUserId"
Cohesion: 0.13
Nodes (20): ComparePage(), dynamic, generateMetadata(), DiffPage(), dynamic, generateMetadata(), Version, dynamic (+12 more)

### Community 11 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 12 - "api-keys.ts"
Cohesion: 0.17
Nodes (16): RFC-4122, ApiKeysPage(), dynamic, metadata, ApiKeyRow, ApiKeysManager(), emptySubscribe(), getOrigin() (+8 more)

### Community 13 - "compilerOptions"
Cohesion: 0.10
Nodes (21): dom, dom.iterable, esnext, vitest/globals, compilerOptions, allowJs, esModuleInterop, incremental (+13 more)

### Community 14 - "prompts"
Cohesion: 0.11
Nodes (10): dynamic, dynamic, Props, dynamic, metadata, Props, revalidate, prompts (+2 more)

### Community 15 - "ai.ts"
Cohesion: 0.15
Nodes (18): POST(), testResults, AIPurpose, AIResponse, callAI(), evaluateOutput(), evaluationResultSchema, extractJson() (+10 more)

### Community 16 - "db/index.ts"
Cohesion: 0.32
Nodes (7): dynamic, GET(), db, globalForDb, authenticateApiKey(), AuthenticatedKey, touchApiKeyLastUsed()

### Community 17 - "schema.ts"
Cohesion: 0.15
Nodes (15): dynamic, maxDuration, bodySchema, dynamic, POST(), promptsCurrentVersionFk, promptsRelations, testCases (+7 more)

### Community 18 - "actions/webhooks.ts"
Cohesion: 0.18
Nodes (13): dynamic, metadata, WebhooksPage(), Webhook, WebhooksClient(), WebhooksClientProps, DeleteConfirmButton(), DeleteConfirmButtonProps (+5 more)

### Community 19 - "(landing)/explore/page.tsx"
Cohesion: 0.22
Nodes (11): ExploreClient(), PublicPrompt, dynamic, ExplorePage(), getPublicPrompts(), metadata, emptySubscribe(), getRelativeTimeString() (+3 more)

### Community 20 - "0000_sparkling_scrambler.sql"
Cohesion: 0.18
Nodes (10): "public"."test_cases", "api_keys", "prompts", "public"."prompts", "public"."versions", "test_cases", "test_results", "versions" (+2 more)

### Community 21 - "rate-limit.ts"
Cohesion: 0.20
Nodes (12): createPromptBodySchema, dynamic, GET(), POST(), checkRateLimit(), cleanupExpiredInProcessEntries(), getExpensiveRatelimit(), getStandardRatelimit() (+4 more)

### Community 22 - "[[...sign-in]]/page.tsx"
Cohesion: 0.20
Nodes (5): hasClerkKeys, metadata, hasClerkKeys, metadata, clerkAppearance

### Community 23 - "dependencies"
Cohesion: 0.18
Nodes (11): @clerk/nextjs, drizzle-orm, @hookform/resolvers, dependencies, @clerk/nextjs, drizzle-orm, @hookform/resolvers, react-dom (+3 more)

### Community 24 - ".prettierrc.json"
Cohesion: 0.18
Nodes (10): arrowParens, bracketSpacing, endOfLine, jsxSingleQuote, printWidth, semi, singleQuote, tabWidth (+2 more)

### Community 25 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, kill, lint, save, start, test (+2 more)

### Community 26 - "ssrf.ts"
Cohesion: 0.43
Nodes (5): RFC-1918, DnsLookupFn, isPrivateOrReservedIp(), SsrfValidationResult, validateWebhookUrl()

### Community 27 - "dashboard/page.tsx"
Cohesion: 0.33
Nodes (6): DashboardPage(), dynamic, getPromptsWithStats(), metadata, PromptRepositoriesList(), apiKeys

### Community 29 - "package.json"
Cohesion: 0.40
Nodes (4): name, packageManager, private, version

### Community 31 - "opengraph-image.tsx"
Cohesion: 0.40
Nodes (3): alt, contentType, size

### Community 33 - "proxy.ts"
Cohesion: 0.50
Nodes (3): config, hasClerkKeys, isProtected

## Knowledge Gaps
- **288 isolated node(s):** `ForkButtonProps`, `PromptDetailClientProps`, `Version`, `PromptSubnavProps`, `Version` (+283 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getAuthUserId()` connect `getAuthUserId` to `prompts.ts`, `tests.ts`, `api-keys.ts`, `actions/webhooks.ts`, `dashboard/page.tsx`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `db` connect `db/index.ts` to `prompts.ts`, `tests.ts`, `getAuthUserId`, `api-keys.ts`, `prompts`, `ai.ts`, `schema.ts`, `actions/webhooks.ts`, `(landing)/explore/page.tsx`, `rate-limit.ts`, `dashboard/page.tsx`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `ForkButtonProps`, `PromptDetailClientProps`, `Version` to the rest of the system?**
  _288 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `core/src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05875251509054326 - nodes in this community are weakly interconnected._
- **Should `prompts.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08816326530612245 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._