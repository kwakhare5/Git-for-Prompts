# AGENTS.md — Project Context

# Per-project file. Copy from D:\Ai Template\AGENTS.md and fill in.

# Version: 4.0 | June 2026

# Full rules: C:\Users\kwakh\.gemini\AI_RULES.md

---

## THE HANDSHAKE (MANDATORY — before any action)

1. Output sentinel: `🔍 Skill: [loaded/none] | Persona: [@role] | Permission: [obtained/pending]`
2. State one detail from this file + `C:\Users\kwakh\.gemini\SKILLS_INDEX.md`
3. Read SKILLS_INDEX.md → load relevant skills → list them
4. Propose plan (Goal / Approach / Steps / Risks)
5. Wait for "Approved" — no tool calls before this

**Skip any step = Unsafe State. Stop. Apologize. Restart.**

Full rules: `C:\Users\kwakh\.gemini\AI_RULES.md`

---

## COMMANDS

| Command        | What it does                                                |
| -------------- | ----------------------------------------------------------- |
| @SYNC          | Reset + load all relevant skills for this project           |
| @GRILL         | Deep alignment + builds CONTEXT.md glossary + ADRs          |
| @BRAINSTORM    | Idea → spec. Always AFTER @GRILL                            |
| @PLAN          | Spec → task list (2-5 min tasks, exact paths, verification) |
| @BUILD         | Execute plan with TDD enforced (RED→GREEN→REFACTOR)         |
| @REVIEW        | Code review against spec before merging                     |
| @DIAGNOSE      | 6-phase disciplined bug hunt (feedback loop → fix → test)   |
| @AUDIT         | Production readiness scan → AUDIT.md with score/100         |
| @PROTOTYPE     | Throwaway design exploration (logic or UI)                  |
| @ZOOM          | Map unfamiliar code using domain vocabulary                 |
| @TAG [feature] | Architecture scan → ARCHITECT_AUDIT.md                      |
| @QA            | Interactive bug reporting → GitHub issues                   |
| @HANDOFF       | Compress session for fresh start                            |

**New feature:** `@GRILL → @BRAINSTORM → @PLAN → @BUILD → @REVIEW → merge`
**Bug:** `@DIAGNOSE → fix → @REVIEW`
**Unknown code:** `@ZOOM → explore → proceed`
**Design question:** `@PROTOTYPE → decision → @BRAINSTORM`

---

## SKILLS

Tier 0 (Karpathy — always active): embedded in AI_RULES.md → K1-K4
Tier 1 (Superpowers): `C:\Users\kwakh\.gemini\SKILLS_INDEX.md` → `sp-*`
Tier 2 (Matt Pocock): `C:\Users\kwakh\.gemini\SKILLS_INDEX.md` → `mp-*`
Tier 3 (Security): `C:\Users\kwakh\.gemini\SKILLS_INDEX.md` → `community-*`
Tier 4 (Domain): `C:\Users\kwakh\.gemini\SKILLS_INDEX.md` → domain skills

---

## PROJECT INFO

## AGENTS.md — Git for Prompts

This file is the single source of truth for Codex when working on this project.
Read this entire file before writing any code. Every decision made here is intentional.

---

## Project Overview

**Git for Prompts** is a version control system for AI prompts — like GitHub, but built specifically
for managing, versioning, testing, and collaborating on the prompts that power AI products.

### The Core Problem

Every company building AI products manages prompts in Google Docs, Notion, or hardcoded strings.
There is no version history, no rollback, no testing, no review process. When a prompt changes and
the AI breaks, nobody knows what changed or how to fix it.

### The Solution

Give prompts the same treatment that code gets:

- Full version history with commit messages
- Visual side-by-side diff viewer (like GitHub's PR diff view)
- Branches for experimentation without touching live prompts
- Automated test cases with pass/fail scoring
- A/B comparison between any two versions
- Clean dashboard showing all prompts and their health
- Interactive Git Tree Explorer with a dynamic Prompt Inspector panel
- Interactive Test Pipeline visual simulator (with Damaged Returns vs Late Shipment checks)
- Side-by-side CLI Terminal simulation showing auth, pull, and test actions
- Multilingual integration support featuring a native Go SDK client tab

---

## Hard Rules

1. **One phase at a time.** Verify before moving on. Never start Phase 4 if Phase 3 has an untested feature. A broken foundation means every phase after it is built on sand.
2. **Never hardcode keys.** If you paste an API key directly into a file to test something quickly, remove it before your next git commit. Set up `.gitignore` to exclude `.env.local` on day one.
3. **Commit after every working phase.**

```bash
git add . && git commit -m "feat: phase 3 dashboard complete"
```

If you break something in Phase 4, you can always come back to the last working state. 4. **Always check ownerId.** Every database read and write must verify the record belongs to the logged-in user. Never skip this. It's a 2-line check that prevents a serious security hole. 5. **If a model gets it wrong twice, switch models.** Don't spend 45 minutes fighting Sonnet on something hard. Switch to Opus, solve it in one shot, move on. 6. **All Gemini calls live in server actions** — never in client components. If your API key appears in the browser Network tab, you've done this wrong. 7. **Font-mono for all prompt text.** Any text that IS a prompt or IS an AI output — always font-mono. This is what makes the product feel like a developer tool and not a SaaS dashboard. 8. **Test with real data from day 1.** Don't use placeholder text. Write real test prompts, real test cases, real commit messages. You'll catch UX problems much earlier.

---

## Tech Stack

### Full Stack Framework

**Next.js 15** (App Router) — the entire application lives in one repo.

- No separate backend server. No Express. No Render.
- API logic lives in Next.js Server Actions and Route Handlers (`app/api/`)
- One `vercel deploy` command ships everything
- Always use the App Router (`app/` directory), never the Pages Router

### Language

**TypeScript** — strict mode enabled. Every file is `.ts` or `.tsx`.
No `any` types allowed. If you don't know the type, figure it out.

### Database

**Supabase** (PostgreSQL) — free tier, no credit card needed.

- Connection via `DATABASE_URL` environment variable (direct Postgres URL from Supabase dashboard)
- Never use the Supabase JS client for database queries — use Drizzle ORM instead
- Supabase is used only for: Postgres database hosting, Realtime subscriptions (if needed)

### ORM

**Drizzle ORM** — TypeScript-first, fully type-safe SQL queries.

- Schema defined in `src/db/schema.ts`
- Migrations in `src/db/migrations/`
- All queries go through Drizzle. Never write raw SQL strings unless absolutely necessary.
- Use `drizzle-kit` for migrations: `npx drizzle-kit generate` then `npx drizzle-kit migrate`

### Authentication

**Clerk** — free tier, up to 10,000 MAU.

- GitHub OAuth is the primary login method (brand alignment — target users are GitHub devs)
- Google OAuth as secondary option
- Email/password as fallback
- Middleware at `src/proxy.ts` protects all routes except `/`, `/sign-in`, `/sign-up`
- `userId` from Clerk is stored as `owner_id` in all database records
- Never store passwords. Never build custom auth.

### Styling

**Tailwind CSS v4** — no config file needed in v4.

- Component library: **shadcn/ui** — copy-paste components, not an npm dependency
- Dark theme by default (the app is a developer tool, dark is expected)
- Monospace font (`font-mono`) for ALL prompt text — this is non-negotiable
- The diff viewer is the hero component — it must look exactly like GitHub's diff view

### Diff Viewer

**Monaco Editor** (the VS Code engine) — used in diff mode.

- Package: `@monaco-editor/react`
- Use `DiffEditor` component from `@monaco-editor/react`
- Set language to `"plaintext"` for prompt diffs
- Dark theme: `"vs-dark"`
- This replaces the `diff` npm library entirely. Monaco handles everything.

### AI for Test Runner

**Groq (Primary)** + **OpenRouter (Fallback)** — ultra-fast dual-provider engine.

- API: Native `fetch` to OpenAI-compatible endpoints.
- Models: `llama-3.3-70b-versatile` (Groq) or `openrouter/free` (Fallback).
- Used exclusively for running prompt test cases.
- Never use OpenAI or Anthropic direct APIs (would require paid keys).
- API keys stored in `GROQ_API_KEY` and `OPENROUTER_API_KEY`.

### Validation

**Zod** — schema validation everywhere.

- All API route inputs validated with Zod schemas
- All Server Action inputs validated with Zod schemas
- All form inputs validated with Zod + react-hook-form
- Zod schemas live in `src/lib/validations/`

### Deployment

**Vercel** — free tier, automatic deploys from GitHub main branch.

- All environment variables set in Vercel dashboard
- No Docker. No VPS. No Render. No Railway.

---

## Project Structure

```text
git-for-prompts/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Route group — auth pages
│   │   ├── sign-in/
│   │   │   └── page.tsx
│   │   └── sign-up/
│   │       └── page.tsx
│   ├── (dashboard)/              # Route group — protected app pages
│   │   ├── layout.tsx            # Sidebar + nav wrapper
│   │   ├── page.tsx              # Dashboard — all prompts
│   │   ├── prompts/
│   │   │   ├── new/
│   │   │   │   └── page.tsx      # Create new prompt
│   │   │   └── [id]/
│   │   │       ├── page.tsx      # Prompt detail + version history
│   │   │       ├── edit/
│   │   │       │   └── page.tsx  # Edit prompt text
│   │   │       ├── diff/
│   │   │       │   └── page.tsx  # Compare two versions
│   │   │       └── tests/
│   │   │           └── page.tsx  # Test cases + test runner
│   ├── api/                      # API Route Handlers
│   │   └── v1/                   # Public API (versioned)
│   │       └── prompts/
│   │           └── [id]/
│   │               └── route.ts  # GET /api/v1/prompts/:id/latest
│   ├── layout.tsx                # Root layout — ClerkProvider, ThemeProvider
│   └── globals.css
├── src/
│   ├── components/               # React components
│   │   ├── ui/                   # shadcn/ui components (auto-generated)
│   │   ├── diff-viewer.tsx       # Monaco DiffEditor wrapper
│   │   ├── prompt-editor.tsx     # Monaco Editor for writing prompts
│   │   ├── version-history.tsx   # List of all versions with restore
│   │   ├── test-runner.tsx       # Test cases UI + run button
│   │   ├── test-case-card.tsx    # Single test case with pass/fail state
│   │   ├── prompt-card.tsx       # Dashboard card for each prompt
│   │   └── sidebar.tsx           # Left nav sidebar
│   ├── db/
│   │   ├── schema.ts             # Drizzle schema — all 5 tables
│   │   ├── index.ts              # Drizzle client instance
│   │   └── migrations/           # Auto-generated by drizzle-kit
│   ├── lib/
│   │   ├── actions/              # Next.js Server Actions
│   │   │   ├── prompts.ts        # createPrompt, updatePrompt, deletePrompt
│   │   │   ├── versions.ts       # createVersion, restoreVersion
│   │   │   └── tests.ts          # createTestCase, runTests
│   │   ├── validations/          # Zod schemas
│   │   │   ├── prompt.ts
│   │   │   ├── version.ts
│   │   │   └── test.ts
│   │   ├── ai.ts                 # OpenRouter API client + test runner logic
│   │   └── utils.ts              # cn() and other utilities
│   └── proxy.ts                  # Clerk auth middleware (Next.js 16 convention)
├── .env.local                    # Local environment variables (never commit)
├── .env.example                  # Template with all required keys (commit this)
├── drizzle.config.ts             # Drizzle Kit config
├── next.config.ts
├── tailwind.config.ts            # Minimal — v4 needs almost nothing here
├── components.json               # shadcn/ui config
├── AGENTS.md                     # This file
└── README.md
```

---

## Database Schema

All tables defined in `src/db/schema.ts` using Drizzle ORM syntax.

### Table: `prompts`

Stores the top-level prompt entity — metadata only, no content.
Content lives in versions.

```typescript
export const prompts = pgTable("prompts", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  ownerId: varchar("owner_id", { length: 255 }).notNull(), // Clerk userId
  isPublic: boolean("is_public").default(false).notNull(),
  currentVersionId: uuid("current_version_id"), // FK to versions (set after first version)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

### Table: `versions`

Every save creates a new version. Versions are immutable — never edit a version, only create new ones.

```typescript
export const versions = pgTable("versions", {
  id: uuid("id").defaultRandom().primaryKey(),
  promptId: uuid("prompt_id")
    .notNull()
    .references(() => prompts.id, { onDelete: "cascade" }),
  versionNumber: integer("version_number").notNull(), // 1, 2, 3... per prompt
  content: text("content").notNull(), // The actual prompt text
  commitMessage: varchar("commit_message", { length: 500 }), // "Made tone friendlier"
  createdBy: varchar("created_by", { length: 255 }).notNull(), // Clerk userId
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### Table: `test_cases`

Defines what a prompt must do. Used to score versions.

```typescript
export const testCases = pgTable("test_cases", {
  id: uuid("id").defaultRandom().primaryKey(),
  promptId: uuid("prompt_id")
    .notNull()
    .references(() => prompts.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(), // "Mentions refund window"
  inputText: text("input_text").notNull(), // User message sent to the AI
  expectedCriteria: text("expected_criteria").notNull(), // Natural language: "must mention 30 days"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### Table: `test_results`

Stores the outcome of running a version against a test case.
One row per (version × test case) run.

```typescript
export const testResults = pgTable("test_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  versionId: uuid("version_id")
    .notNull()
    .references(() => versions.id, { onDelete: "cascade" }),
  testCaseId: uuid("test_case_id")
    .notNull()
    .references(() => testCases.id, { onDelete: "cascade" }),
  passed: boolean("passed").notNull(),
  actualOutput: text("actual_output").notNull(), // What Gemini actually returned
  score: integer("score"), // 0-100 optional confidence score
  runAt: timestamp("run_at").defaultNow().notNull(),
});
```

### Table: `api_keys`

For the public API — lets developers fetch prompts programmatically.

```typescript
export const apiKeys = pgTable("api_keys", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: varchar("owner_id", { length: 255 }).notNull(), // Clerk userId
  name: varchar("name", { length: 255 }).notNull(), // "Production key"
  keyHash: varchar("key_hash", { length: 255 }).notNull(), // bcrypt hash — never store plaintext
  keyPrefix: varchar("key_prefix", { length: 10 }).notNull(), // "gfp_live_" prefix for display
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### Relations (Drizzle)

```typescript
export const promptsRelations = relations(prompts, ({ many }) => ({
  versions: many(versions),
  testCases: many(testCases),
}));

export const versionsRelations = relations(versions, ({ one, many }) => ({
  prompt: one(prompts, {
    fields: [versions.promptId],
    references: [prompts.id],
  }),
  testResults: many(testResults),
}));

export const testCasesRelations = relations(testCases, ({ one, many }) => ({
  prompt: one(prompts, {
    fields: [testCases.promptId],
    references: [prompts.id],
  }),
  testResults: many(testResults),
}));
```

---

## Environment Variables

**Required — set these before running anything.**

```bash
# .env.local — NEVER COMMIT THIS FILE

# Database (get from Supabase dashboard → Settings → Database → Connection string)
DATABASE_URL="postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres"

# Clerk (get from Clerk dashboard → API Keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"

# AI Engine (Groq + OpenRouter)
GROQ_API_KEY="gsk_..."
OPENROUTER_API_KEY="sk-or-v1-..."

# App URL (change to production URL when deploying)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Never hardcode any key in source code. If a key appears in source, remove it immediately.**

---

## Drizzle ORM Usage

### Setup — `src/db/index.ts`

```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });
```

### Common Query Patterns

```typescript
import { db } from "@/db";
import { prompts, versions } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

// Get all prompts for a user
const userPrompts = await db
  .select()
  .from(prompts)
  .where(eq(prompts.ownerId, userId))
  .orderBy(desc(prompts.updatedAt));

// Get all versions for a prompt
const promptVersions = await db
  .select()
  .from(versions)
  .where(eq(versions.promptId, promptId))
  .orderBy(desc(versions.versionNumber));

// Get latest version of a prompt
const [latestVersion] = await db
  .select()
  .from(versions)
  .where(eq(versions.promptId, promptId))
  .orderBy(desc(versions.versionNumber))
  .limit(1);

// Create a new version (auto-increment version number)
const [lastVersion] = await db
  .select({ versionNumber: versions.versionNumber })
  .from(versions)
  .where(eq(versions.promptId, promptId))
  .orderBy(desc(versions.versionNumber))
  .limit(1);

const nextVersionNumber = (lastVersion?.versionNumber ?? 0) + 1;

const [newVersion] = await db
  .insert(versions)
  .values({
    promptId,
    versionNumber: nextVersionNumber,
    content,
    commitMessage,
    createdBy: userId,
  })
  .returning();
```

### Running Migrations

```bash
# After editing schema.ts — generate migration file
npx drizzle-kit generate

# Apply migrations to database
npx drizzle-kit migrate

# View current database state
npx drizzle-kit studio
```

---

## Server Actions

All mutations (create, update, delete) use Next.js Server Actions.
All Server Actions live in `src/lib/actions/`.

### Pattern

```typescript
// src/lib/actions/prompts.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { prompts } from "@/db/schema";
import { createPromptSchema } from "@/lib/validations/prompt";
import { revalidatePath } from "next/cache";

export async function createPrompt(input: unknown) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const validated = createPromptSchema.parse(input);

  const [prompt] = await db
    .insert(prompts)
    .values({ ...validated, ownerId: userId })
    .returning();

  revalidatePath("/dashboard");
  return prompt;
}
```

### Validation Schemas

```typescript
// src/lib/validations/prompt.ts
import { z } from "zod";

