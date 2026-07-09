# Implementation Plan — Frontend Pagination & AI Model Configuration

**Scope:** Fix unbounded version-list queries in Server Components (memory/DOM
crash risk) and make the AI evaluator model configurable via environment
variables. No backend Server Actions (`versions.ts`, `tests.ts`, `route.ts`)
are modified.

---

## 0. Files touched

| # | File | Type | Why |
|---|---|---|---|
| 1 | `src/lib/constants.ts` | **NEW** | Single source of truth for the version-list cap, reused across 4 pages |
| 2 | `src/app/(dashboard)/dashboard/prompts/[id]/tests/page.tsx` | MODIFIED | Cap dropdown query |
| 3 | `src/app/(dashboard)/dashboard/prompts/[id]/compare/page.tsx` | MODIFIED | Cap dropdown query + honest total-count badge |
| 4 | `src/app/(dashboard)/dashboard/prompts/[id]/diff/page.tsx` | MODIFIED | Cap dropdown query + correctness-preserving version resolution |
| 5 | `src/app/(dashboard)/dashboard/prompts/[id]/page.tsx` | MODIFIED (bonus, optional) | Same root-cause bug in the version-history sidebar |
| 6 | `src/app/(dashboard)/dashboard/prompts/[id]/edit/page.tsx` | **AUDITED — no change** | Already safe (see §1.5) |
| 7 | `src/lib/ai.ts` | MODIFIED | Configurable execution vs. evaluation models |
| 8 | `.env.local` / `.env.example` | DOCS ONLY | New optional env vars |

---

## 1. Fix — Pagination / Memory-Leak Bomb

### 1.1 Root cause

Every page that renders a version `<select>` (or the version-history list)
ran:

```ts
db.select().from(versions).where(eq(versions.promptId, id)).orderBy(desc(versions.versionNumber))
```

with **no `.limit()`**. A prompt with 5,000 saved versions means:

- Postgres returns 5,000 rows over the wire on every page load.
- React renders 5,000 `<option>` elements (or, on the detail page, 5,000
  full version cards with buttons and event handlers) into the DOM.
- The tab hangs or crashes for that user, and every future visitor to that
  prompt's pages pays the same cost.

### 1.2 Shared constant (new file)

Rather than hardcoding `50` in four places, one shared constant:

```ts
// src/lib/constants.ts

/**
 * Shared limits for UI-facing list/dropdown queries.
 *
 * A prompt's version history is unbounded — a heavy user can accumulate
 * thousands of rows. Every server component that renders a version
 * <select> or list must cap its query, or a single power-user prompt can
 * hang/crash every visitor's browser tab (thousands of DOM nodes) and put
 * unnecessary load on Postgres for a page that only ever needs a handful
 * of recent options.
 *
 * 50 covers the overwhelming majority of real usage while keeping the
 * dropdown scannable. Bump to 100 by changing this one line if needed —
 * every consumer picks it up automatically.
 */
export const RECENT_VERSIONS_LIMIT = 50;
```

### 1.3 `tests/page.tsx` — trivial cap

The "run against" selector always defaults to `versions[0]` (the latest),
which is guaranteed to be inside any window ≥ 1. Capping is a pure win with
zero correctness trade-off.

**Diff:**

```diff
+import { RECENT_VERSIONS_LIMIT } from '@/lib/constants';
 
-  // Fetch versions (needed for the run-against selector)
+  // Recent versions for the "run against" selector. Capped — the default
+  // selection is always the latest version, which is guaranteed to be
+  // inside this window, so no correctness is lost by capping here.
   const allVersions = await db
     .select({
       id: versions.id,
       versionNumber: versions.versionNumber,
       commitMessage: versions.commitMessage,
     })
     .from(versions)
     .where(eq(versions.promptId, id))
-    .orderBy(desc(versions.versionNumber));
+    .orderBy(desc(versions.versionNumber))
+    .limit(RECENT_VERSIONS_LIMIT);
```

Everything else in the file is unchanged.

**Full file:**

