# CLAUDE.md — Project Context
# Hard cap: 200 lines. Global rules are in C:\Users\kwakh\.gemini\config\AGENTS.md
# Domain terms → CONTEXT.md (read every session)
# Heavy architecture → ARCHITECTURE.md (load on-demand)

---

## 1. PROJECT IDENTITY

**Name:** Git for Prompts
**Goal:** SaaS tool for versioning, organizing, and managing AI prompts with GitHub-style workflows
**Status:** In Progress
**Stack type:** Full-stack Next.js SaaS with API keys + AI calls

---

## 2. TECH STACK

- **Frontend:** Next.js 15 App Router, React, TypeScript (strict), Tailwind CSS
- **Auth:** Clerk only — never add Supabase Auth. User ID always from `auth().userId()`
- **Database:** Drizzle ORM only — never supabase-js for DB queries
- **AI:** Groq (primary), OpenRouter (fallback). Model name in config constant, never hardcoded
- **Rate limiting:** Upstash Redis + `@upstash/ratelimit`
- **Hosting:** Vercel

---

## 3. DEV COMMANDS

```bash
npm run dev        # start dev server
npm run build      # production build — must pass before any commit
npm run lint       # ESLint + TypeScript — zero errors required
npx tsc --noEmit   # type check only
```

---

## 4. LOCAL RULES

1. **Database — Drizzle only, ownership required:**
   - Drizzle ORM only. Never supabase-js for DB queries.
   - Every DB read/write MUST check `ownerId = auth().userId()`. No exceptions.
   - Versions are IMMUTABLE — every save creates a new row in `versions` table. Never update existing.
   - `revalidatePath()` after every DB mutation.

2. **API Keys — security critical:**
   - Stored as bcrypt hash (`keyHash`) + SHA-256 lookup hash (`keyLookupHash`)
   - Display only `keyPrefix` (e.g. `"gfp_live_"`). Never show full key after creation.

3. **AI calls — server only:**
   - All AI calls in Server Actions or API routes. Never in Client Components.

4. **Code style:**
   - Named exports for components. Default export for pages only.
   - `font-mono` class on ALL prompt text and AI output.
   - `unknown + Zod` for external data. Never `any`.
   - Check `src/components/` before building new components.
   - No `console.log` in production code.

5. **Before marking any task done:**
   - `npm run lint && npx tsc --noEmit` → zero errors
   - Test with real data (real prompts, real commits, real test cases)

---

## 5. PROJECT PATTERNS

### API shape
```typescript
type ApiResponse<T> = { data: T | null; error: string | null }
```

### File structure
```
/app                  — pages, layouts
/app/api              — API route handlers (all AI calls here)
/app/(dashboard)      — protected app pages
/components/ui        — shared UI primitives
/lib                  — utilities, DB helpers
/lib/db               — all Drizzle queries
/lib/auth.ts          — Clerk auth helpers
```

### Key constraint — versions table
Every prompt save = INSERT new row. Never UPDATE. Read the latest via ORDER BY createdAt DESC LIMIT 1.

---

## 6. MISTAKES TO AVOID

<!-- AI appends here after every VERIFY failure -->
<!-- Format: [YYYY-MM-DD] What went wrong → What to do instead -->

---

## 7. SESSION RESUME

_AI fills this at the END of every session. Read this at the START of the next session._

**Last session date:** [YYYY-MM-DD]

**What we built / changed:**
- [bullet]

**Immediate next task:**
[Describe exactly]

**Open blockers:**
[Anything unresolved]

**Files most recently changed:**
- [file path]