export const createPromptSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
});

export const createVersionSchema = z.object({
  promptId: z.string().uuid(),
  content: z.string().min(1),
  commitMessage: z.string().max(500).optional(),
});

export const createTestCaseSchema = z.object({
  promptId: z.string().uuid(),
  name: z.string().min(1).max(255),
  inputText: z.string().min(1),
  expectedCriteria: z.string().min(1),
});
```

---

## AI Engine — Test Runner

### How the Test Runner Works

1. User clicks "Run Tests" on a prompt version.
2. For each test case attached to the prompt:
   a. Build a conversation: system prompt = the version content, user message = `inputText`.
   b. Send to **Groq** (Primary) or **OpenRouter** (Fallback).
   c. Take AI's response, send it back for evaluation.
   d. Evaluation call: "Does this response satisfy this criteria? Answer with JSON: `{passed: boolean, reason: string}`".
   e. Store result in `test_results` table.
3. Show pass/fail for each test case + overall score.

### AI Client — `src/lib/ai.ts`

```typescript
/**
 * AI Engine Wrapper - Dual Provider (Groq + OpenRouter)
 */

async function callAI(messages: Message[]): Promise<string> {
  // 1. Try Groq (Primary)
  if (process.env.GROQ_API_KEY) {
    try {
      return await fetchWithTimeout(
        GROQ_URL,
        process.env.GROQ_API_KEY,
        GROQ_MODEL,
        messages,
      );
    } catch (err) {
      console.warn("[AI] Groq failed, falling back to OpenRouter");
    }
  }

  // 2. Try OpenRouter (Fallback)
  return await fetchWithTimeout(
    OPENROUTER_URL,
    process.env.OPENROUTER_API_KEY!,
    OPENROUTER_MODEL,
    messages,
  );
}