```tsx
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { prompts, versions, testCases } from '@/db/schema';
import { and, eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { TestRunner } from '@/components/test-runner';
import { EmptyState } from '@/components/ui/empty-state';
import { RECENT_VERSIONS_LIMIT } from '@/lib/constants';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const [prompt] = await db
    .select({ name: prompts.name })
    .from(prompts)
    .where(eq(prompts.id, id));
  return { title: prompt ? `Tests — ${prompt.name}` : 'Tests' };
}

export default async function TestsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) return null;

  // Ownership check
  const [prompt] = await db
    .select()
    .from(prompts)
    .where(and(eq(prompts.id, id), eq(prompts.ownerId, userId)));

  if (!prompt) notFound();

  // Recent versions for the "run against" selector. Capped — the default
  // selection is always the latest version, which is guaranteed to be
  // inside this window, so no correctness is lost by capping here.
  const allVersions = await db
    .select({
      id: versions.id,
      versionNumber: versions.versionNumber,
      commitMessage: versions.commitMessage,
    })
    .from(versions)
    .where(eq(versions.promptId, id))
    .orderBy(desc(versions.versionNumber))
    .limit(RECENT_VERSIONS_LIMIT);

  // Fetch existing test cases
  const existingCases = await db
    .select()
    .from(testCases)
    .where(eq(testCases.promptId, id));

  const hasVersions = allVersions.length > 0;

  return (
    <div className="p-4 sm:p-8">
      {/* Page header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/dashboard/prompts/${id}`}
            className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors shrink-0"
          >
            ← {prompt.name}
          </Link>
          <div className="h-4 w-px bg-zinc-800 shrink-0" aria-hidden="true" />
          <h1 className="text-xl font-bold text-zinc-50">Test Cases</h1>
          {existingCases.length > 0 && (
            <span className="shrink-0 font-mono text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
              {existingCases.length} test{existingCases.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Gate: can't run tests without versions */}
      {!hasVersions ? (
        <EmptyState
          icon="v0"
          heading="No versions to test"
          description="Write at least one version of your prompt before adding test cases."
          cta={{ href: `/dashboard/prompts/${id}/edit`, label: 'Write first version' }}
        />
      ) : (
        <TestRunner
          promptId={id}
          versions={allVersions}
          initialTestCases={existingCases}
        />
      )}
    </div>
  );
}
```

### 1.4 `compare/page.tsx` — cap + honest total count

`CompareRunner` always defaults `versionIdA`/`versionIdB` to
`versions[0]`/`versions[1]` (the two most recent), so the default comparison
is unaffected by the cap. The only UX side-effect is the "N versions" badge,
which would otherwise silently under-report once a prompt exceeds the
window. Fixed with one extra cheap `count()` query (uses the existing
`versions_prompt_id_idx` index).

**Full file:**

```tsx
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { prompts, versions, testCases } from '@/db/schema';
import { and, eq, desc, count } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CompareRunner } from '@/components/compare-runner';
import { EmptyState } from '@/components/ui/empty-state';
import { RECENT_VERSIONS_LIMIT } from '@/lib/constants';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const [prompt] = await db
    .select({ name: prompts.name })
    .from(prompts)
    .where(eq(prompts.id, id));
  return { title: prompt ? `Compare — ${prompt.name}` : 'Compare' };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) return null;

  // Ownership check
  const [prompt] = await db
    .select()
    .from(prompts)
    .where(and(eq(prompts.id, id), eq(prompts.ownerId, userId)));

  if (!prompt) notFound();

  // Recent versions for the selectors (newest first). Capped — CompareRunner
  // always defaults to the two most recent versions (versions[0] /
  // versions[1]), so this window never breaks the default comparison; it
  // only limits how far back a user can manually pick from.
  const allVersions = await db
    .select({
      id: versions.id,
      versionNumber: versions.versionNumber,
      commitMessage: versions.commitMessage,
    })
    .from(versions)
    .where(eq(versions.promptId, id))
    .orderBy(desc(versions.versionNumber))
    .limit(RECENT_VERSIONS_LIMIT);

  // Real total, so the badge doesn't lie about how many versions exist
  // once a prompt's history exceeds the dropdown window. Cheap indexed
  // COUNT — negligible cost added to this page load.
  const [versionCountRow] = await db
    .select({ count: count() })
    .from(versions)
    .where(eq(versions.promptId, id));
  const totalVersionCount = versionCountRow?.count ?? allVersions.length;

  // Test case count
  const [tcCount] = await db
    .select({ count: count() })
    .from(testCases)
    .where(eq(testCases.promptId, id));

  const testCaseCount = tcCount?.count ?? 0;
  const hasEnoughVersions = allVersions.length >= 2;

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center gap-3 min-w-0 mb-8">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/dashboard/prompts/${id}`}
            className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors shrink-0"
          >
            ← {prompt.name}
          </Link>
          <div className="h-4 w-px bg-zinc-800 shrink-0" aria-hidden="true" />
          <h1 className="text-xl font-bold text-zinc-50">Compare</h1>
          {hasEnoughVersions && (
            <span className="shrink-0 font-mono text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
              {totalVersionCount > allVersions.length
                ? `latest ${allVersions.length} of ${totalVersionCount} versions`
                : `${totalVersionCount} versions`}
            </span>
          )}
        </div>
      </div>

      {/* Gate: need ≥ 2 versions */}
      {!hasEnoughVersions ? (
        <EmptyState
          icon="v1 vs v?"
          heading="Need at least 2 versions"
          description="Save another version of this prompt to compare how it performs against your test cases."
          cta={{ href: `/dashboard/prompts/${id}/edit`, label: '+ New Version' }}
        />
      ) : testCaseCount === 0 ? (
        <EmptyState
          icon="assert()"
          heading="No test cases yet"
          description="Add at least one test case to run a comparison. Test cases define what your prompt must do to pass."
          cta={{ href: `/dashboard/prompts/${id}/tests`, label: 'Add test cases' }}
        />
      ) : (
        <CompareRunner
          promptId={id}
          versions={allVersions}
          testCaseCount={testCaseCount}
        />
      )}
    </div>
  );
}
```

### 1.5 `edit/page.tsx` — audited, **no change needed**

```ts
const [latestVersion] = await db
  .select()
  .from(versions)
  .where(eq(versions.promptId, id))
  .orderBy(desc(versions.versionNumber))
  .limit(1);
