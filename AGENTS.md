# AGENTS.md
# Universal agent context file.
# Global AI rules: C:\Users\kwakh\.gemini\config\AGENTS.md (auto-loaded by Antigravity)
# Brain: D:\workflow-main\brain\ (read via MCP obsidian-vault at session start)
#
# READ ORDER:
# 1. Global AGENTS.md (auto-loaded)   → behavior, brain rules, audit loop
# 2. This file                        → project identity, tech stack, design system
# 3. CONTEXT.md                       → domain glossary, session log
# 4. ARCHITECTURE.md                  → schemas, API contracts
# CLAUDE.md â€” Local Project Context

# Note: All AI behaviors, commands (@TDD, @GRILL), and context maintenance rules

# are now globally enforced via ~/.gemini/config/AGENTS.md. Do not duplicate them here.

---

## 1. PROJECT IDENTITY

**Name:** Git for Prompts
**Goal:** A version control system for AI prompts â€” like GitHub, but built specifically for managing, versioning, testing, and collaborating on the prompts that power AI products.

**AI POINTER:** If you need database schemas, business logic, or third-party API details, you MUST autonomously read `ARCHITECTURE.md`. Do not guess.

## 2. TECH STACK

- **Frontend/Backend:** Next.js 15 (App Router), TypeScript
- **Database:** Supabase (PostgreSQL), Drizzle ORM
- **Authentication:** Clerk
- **Styling:** Tailwind CSS v4, shadcn/ui
- **Diff Engine:** Monaco Editor (@monaco-editor/react)
- **AI Engine:** Groq (Primary) + OpenRouter (Fallback)
- **Validation:** Zod
- **Deployment:** Vercel

## 3. LOCAL ARCHITECTURE RULES

1. **One phase at a time.** Verify before moving on. Never start Phase 4 if Phase 3 has an untested feature. A broken foundation means every phase after it is built on sand.
2. **Never hardcode keys.** If you paste an API key directly into a file to test something quickly, remove it before your next git commit. Set up `.gitignore` to exclude `.env.local` on day one.
3. **Commit after every working phase.** `git add . && git commit -m "feat: phase 3 dashboard complete"`
4. **Always check ownerId.** Every database read and write must verify the record belongs to the logged-in user. Never skip this.
5. **If a model gets it wrong twice, switch models.** Don't spend 45 minutes fighting Sonnet on something hard. Switch to Opus, solve it in one shot, move on.
6. **All Gemini calls live in server actions** â€” never in client components.
7. **Font-mono for all prompt text.** Any text that IS a prompt or IS an AI output â€” always font-mono.
8. **Test with real data from day 1.** Don't use placeholder text. Write real test prompts, real test cases, real commit messages.

### Code Style Rules

- **Components:** One component per file. Named export, not default export (except for pages).
- **Pages:** Default export (Next.js requirement).
- **Imports:** Absolute imports via `@/` alias.
- **No `any`:** Use proper types. Use `unknown` if needed, then narrow with Zod.
- **No inline styles:** Use Tailwind classes only. Exception: Monaco editor options object.
- **No `console.log` in production.**
- **Server vs Client:** Default to Server Components. Add `'use client'` only when needed.
- **Data fetching:** Do it in Server Components or Server Actions. Never `fetch()` in Client Components to your own backend.
- **Golden rule: Never copy-paste a component. Extract it.** Check `src/components/` first.

### Error Handling Rules

- Every Server Action must be wrapped in try/catch. Throw typed errors.
- Every API route must return proper HTTP status codes.
- Every form must show field-level validation errors using Zod.
- Never show raw error messages to users. Map to human-readable messages.
- Loading states: every button that triggers an async action must show a spinner.

### Shared Components (Single Source of Truth)