export async function runSingleTestCase(
  promptContent: string,
  testCase: { inputText: string; expectedCriteria: string },
): Promise<{ passed: boolean; actualOutput: string; reason: string }> {
  const actualOutput = await runPromptAgainstInput(
    promptContent,
    testCase.inputText,
  );
  const evaluation = await evaluateOutput(
    actualOutput,
    testCase.expectedCriteria,
  );

  return {
    passed: evaluation.passed,
    actualOutput,
    reason: evaluation.reason,
  };
}
```

### Running Tests — Server Action

```typescript
// src/lib/actions/tests.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { versions, testCases, testResults } from "@/db/schema";
import {
  runSingleTestCase,
  runWithConcurrency,
  MAX_CONCURRENT_TESTS,
} from "@/lib/ai";

export async function runTestsForVersion(versionId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const [version] = await db
    .select()
    .from(versions)
    .where(eq(versions.id, versionId));
  const cases = await db
    .select()
    .from(testCases)
    .where(eq(testCases.promptId, version.promptId));

  // Run in parallel with concurrency limiting (e.g., 10)
  const results = await runWithConcurrency(
    cases.map((testCase) => async () => {
      const result = await runSingleTestCase(version.content, testCase);
      return await db
        .insert(testResults)
        .values({
          versionId,
          testCaseId: testCase.id,
          passed: result.passed,
          actualOutput: result.actualOutput,
        })
        .returning();
    }),
    MAX_CONCURRENT_TESTS,
  );

  return results;
}
```

---

## Diff Viewer Component

The diff viewer is the most important UI component in the entire app.
It must look exactly like GitHub's pull request diff view.

### Implementation — `src/components/diff-viewer.tsx`

```typescript
'use client';