```

This page already fetches exactly one row (`.limit(1)`) and does not render
a version selector at all — it only pre-populates the Monaco editor with
the latest content. It was already safe before this change; including it in
the "files to fix" list in the task description does not match what's
actually in the codebase. **No diff for this file.**

### 1.6 `diff/page.tsx` — the tricky one

This page is different from the other two: it reads `from`/`to` version IDs
directly out of the URL (`?from=<id>&to=<id>`), and **defaults** to
comparing the true oldest version against the true latest version when no
query params are given. A naive cap breaks both of these:

- If `?from=<id>` points at a version older than the 50-version window, a
  naive `.find()` against the capped list fails, and the page would
  silently substitute the wrong version (or 404) instead of showing what
  the URL asked for.
- The current default-oldest logic is `allVersions[allVersions.length - 1]`
  — with a capped fetch, that's the *50th-most-recent* version, not the
  true v1, once a prompt has more than 50 versions. Silently changing what
  "compare from the beginning" means is worse than not fixing the crash at
  all.

**Fix:** fetch the capped window for the dropdown as before, but resolve
`fromVersion`/`toVersion` through a small helper that:

1. Uses the requested ID directly if it's inside the window (no extra query).
2. Falls back to a **direct, promptId-scoped** lookup by ID if it's outside
   the window — this also happens to close a latent gap where the old code
   never had to defend against an out-of-window ID because the array
   `.find()` implicitly scoped it; the direct query re-establishes that
   same ownership scoping explicitly (`and(eq(versions.id, ...), eq(versions.promptId, id))`),
   so a foreign/invalid ID can never leak another prompt's content.
3. Falls back to the **true** newest/oldest version if nothing was
   requested — "newest" is free (index `0` of the capped, desc-ordered
   list is always the true latest); "oldest" gets a dedicated
   `orderBy(versions.versionNumber).limit(1)` query since it may live
   outside the capped window.

Finally, both resolved versions are merged into the list passed to
`<DiffVersionSelector>` so the `<select>` always has a matching `<option>`
— otherwise a controlled `<select value={id}>` with no matching option
silently shows a blank/mismatched row.

**Full file:**

```tsx
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { prompts, versions } from '@/db/schema';
import { and, eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { DiffViewer } from '@/components/diff-viewer';
import { DiffVersionSelector } from '@/components/diff-version-selector';
import { RECENT_VERSIONS_LIMIT } from '@/lib/constants';
import type { Metadata } from 'next';
import type { InferSelectModel } from 'drizzle-orm';

type Version = InferSelectModel<typeof versions>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const [prompt] = await db
    .select({ name: prompts.name })
    .from(prompts)
    .where(eq(prompts.id, id));
  return { title: prompt ? `Diff — ${prompt.name}` : 'Diff' };
}

