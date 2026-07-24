# CONTEXT.md — Domain Language
# Read at the START of EVERY session.
# AI fills and maintains this via @GRILL. You rarely edit this manually.

---

## Core Entities

| Term | What it means in THIS app | Never call it |
|------|--------------------------|---------------|
| Prompt | A versioned AI instruction template stored in the system | Message, text, input |
| Version | An immutable snapshot of a Prompt — append-only, new row per save, never updated | Edit, revision, update |
| Collection | A named group of Prompts (like a folder or repo) | Folder, directory, project |
| API Key | A hashed credential giving programmatic access to a user's Prompts | Token, secret, password |
| Run | A single execution of a Prompt against an AI model, with recorded input/output | Call, request, generation |
| Test Case | A saved input + expected criteria used to evaluate a prompt version | Eval, benchmark |
| Diff | A Monaco-rendered comparison between two versions of a Prompt | Compare, delta |

---

## Business Rules (Never Break)

1. Versions are IMMUTABLE — every Prompt save creates a new Version row. Never UPDATE existing versions.
2. Every DB read/write must verify `ownerId = auth().userId()` — no cross-user data access ever
3. API Keys stored as bcrypt hash (`keyHash`) + SHA-256 lookup hash (`keyLookupHash`) — never store plaintext, never show full key after creation
4. All AI calls in Server Actions or API routes — never in Client Components
5. `revalidatePath()` after every DB mutation
6. `font-mono` on ALL prompt text and AI output — prompts are code
7. Rate limiting via Upstash Redis applies to all API Key usage

---

## Database Schema

```
prompts       → id, ownerId (Clerk userId), name, description,
                currentVersionId→versions, isPublic, createdAt, updatedAt
                INDEX: prompts_owner_id_idx

versions      → id, promptId→prompts, versionNumber (1,2,3...),
                content (the actual prompt text), commitMessage,
                createdBy (Clerk userId), createdAt
                CONSTRAINT: unique(promptId, versionNumber)
                RULE: immutable — every save = new row, never edit

test_cases    → id, promptId→prompts, name, inputText,
                expectedCriteria, createdAt

test_results  → id, versionId→versions, testCaseId→test_cases,
                passed (bool), actualOutput, score (0–100), runAt

api_keys      → id, ownerId, name, keyHash (bcrypt), keyLookupHash (SHA-256),
                keyPrefix ("gfp_live_"), lastUsedAt, createdAt
                CONSTRAINT: unique(keyLookupHash) — O(1) lookup
```
_4 migrations applied (0000–0003). Schema source of truth: `src/db/schema.ts`_

---

## Feature Status

| Feature | Status | File |
|---------|--------|------|
| Auth (sign-in/sign-up) | 🟢 Live | `app/(auth)/` — Clerk route group |
| Dashboard | 🟢 Live | `app/(dashboard)/dashboard/page.tsx` |
| Create prompt | 🟢 Live | `components/create-prompt-form.tsx` |
| Prompt detail | 🟢 Live | `components/prompt-detail-client.tsx` |
| Edit prompt | 🟢 Live | `components/prompt-editor.tsx` |
| Version diff | 🟢 Live | `components/diff-viewer.tsx` |
| Compare prompts | 🟢 Live | `components/compare-runner.tsx` |
| Test runner | 🟢 Live | `components/test-runner.tsx` |
| API keys | 🟢 Live | `components/api-keys-manager.tsx` |
| Public API | 🟢 Live | `app/api/v1/prompts/[id]/latest/route.ts` |
| Keep-alive cron | 🟢 Live | `app/api/cron/keep-alive/route.ts` |
| Collaboration/sharing | ⏸️ Paused | Not started |

---

## Real File Map

```
src/
├── app/
│   ├── (auth)/                          ← sign-in, sign-up (Clerk)
│   ├── (dashboard)/dashboard/
│   │   ├── page.tsx                     ← Prompt grid
│   │   ├── new/page.tsx                 ← Create prompt
│   │   ├── api-keys/page.tsx
│   │   └── prompts/[id]/
│   │       ├── page.tsx                 ← Prompt detail
│   │       ├── edit/page.tsx
│   │       ├── diff/page.tsx
│   │       ├── compare/page.tsx
│   │       └── tests/page.tsx
│   ├── (landing)/page.tsx               ← Marketing page
│   └── api/v1/prompts/[id]/latest/      ← Public API
├── components/
│   ├── prompt-editor.tsx                ← Monaco editor
│   ├── diff-viewer.tsx                  ← Monaco diff
│   ├── compare-runner.tsx
│   ├── test-runner.tsx
│   ├── version-history.tsx
│   ├── api-keys-manager.tsx
│   └── ui/
└── db/
    ├── schema.ts                        ← SOURCE OF TRUTH
    ├── index.ts
    └── migrations/                     ← 0000–0003
```

---


## User Roles

| Role | What they can do |
|------|-----------------|
| Owner | Full access to all their Prompts, Collections, API Keys, billing |
| API Consumer | Read/execute Prompts via API Key only (no UI access) |

---

## Key Workflows

1. **Create Prompt:** User writes prompt → saves → new Version row created → displayed as "v1"
2. **Edit Prompt:** User edits → saves → new immutable Version row → displayed as "v2, v3..." (never overwrites)
3. **API Access:** User creates API Key → key stored hashed → user uses key prefix to identify it → programmatic Prompt execution
4. **Run Prompt:** Client sends prompt + variables → AI call in API route → Groq (fallback OpenRouter) → result stored as Run

---

## Naming Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| DB tables | snake_case, plural | `prompt_versions`, `api_keys` |
| React components | PascalCase | `PromptEditor`, `VersionHistory` |
| API routes | kebab-case | `/api/prompts/[id]/versions` |
| TypeScript types | PascalCase | `PromptVersion`, `ApiKey` |
| Clerk userId | `ownerId` in DB | `ownerId: auth().userId()` |

---

## ADRs — Architecture Decision Records

| Date | Decision | Why |
|------|---------|-----|
| — | Drizzle ORM over Prisma | Better raw SQL control, lighter weight |
| — | Clerk over Supabase Auth | Simpler setup, built-in UI components |
| — | Immutable versions table | Git-style history — safe, auditable, no data loss |
| — | Groq primary, OpenRouter fallback | Groq speed + OpenRouter model variety as backup |
| — | API keys as dual hash | bcrypt for auth, SHA-256 for O(1) lookup — secure + performant |
| — | Upstash Redis for rate limiting | Serverless-compatible, no persistent connection needed |
| — | All AI calls in Server Actions | API keys stay server-side, never in client bundle |
| — | revalidatePath() after mutations | Required for App Router cache refresh |

---

## Bugs Fixed

_Append-only. Never repeat these._

| Date | Bug | Fix |
|------|-----|-----|
| — | Missing ownerId check on DB query | `WHERE ownerId = auth().userId()` — every query, no exceptions |
| — | API key visible in client | Move all key operations to Server Actions |