import { DiffEditor } from '@monaco-editor/react';

interface DiffViewerProps {
  original: string;  // Older version content
  modified: string;  // Newer version content
  originalLabel?: string;
  modifiedLabel?: string;
}

export function DiffViewer({ original, modified, originalLabel, modifiedLabel }: DiffViewerProps) {
  return (
    <div className="rounded-lg overflow-hidden border border-zinc-800">
      {/* Labels */}
      <div className="grid grid-cols-2 bg-zinc-900 border-b border-zinc-800">
        <div className="px-4 py-2 text-xs text-zinc-400 font-mono border-r border-zinc-800">
          {originalLabel ?? 'Original'}
        </div>
        <div className="px-4 py-2 text-xs text-zinc-400 font-mono">
          {modifiedLabel ?? 'Modified'}
        </div>
      </div>

      {/* Monaco Diff Editor */}
      <DiffEditor
        height="500px"
        language="plaintext"
        theme="vs-dark"
        original={original}
        modified={modified}
        options={{
          readOnly: true,
          renderSideBySide: true,
          minimap: { enabled: false },
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          fontFamily: 'JetBrains Mono, Fira Code, Menlo, monospace',
          fontSize: 13,
          lineHeight: 22,
          padding: { top: 12, bottom: 12 },
          renderLineHighlight: 'none',
          scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
        }}
      />
    </div>
  );
}
```

---

## Public API

The public API lives under `/api/v1/` and allows developers to fetch prompts programmatically.
This is the "use it as real infrastructure" feature.

### API Endpoints

```text
GET  /api/v1/prompts/:id/latest
     — Get latest version of a prompt