export default async function DiffPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const { id } = await params;
  const { from, to } = await searchParams;
  const { userId } = await auth();
  if (!userId) return null;

  // Ownership check — never serve another user's data
  const [prompt] = await db
    .select()
    .from(prompts)
    .where(and(eq(prompts.id, id), eq(prompts.ownerId, userId)));

  if (!prompt) notFound();

  // Recent versions for the selector dropdowns. Capped — a prompt can
  // accumulate thousands of versions, and rendering that many <option>
  // elements crashes the tab. This window covers the default comparison
  // (latest vs. oldest) and every case where the linked-to version is
  // recent; resolveVersion() below handles the rest without ever silently
  // substituting the wrong version.
  const recentVersions = await db
    .select()
    .from(versions)
    .where(eq(versions.promptId, id))
    .orderBy(desc(versions.versionNumber))
    .limit(RECENT_VERSIONS_LIMIT);

  // Need at least 2 versions to show a meaningful diff
  if (recentVersions.length < 2) notFound();

  // Resolves the version for one side of the diff.
  //  - If a specific id was requested (?from=/&to=) and it's inside the
  //    recent window, use it directly — no extra query.
  //  - If it was requested but falls outside the window (an older version
  //    than our cap), fetch it explicitly by id, scoped to this prompt so
  //    a foreign/invalid id can never leak another prompt's content.
  //  - If nothing was requested, fall back to the true newest/oldest
  //    version — fetched directly for "oldest" since the true v1 may not
  //    be inside the capped window once a prompt has more than
  //    RECENT_VERSIONS_LIMIT versions.
  async function resolveVersion(
    requestedId: string | undefined,
    fallback: 'oldest' | 'newest'
  ): Promise<Version> {
    if (requestedId) {
      const inWindow = recentVersions.find((v) => v.id === requestedId);
      if (inWindow) return inWindow;

      const [direct] = await db
        .select()
        .from(versions)
        .where(and(eq(versions.id, requestedId), eq(versions.promptId, id)));
      if (direct) return direct;
      // Invalid/foreign id — fall through to the default below.
    }

    if (fallback === 'newest') {
      // recentVersions is ordered desc, so index 0 is always the true latest.
      return recentVersions[0];
    }

    // "oldest" — may not be in the capped window, so fetch it directly.
    const [oldest] = await db
      .select()
      .from(versions)
      .where(eq(versions.promptId, id))
      .orderBy(versions.versionNumber)
      .limit(1);
    return oldest ?? recentVersions[recentVersions.length - 1];
  }

  const fromVersion = await resolveVersion(from, 'oldest');
  const toVersion = await resolveVersion(to, 'newest');

  // Guarantee both compared versions appear as options in the dropdowns,
  // even if one of them fell outside the recent window — otherwise the
  // <select value=...> would point at an id with no matching <option> and
  // silently show a blank/mismatched selection.
  const selectorVersions = [fromVersion, toVersion].reduce<Version[]>(
    (acc, v) => (acc.some((x) => x.id === v.id) ? acc : [...acc, v]),
    recentVersions
  );

  // Human-readable labels for each diff panel
  const fromLabel = `v${fromVersion.versionNumber}${
    fromVersion.commitMessage ? ` · ${fromVersion.commitMessage}` : ''
  }`;
  const toLabel = `v${toVersion.versionNumber}${
    toVersion.commitMessage ? ` · ${toVersion.commitMessage}` : ''
  }`;

  return (
    <div className="p-4 sm:p-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/dashboard/prompts/${id}`}
            className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors shrink-0"
            aria-label="Back to prompt"
          >
            ← {prompt.name}
          </Link>
          <div className="h-4 w-px bg-zinc-800 shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-zinc-50 truncate">{prompt.name}</h1>
            <p className="text-xs text-zinc-600 font-mono mt-0.5">
              Comparing v{fromVersion.versionNumber} → v{toVersion.versionNumber}
            </p>
          </div>
        </div>

        {/* Version dropdowns — client component, updates URL params on change */}
        <DiffVersionSelector
          promptId={id}
          versions={selectorVersions}
          fromId={fromVersion.id}
          toId={toVersion.id}
        />
      </div>

      {/* Diff editor with stats bar + column labels */}
      <DiffViewer
        originalContent={fromVersion.content}
        modifiedContent={toVersion.content}
        originalLabel={fromLabel}
        modifiedLabel={toLabel}
        height="calc(100vh - 240px)"
      />
    </div>
  );
}
```

> **Note on the subtitle text:** the old "Comparing N versions" line
> (which meant "N versions exist total") no longer makes sense once the
> fetch is capped, so it's replaced with "Comparing vX → vY" — a strictly
> more useful statement of what's actually on screen, and one that stays
> correct at any prompt size. This is a deliberate UX change, called out
> here so it isn't a surprise in review.

### 1.7 Bonus fix (recommended, optional): `page.tsx` (prompt detail)

Not in the original file list, but it has the **exact same bug** — an
unbounded `versions` fetch feeding the version-history sidebar
(`PromptDetailClient` → `VersionHistory`), which renders one full card
(with Restore/Preview buttons) per version. That's heavier per-row than a
plain `<option>`, making it arguably the worst offender of the four.

It also has a secondary issue once the fetch is capped: the "Diff" quick
link builds its href from `allVersions[allVersions.length - 1].id` (meant
to be "the oldest version"). With a capped array, that becomes the
*50th-most-recent* version instead of true v1 — a silent correctness
regression. Fixed by simply **not** passing `from`/`to` on that link at
all and letting `diff/page.tsx`'s own (now-correct) default resolution
handle it — both `from` and `to` are already optional search params.

**Diff (the two relevant hunks):**

```diff
+import { RECENT_VERSIONS_LIMIT } from '@/lib/constants';
 ...