| File                                       | Exports                                                                              | Use it for                              |
| ------------------------------------------ | ------------------------------------------------------------------------------------ | --------------------------------------- |
| `src/components/relative-time.tsx`         | `<RelativeTime date={} className? />`                                                | Any human-readable timestamp in the UI  |
| `src/components/prompt-editor.tsx`         | `<PromptEditor promptId readOnly? height? />`                                        | Monaco editor                           |
| `src/components/version-history.tsx`       | `<VersionHistory promptId versions activeVersionId? />`                              | Version list with restore               |
| `src/components/diff-viewer.tsx`           | `<DiffViewer originalContent modifiedContent originalLabel modifiedLabel height? />` | Monaco side-by-side diff with stats bar |
| `src/components/diff-version-selector.tsx` | `<DiffVersionSelector promptId versions fromId toId />`                              | Dropdowns that update diff URL params   |
| `src/components/prompt-card.tsx`           | `<PromptCard prompt={} />`                                                           | Dashboard grid cards                    |
| `src/components/sidebar.tsx`               | `<Sidebar />`                                                                        | Left nav                                |
| `src/components/create-prompt-form.tsx`    | `<CreatePromptForm />`                                                               | New prompt form                         |

### Feature Implementation Order

1. Project setup
2. Database schema + migrations
3. Auth flow
4. Dashboard
5. Create prompt
6. Prompt editor
7. Version history
8. Diff viewer
9. Test cases
10. Test runner
11. Compare versions
12. Public API
13. Polish

### Git Conventions

- Branch names: `feat/...`, `fix/...`, `chore/...`
- Commits: `feat: add version diff viewer`, `refactor: extract ai evaluation to separate function`

### Local Development Setup

```bash
git clone <repo>
cd git-for-prompts
npm install
cp .env.example .env.local # Fill in all values from Supabase, Clerk, Google AI Studio
npx drizzle-kit generate
npx drizzle-kit migrate
npm run dev # App runs at http://localhost:3000
```

Key URLs:

- Supabase dashboard: https://supabase.com/dashboard
- Clerk dashboard: https://dashboard.clerk.com
- OpenRouter: https://openrouter.ai
- Groq: https://groq.com
- Google AI Studio: https://aistudio.google.com/app/apikey
- Vercel deploy: https://vercel.com/new
- shadcn/ui components: https://ui.shadcn.com/docs/components
- Drizzle ORM docs: https://orm.drizzle.team/docs/overview
- Monaco Editor React docs: https://github.com/suren-atoyan/monaco-react

## 4. AI COMMAND CHEAT SHEET

| Command     | Skill Path / Action                                                                                                                                                                                              |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| @SPEC     | Interview mode. AI asks ONE question at a time, builds \spec.md\ before any code. FORBIDDEN from coding until spec approved. |
| @PLAN     | Standard agent planning mode. Create implementation_plan.md first.                                                                                                                                             |
| @TDD      | [mp-tdd/SKILL.md](file:///C:/Users/kwakh/.gemini/config/skills/mp-tdd/SKILL.md) — **Red-Green-Refactor.** Write failing tests first. Do not write implementation code until tests fail. |
| @GRILL    | [mp-grill-me/SKILL.md](file:///C:/Users/kwakh/.gemini/config/skills/mp-grill-me/SKILL.md) — **Relentless Interrogation.** Ask ONE question at a time to clarify architecture. Push back on bad ideas. DO NOT write code until alignment is reached. |
| @DIAGNOSE | [mp-diagnose/SKILL.md](file:///C:/Users/kwakh/.gemini/config/skills/mp-diagnose/SKILL.md) — **Scientific Method Bug Hunt.** 1. Build reproducer. 2. Form 3-5 hypotheses. 3. Instrument logging. 4. Fix only when proven. |
| @ZOOM     | [mp-zoom-out/SKILL.md](file:///C:/Users/kwakh/.gemini/config/skills/mp-zoom-out/SKILL.md) — **Architectural Mapping.** Stop coding. Map the codebase dependencies, data flow, and components before making sweeping changes. |
## 5. MISTAKES TO AVOID

1. **Do not use `supabase-js` for database queries.** Drizzle ORM only. Supabase JS client is not installed.
2. **Do not create new migrations manually.** Always use `npx drizzle-kit generate`.
3. **Do not store API keys in plaintext.** Always bcrypt hash before storing.
4. **Do not render prompt content with `font-sans`.** Always `font-mono` for any prompt text.
5. **Do not make Gemini API calls from Client Components.** All Gemini calls go in Server Actions.
6. **Do not skip `revalidatePath` after mutations.** Next.js caches aggressively â€” always revalidate.
7. **Do not use `router.push` for mutations.** Use Server Actions, then revalidate.
8. **Do not allow users to access other users' prompts.** Always check `ownerId === userId` before returning data.