GET  /api/v1/prompts/:id/versions   — Get all versions list
GET  /api/v1/prompts/:id/versions/:versionNumber — Get specific version
```

### API Authentication

API routes use API keys (not Clerk session tokens).
API key format: `gfp_live_[32 random chars]` — e.g. `gfp_live_a8f3k2m9p1x7q4n6r0w5y8b3c1d2e4`

```typescript
// src/app/api/v1/prompts/[id]/latest/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { prompts, versions, apiKeys } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function validateApiKey(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const rawKey = authHeader.slice(7);
  const prefix = rawKey.slice(0, 9); // "gfp_live_"

  const keys = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.keyPrefix, prefix));

  for (const key of keys) {
    const valid = await bcrypt.compare(rawKey, key.keyHash);
    if (valid) return key.ownerId;
  }

  return null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const ownerId = await validateApiKey(request);
  if (!ownerId) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }

  const [prompt] = await db
    .select()
    .from(prompts)
    .where(eq(prompts.id, params.id));
  if (!prompt || prompt.ownerId !== ownerId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [latestVersion] = await db
    .select()
    .from(versions)
    .where(eq(versions.promptId, params.id))
    .orderBy(desc(versions.versionNumber))
    .limit(1);

  return NextResponse.json({
    prompt: { id: prompt.id, name: prompt.name },
    version: latestVersion.versionNumber,
    content: latestVersion.content,
    updatedAt: latestVersion.createdAt,
  });
}
```

---

## Design System

### Theme

Dark by default. Looks like a cross between GitHub and VS Code. Professional, tool-like, serious.
Not a SaaS marketing page. Not playful. Not colorful.

### Color Palette

```text
Background:       zinc-950  (#09090b)
Surface:          zinc-900  (#18181b)
Border:           zinc-800  (#27272a)
Muted border:     zinc-700  (#3f3f46)
Primary text:     zinc-50   (#fafafa)
Secondary text:   zinc-400  (#a1a1aa)
Muted text:       zinc-600  (#52525b)

Diff removed:     red-950 bg, red-400 text, red-800 gutter
Diff added:       green-950 bg, green-400 text, green-800 gutter

Pass:             green-400
Fail:             red-400
Pending:          yellow-400
```

### Typography

```text
UI text:          font-sans (Inter)
Prompt content:   font-mono (JetBrains Mono preferred, Fira Code fallback)
Version numbers:  font-mono
Code:             font-mono
```

**Absolute rule: Any text that IS a prompt or IS AI output must use `font-mono`.**
**All other UI text uses `font-sans`.**

### Layout

```text
Sidebar:          240px fixed left
Main content:     flex-1, max-w-5xl, centered
Top nav:          64px fixed (if used)
Content padding:  p-6 or p-8
```

### Key UI Patterns

**Version pill:** `v3` in a monospace badge — `<span class="font-mono text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">v3</span>`

**Commit message:** Displayed in a muted italic style below the version number

**Pass/Fail badge:**

```tsx
<span
  className={`text-xs font-medium px-2 py-0.5 rounded ${
    passed ? "bg-green-950 text-green-400" : "bg-red-950 text-red-400"
  }`}
>
  {passed ? "PASS" : "FAIL"}
</span>
```

**Prompt card (dashboard):**

- Name, description, current version pill, test pass rate, last modified
- Hover: border brightens from zinc-800 to zinc-700

---

## Page-by-Page Implementation Guide

### 1. Dashboard (`/dashboard`)

Shows all prompts belonging to the user.

Displays per prompt:

- Prompt name (bold)
- Description (muted, truncated to 2 lines)
- Current version pill (`v3`)
- Test score (`8/10 tests passing` — green if ≥80%, yellow if 50-79%, red if <50%)
- Last modified date (relative: "2 days ago")
- Quick actions: Edit, View History, Run Tests

### 2. Prompt Detail (`/prompts/[id]`)

Shows the current version of a prompt + its full version history.

Left panel: Monaco Editor (read-only) showing current version content.
Right panel: Version history list — each version shows version number, commit message, date, author.

Actions available:

- "New Version" button — opens edit page
- Click any version to preview its content in the editor
- "Restore" button on any past version — creates a new version with that content + message "Restored from v2"
- "Compare" — select two versions and go to diff page

### 3. Edit Prompt (`/prompts/[id]/edit`)

Monaco Editor (editable) with the current prompt content pre-loaded.
Commit message input field below the editor.
"Save Version" button — calls `createVersion` server action.
Cancel button returns without saving.

Character/token count displayed below editor (estimate: 1 token ≈ 4 chars).

### 4. Diff Viewer (`/prompts/[id]/diff`)

URL params: `?from=1&to=3` (version numbers)

Two version selectors at the top — dropdowns to change which versions are compared.
Monaco DiffEditor fills the main area.
Summary stats below: X lines added, Y lines removed, Z total changes.

### 5. Test Runner (`/prompts/[id]/tests`)

Two sections:

**Test Cases panel (left/top):**

- List of all test cases for this prompt
- Each shows: name, input text preview, expected criteria
- "Add Test Case" button — opens inline form
- Delete button per test case

**Results panel (right/bottom):**

- Version selector — "Run tests against which version?"
- "Run All Tests" button — triggers `runTestsForVersion` server action
- Real-time updates: each test case shows a loading spinner, then PASS/FAIL
- Shows actual AI output for each test case (collapsed by default, expandable)
- Summary: "8 / 10 passed" with a progress bar

---

## Feature Implementation Order

Build features in this exact order. Do not start the next feature until the current one is fully working, including the database, the server action, and the UI.

1. **Project setup** — Next.js 15, TypeScript, Tailwind, Clerk, Drizzle, Supabase connection, shadcn/ui
2. **Database schema + migrations** — all 5 tables, run migrations, verify in Supabase dashboard
3. **Auth flow** — Clerk sign-in/sign-up pages, middleware protecting `/dashboard`, redirect after login
4. **Dashboard** — fetch + display prompts for current user (empty state with "Create your first prompt")
5. **Create prompt** — form with name + description, creates prompt record, redirects to detail page
6. **Prompt editor** — Monaco editor, save creates first version, commit message input
7. **Version history** — list all versions, click to preview, restore functionality
8. **Diff viewer** — Monaco DiffEditor, version selectors, summary stats
9. **Test cases** — add/delete test cases, form validation
10. **Test runner** — Gemini integration, run tests, show results, store in DB
11. **Compare versions** — run both versions against same test cases, score comparison
12. **Public API** — API key generation, `/api/v1/` endpoints
13. **Polish** — loading states, error boundaries, empty states, mobile responsiveness

---

## Error Handling Rules

- Every Server Action must be wrapped in try/catch. Throw typed errors, never generic ones.
- Every API route must return proper HTTP status codes (200, 201, 400, 401, 403, 404, 500).
- Every form must show field-level validation errors using Zod + react-hook-form.
- Never show raw error messages to users. Map errors to human-readable messages.
- Loading states: every button that triggers an async action must show a spinner while pending.
- Use `useTransition` or `useFormStatus` for Server Action pending states.

---

## Code Style Rules

- **Components:** One component per file. Named export, not default export (except for pages).
- **Pages:** Default export (Next.js requirement).
- **Imports:** Absolute imports via `@/` alias (already configured in `tsconfig.json`).
- **No `any`:** Use proper types. Use `unknown` if needed, then narrow with Zod.
- **No inline styles:** Use Tailwind classes only. Exception: Monaco editor options object.
- **No `console.log` in production:** Use only for debugging, remove before committing.
- **Server vs Client:** Default to Server Components. Add `'use client'` only when needed for interactivity or browser APIs.
- **Data fetching:** Do it in Server Components or Server Actions. Never `fetch()` in Client Components to your own backend.

---

## Shared Components — Single Source of Truth

**Golden rule: Never copy-paste a component. Extract it.**

Before writing any UI utility, check `src/components/` first. If it exists, import it.
If it doesn't exist but will be needed in 2+ places, create a shared component immediately.

### Current shared components (as of Phase 4)

| File                                       | Exports                                                                              | Use it for                                          |
| ------------------------------------------ | ------------------------------------------------------------------------------------ | --------------------------------------------------- |
| `src/components/relative-time.tsx`         | `<RelativeTime date={} className? />`                                                | Any human-readable timestamp in the UI              |
| `src/components/prompt-editor.tsx`         | `<PromptEditor promptId readOnly? height? />`                                        | Monaco editor — both editable and read-only preview |
| `src/components/version-history.tsx`       | `<VersionHistory promptId versions activeVersionId? />`                              | Version list with restore                           |
| `src/components/diff-viewer.tsx`           | `<DiffViewer originalContent modifiedContent originalLabel modifiedLabel height? />` | Monaco side-by-side diff with stats bar             |
| `src/components/diff-version-selector.tsx` | `<DiffVersionSelector promptId versions fromId toId />`                              | Dropdowns that update diff URL params               |
| `src/components/prompt-card.tsx`           | `<PromptCard prompt={} />`                                                           | Dashboard grid cards                                |
| `src/components/sidebar.tsx`               | `<Sidebar />`                                                                        | Left nav                                            |
| `src/components/create-prompt-form.tsx`    | `<CreatePromptForm />`                                                               | New prompt form                                     |

### Rules

- `shadcn/ui` primitives live in `src/components/ui/` — never modify these directly.
- App-specific shared components live directly in `src/components/`.
- Page-specific one-off UI goes inline in the page file — only extract when reused.

---

## Git Conventions

```text
feat: add version diff viewer
fix: correct version number auto-increment logic
chore: update drizzle schema for api_keys table
refactor: extract ai evaluation to separate function
```

Branch names: `feat/diff-viewer`, `fix/version-numbering`, `chore/drizzle-setup`

---

## Common Mistakes to Avoid

1. **Do not use `supabase-js` for database queries.** Drizzle ORM only. Supabase JS client is not installed.
2. **Do not create new migrations manually.** Always use `npx drizzle-kit generate`.
3. **Do not store API keys in plaintext.** Always bcrypt hash before storing. Show the key once to the user, never again.
4. **Do not render prompt content with `font-sans`.** Always `font-mono` for any prompt text.
5. **Do not make Gemini API calls from Client Components.** All Gemini calls go in Server Actions.
6. **Do not skip `revalidatePath` after mutations.** Next.js caches aggressively — always revalidate.
7. **Do not use `router.push` for mutations.** Use Server Actions, then revalidate.
8. **Do not allow users to access other users' prompts.** Always check `ownerId === userId` before returning data.

---

## Local Development Setup

```bash
# 1. Clone and install
git clone <repo>
cd git-for-prompts
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Fill in all values from Supabase, Clerk, Google AI Studio

# 3. Run database migrations
npx drizzle-kit generate
npx drizzle-kit migrate

# 4. Start development server
npm run dev

# App runs at http://localhost:3000
```

---

## Key URLs for Setup

- Supabase dashboard: <https://supabase.com/dashboard>
- Clerk dashboard: <https://dashboard.clerk.com>
- OpenRouter: <https://openrouter.ai>
- Groq: <https://groq.com>
- Google AI Studio: <https://aistudio.google.com/app/apikey>
- Vercel deploy: <https://vercel.com/new>
- shadcn/ui components: <https://ui.shadcn.com/docs/components>
- Drizzle ORM docs: <https://orm.drizzle.team/docs/overview>
- Monaco Editor React docs: <https://github.com/suren-atoyan/monaco-react>

---

_Last updated: Project kickoff. Update this file whenever major architectural decisions change._