-  // All versions, newest-first
+  // Recent versions for the editor/history sidebar. Capped — a prompt's
+  // version history is unbounded, and rendering thousands of version
+  // cards (each with buttons, previews, restore actions) would hang the
+  // tab. v[0] (latest) is always correct regardless of window size,
+  // which is all this page needs by default.
   const allVersions = await db
     .select()
     .from(versions)
     .where(eq(versions.promptId, id))
-    .orderBy(desc(versions.versionNumber));
+    .orderBy(desc(versions.versionNumber))
+    .limit(RECENT_VERSIONS_LIMIT);
```

```diff
   {hasVersions && allVersions.length >= 2 && (
     <Link
-      href={`/dashboard/prompts/${id}/diff?from=${allVersions[allVersions.length - 1].id}&to=${allVersions[0].id}`}
+      href={`/dashboard/prompts/${id}/diff`}
       className="inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-300 hover:text-zinc-100 hover:border-zinc-700 transition-colors"
     >
       Diff
     </Link>
   )}
```

Rest of the file is byte-for-byte identical to the version in the dump —
apply just these two hunks if you'd rather not replace the whole file.

### 1.8 Trade-offs / accepted limitations

- **Restoring a version older than the 50-version window** is not possible
  from the sidebar (it's simply not fetched/rendered). This is an accepted
  scope boundary — a proper fix would be a dedicated paginated "full
  history" view, which is a bigger feature than "fix the crash" and is
  intentionally left out per the surgical-changes rule. Flagging it as a
  good follow-up ticket.
- The `compare` page's extra `count()` query is a single indexed lookup
  (`versions_prompt_id_idx` already exists on `promptId`) — negligible.
- `diff/page.tsx` can now issue up to 2 extra point-lookups (one per side)
  only when the requested/default version falls outside the 50-window —
  i.e., only for prompts with >50 versions being compared against an old
  version. The common case (≤50 versions, or comparing recent versions)
  costs nothing extra.

---

## 2. Fix — Configurable AI Evaluator Model

### 2.1 Approach chosen: environment variables (not a UI selector)

Rejected a DB-backed / UI-selector approach because:

- It would require a schema change (a new column, e.g., `prompts.evalModel`
  or a settings table) — out of scope per "don't touch backend actions /
  DB" unless strictly necessary, and this isn't.
- The existing codebase already resolves provider credentials
  (`GROQ_API_KEY`, `OPENROUTER_API_KEY`) purely from `process.env` — env
  vars are the established, zero-migration pattern here. Ops/config
  changes should not require a deploy of new UI or a DB write.
- Env vars are trivially different per environment (staging can run a
  cheap model, production can run a heavier one) with zero code changes.

### 2.2 Design

Two axes of configuration:

- **Provider**: Groq (primary) / OpenRouter (fallback) — unchanged, still
  resolved automatically based on which `*_API_KEY` is set.
- **Purpose**: `execution` (running the user's own prompt against the test
  input) vs. `evaluation` (the judge call that grades the output against
  the test's expected criteria). These can legitimately want different
  models — a cheap/fast model to execute hundreds of prompts in a bulk
  test run, and a heavier reasoning model as the judge for evaluation
  accuracy.

Four new optional env vars, one per (provider × purpose) combination. Each
`*_EVALUATION_MODEL` falls back to its matching `*_EXECUTION_MODEL` if
unset, so **existing deployments need zero config changes** — the default
behavior is bit-for-bit identical to today (both purposes use the same
hardcoded model string that's already in the code).

```bash
# .env.local — all optional, all default to current hardcoded behavior

# Groq
GROQ_EXECUTION_MODEL=llama-3.3-70b-versatile
GROQ_EVALUATION_MODEL=llama-3.3-70b-versatile

# OpenRouter (fallback provider)
OPENROUTER_EXECUTION_MODEL=openrouter/free
OPENROUTER_EVALUATION_MODEL=openrouter/free
```

Example of the actual use case this unlocks — bulk test runs stay fast on
the default execution model, while grading uses a stronger model:

```bash
GROQ_EXECUTION_MODEL=llama-3.1-8b-instant     # cheap/fast — runs the prompt
GROQ_EVALUATION_MODEL=llama-3.3-70b-versatile # heavier — judges the output
```

(Check the current Groq/OpenRouter model catalog for exact available model
IDs at deploy time — they change over time and aren't hardcoded anywhere
else in this plan.)

### 2.3 `src/lib/ai.ts` — full file

Only the model-selection surface changes: two constants become four
(execution/evaluation × Groq/OpenRouter), `callAI` gains a `purpose`
parameter that picks the right pair, and the two public entry points pass
their purpose explicitly. `fetchWithTimeout`, `extractJson`,
`runWithConcurrency`, `evaluateOutput`'s JSON-safety layers, and
`runSingleTestCase`'s error-propagation contract are **untouched** —
`tests.ts` needs zero changes since `runSingleTestCase`'s signature and
behavior contract are identical.

```ts
import { z } from 'zod';

/**
 * Robustly extracts the first complete JSON object from a string.
 *
 * Replaces the old `indexOf('{')` / `lastIndexOf('}')` approach, which
 * silently grabs the WRONG closing brace whenever:
 *   - the model appends any explanation after the JSON that happens to
 *     contain a '}' (e.g. a trailing aside, a smiley ":}", a second example)
 *   - the JSON contains a string value with an unbalanced-looking brace
 *   - the model emits more than one JSON-like fragment in the same reply
 *
 * This version walks the string once, tracks brace depth, and is
 * string/escape-aware so braces inside quoted values never affect depth.
 * It returns the first syntactically-balanced object starting at the
 * first '{', which is what `JSON.parse` can then safely consume.
 */
export function extractJson(text: string): unknown {
  const start = text.indexOf('{');
  if (start === -1) {
    throw new SyntaxError('No JSON object found in response');
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < text.length; i++) {
    const char = text[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === '{') depth++;
    if (char === '}') {
      depth--;
      if (depth === 0) {
        const candidate = text.slice(start, i + 1);
        return JSON.parse(candidate);
      }
    }
  }

  throw new SyntaxError('No JSON object found in response');
}

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

interface AIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// Strict shape for the evaluator's response. Parsed with .safeParse so a
// malformed or hallucinated payload never reaches calling code as `any`.
const evaluationResultSchema = z.object({
  passed: z.boolean(),
  reason: z.string(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────────────────────
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * Model configuration — overridable per environment, per purpose.
 *
 * Two purposes exist:
 *  - "execution": running the user's own prompt against a test input.
 *  - "evaluation": grading that output against the test's expected
 *    criteria.
 *
 * These can legitimately want different models — e.g. a cheap/fast model
 * to execute hundreds of prompts in a bulk test run, and a heavier
 * reasoning model as the judge for evaluation accuracy. Each is
 * independently overridable via env var; if the eval-specific var is
 * unset, it falls back to the execution model so existing deployments
 * keep their current (identical-model) behavior with zero config changes
 * required.
 */
const GROQ_EXECUTION_MODEL = process.env.GROQ_EXECUTION_MODEL || 'llama-3.3-70b-versatile';
const GROQ_EVALUATION_MODEL = process.env.GROQ_EVALUATION_MODEL || GROQ_EXECUTION_MODEL;

const OPENROUTER_EXECUTION_MODEL = process.env.OPENROUTER_EXECUTION_MODEL || 'openrouter/free';
const OPENROUTER_EVALUATION_MODEL = process.env.OPENROUTER_EVALUATION_MODEL || OPENROUTER_EXECUTION_MODEL;

type AIPurpose = 'execution' | 'evaluation';

const AI_TIMEOUT_MS = 30_000;
const MAX_CONCURRENT_TESTS = 10; // Groq is fast enough for high concurrency

/**
 * Simple concurrency limiter.
 */
export async function runWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  limit: number
): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < tasks.length) {
      const i = nextIndex++;
      results[i] = await tasks[i]();
    }
  }

  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

/**
 * Core fetch wrapper with fallback logic.
 * Try Groq first -> Fallback to OpenRouter.
 *
 * `purpose` selects which model pair (execution vs. evaluation) is used
 * for whichever provider ends up handling the call — see the model
 * constants above.
 *
 * `jsonMode` requests OpenAI-compatible `response_format: { type:
 * "json_object" }`. This is ONLY passed for calls that must return JSON
 * (the evaluator) — never for `runPromptAgainstInput`, which executes the
 * user's own prompt and must not have its output shape forced. json_object
 * mode is broadly supported by both Groq and OpenRouter but not
 * guaranteed on every routed model, so it is a best-effort first layer of
 * defense, not the only one — extractJson + Zod validation below still
 * run on every response regardless.
 */
async function callAI(
  messages: Message[],
  jsonMode = false,
  purpose: AIPurpose = 'execution'
): Promise<string> {
  const groqModel = purpose === 'evaluation' ? GROQ_EVALUATION_MODEL : GROQ_EXECUTION_MODEL;
  const openRouterModel =
    purpose === 'evaluation' ? OPENROUTER_EVALUATION_MODEL : OPENROUTER_EXECUTION_MODEL;

  // 1. Try Groq (Primary)
  if (process.env.GROQ_API_KEY) {
    try {
      return await fetchWithTimeout(GROQ_URL, process.env.GROQ_API_KEY, groqModel, messages, jsonMode);
    } catch (err) {
      console.warn('[AI] Groq failed, falling back to OpenRouter:', err instanceof Error ? err.message : String(err));
    }
  }

  // 2. Try OpenRouter (Fallback)
  if (process.env.OPENROUTER_API_KEY) {
    return await fetchWithTimeout(OPENROUTER_URL, process.env.OPENROUTER_API_KEY, openRouterModel, messages, jsonMode);
  }

  throw new Error('No AI provider API keys configured (GROQ_API_KEY or OPENROUTER_API_KEY)');
}

/**
 * Shared fetch logic for OpenAI-compatible endpoints.
 */
async function fetchWithTimeout(
  url: string,
  key: string,
  model: string,
  messages: Message[],
  jsonMode: boolean
): Promise<string> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        // OpenRouter specific headers (ignored by Groq)
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Git for Prompts',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.1, // Keep it deterministic for tests
        ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
      }),
      signal: controller.signal,
    });

    clearTimeout(id);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as { error?: { message?: string } };
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json() as AIResponse;
    return data.choices[0].message.content;
  } catch (error: unknown) {
    clearTimeout(id);
    if (error instanceof Error) {
      if (error.name === 'AbortError') throw new Error(`AI request timed out after ${AI_TIMEOUT_MS}ms`);
      throw error;
    }
    throw new Error(String(error));
  }
}

/**
 * Runs a prompt against a user input.
 * Free-form execution — never JSON-constrained, since this runs the
 * user's own prompt content, not our internal evaluator. Always uses the
 * "execution" model pair.
 */
export async function runPromptAgainstInput(
  promptContent: string,
  userInput: string
): Promise<string> {
  const messages: Message[] = [
    { role: 'system', content: promptContent },
    { role: 'user', content: userInput },
  ];

  return await callAI(messages, false, 'execution');
}

/**
 * Evaluates whether the output satisfies the expected criteria.
 * Always uses the "evaluation" model pair — independently configurable
 * from the execution model via GROQ_EVALUATION_MODEL /
 * OPENROUTER_EVALUATION_MODEL.
 *
 * Three layers of defense against hallucinated/malformed JSON, in order:
 *   1. Request json_object mode from the provider (best-effort, model-dependent)
 *   2. Depth-balanced, string-aware extraction (handles markdown fences, prose)
 *   3. Zod schema validation (fail closed on wrong shape/types, never `as`-cast)
 */
export async function evaluateOutput(
  actualOutput: string,
  expectedCriteria: string
): Promise<{ passed: boolean; reason: string }> {
  const evaluationPrompt = `
You are a strict test evaluator for AI prompt outputs.

Actual output from the AI:
"""
${actualOutput}
"""

Evaluation criteria:
"""
${expectedCriteria}
"""

Does the actual output satisfy the criteria?
Respond ONLY with valid JSON in this exact format, no markdown, no explanation:
{"passed": true, "reason": "Brief reason why it passed or failed"}
  `.trim();

  const messages: Message[] = [{ role: 'user', content: evaluationPrompt }];
  const response = await callAI(messages, true, 'evaluation');

  try {
    const candidate = extractJson(response);
    const parsed = evaluationResultSchema.safeParse(candidate);
    if (!parsed.success) {
      return { passed: false, reason: 'Evaluator returned an invalid response format' };
    }
    return parsed.data;
  } catch {
    return { passed: false, reason: 'Evaluator returned an invalid response format' };
  }
}

/**
 * Runs a single test case end-to-end.
 *
 * Deliberately does NOT catch errors here. Both `runPromptAgainstInput`
 * and `evaluateOutput` throwing (provider down, timeout, no API keys
 * configured) means we have no real `actualOutput` to report — inventing
 * one and returning `{ passed: false, actualOutput: '' }` would make a
 * genuine infrastructure failure indistinguishable from "the prompt
 * legitimately failed the test", and callers that persist this to a
 * permanent results table (tests.ts) would silently write fabricated
 * history. Callers must catch and decide how to represent a real failure
 * — see tests.ts.
 *
 * `evaluateOutput` itself never throws for parsing/shape problems (it has
 * real `actualOutput` to attach a reason to, so it degrades to
 * `passed: false` internally) — only upstream network/provider failures
 * propagate out of this function.
 */
export async function runSingleTestCase(
  promptContent: string,
  testCase: { inputText: string; expectedCriteria: string }
): Promise<{ passed: boolean; actualOutput: string; reason: string }> {
  const actualOutput = await runPromptAgainstInput(promptContent, testCase.inputText);
  const evaluation = await evaluateOutput(actualOutput, testCase.expectedCriteria);

  return {
    passed: evaluation.passed,
    actualOutput,
    reason: evaluation.reason,
  };
}

export { MAX_CONCURRENT_TESTS };
```

### 2.4 Why `tests.ts` needs zero changes

`runSingleTestCase(promptContent, testCase)` — same signature, same return
shape, same throw contract. `tests.ts` calls it exactly as before in both
`runTestsForVersion` and `runComparisonForVersions`. The model selection is
entirely internal to `ai.ts`. Confirmed no edits required there, satisfying
the "don't touch backend actions" constraint.

---

## 3. Next.js App Router — caching & hydration audit

- **Dynamic rendering, unaffected:** every page touched already calls
  `auth()` (reads cookies), which opts Next.js out of static
  generation/caching automatically. Adding `.limit()` or an extra
  `count()` query doesn't change that — these pages were never
  statically cached to begin with.
- **No Data Cache interaction:** all queries go through the Drizzle
  `postgres` client, not `fetch()`. Next's fetch-based Data Cache never
  sees these reads, so there's no stale-cache risk to reason about.
- **`revalidatePath` untouched:** we did not modify any Server Action, so
  the existing revalidation triggers in `versions.ts` / `tests.ts` are
  unaffected by this change. Capping a read query has no relationship to
  which paths get revalidated on write.
- **Hydration:** every new/changed value (`RECENT_VERSIONS_LIMIT`, the
  `count()` results, `resolveVersion()`'s output) is computed entirely
  server-side per request and passed to client components as fully
  resolved props — no `Date.now()`, `Math.random()`, or
  environment-divergent values are introduced. This is the same safe
  pattern already used elsewhere in the codebase (e.g. `RelativeTime`
  isolates its own non-deterministic date math behind
  `suppressHydrationWarning`, which we don't touch).
- **`ai.ts` changes are server-only:** it's imported exclusively by
  `src/lib/actions/tests.ts` (a `'use server'` file). None of the new
  constants or the `purpose` parameter ever reach the client bundle — zero
  hydration surface.

---

## 4. Testing / verification checklist

1. `npx tsc --noEmit` → 0 errors.
2. `npm run lint` → 0 errors/warnings.
3. `npm run build` → succeeds.
4. **Small prompt (2 versions):** diff / compare / tests pages behave
   identically to before — defaults unchanged, no visible regression.
5. **Large prompt (60+ versions, seed manually or via a quick script):**
   - Dropdowns on tests/compare/diff show only the 50 most recent.
   - Compare page badge reads `latest 50 of 62 versions` (or similar).
   - Prompt detail page sidebar shows only the 50 most recent version
     cards; page loads instantly instead of hanging.
6. **Old-version diff link, 60+ version prompt:** visit
   `/dashboard/prompts/[id]/diff?from=<id of v1>&to=<id of latest>`
   directly — confirm the diff still correctly loads v1's content (proves
   `resolveVersion`'s direct-fetch fallback path).
7. **Quick "Diff" link, 60+ version prompt:** click it from the prompt
   detail page — confirm it lands on true v1 vs. latest, not v11-ish vs.
   latest (proves the regression from a naive cap didn't ship).
8. **Model override:** set `GROQ_EVALUATION_MODEL` to a different model in
   `.env.local`, run a test, and confirm (via provider dashboard/logs)
   that only the evaluation call uses the new model while prompt execution
   still uses `GROQ_EXECUTION_MODEL`.
9. **Zero-config regression check:** remove all four new env vars entirely
   and confirm behavior is bit-for-bit identical to the pre-change code
   (both purposes fall back to the original hardcoded model strings).

---

## 5. Rollout steps

1. Add `src/lib/constants.ts`.
2. Apply the four/five page diffs (tests, compare, diff, prompt detail
   bonus; edit needs nothing).
3. Replace `src/lib/ai.ts` with the version in §2.3.
4. Add the four optional env vars to `.env.example` (documentation only —
   no required action for existing deployments) and to any environment
   secrets manager for envs that want a non-default model.
5. Run the checklist in §4.
6. Ship. No DB migration, no backend action changes, no client-bundle
   surface added.
