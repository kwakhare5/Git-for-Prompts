# AGENTS.md - Git for Prompts

> **MANDATORY INSTRUCTION:** Read and obey the global master rules at C:\Users\kwakh\.agents\AGENTS.md. Treat this file as project-specific facts and invariants that override or extend global rules.


## What this is
Prompt versioning, staging, diffing, and automated testing studio for AI prompts. Launch Ready.

## Stack
- Framework: Next.js 16.3.1 (Turbopack + App Router) + React 19 + TypeScript + Tailwind CSS v4 + Monaco Editor
- Database & ORM: PostgreSQL (local Docker container) + Drizzle ORM
- Auth & Rate Limiting: Clerk Auth + Upstash Redis
- Testing: Vitest (150/150 passing unit & integration tests against real PostgreSQL) + Playwright
- Package Manager: pnpm monorepo (`@gfp/core` & `gitforprompts` CLI)

## Commands (how to run/build/test)
- Install: `pnpm install`
- Dev server: `pnpm dev`
- Test: `pnpm test`
- Lint: `pnpm lint`
- Build: `pnpm build`
- DB Push: `pnpm db:push`
- Done check = Test + Lint both exit 0.

## Issue tracker
GitHub Issues: https://github.com/kwakhare5/git-for-prompts/issues

## Design source of truth
`DESIGN.md` (Spotify-Style Neutral Dark palette, Lucide icons `strokeWidth={1.5}`)

## Gotchas (project decisions)
- Launch Ready.
- Security guards: Outbound prompt test executions must route through SSRF guards in `src/lib/security/ssrf.ts` and auth checks in `src/lib/api-auth.ts`.
- Zero DB mocking: Integration tests run directly against local PostgreSQL container on port 5432.

Global rules: read C:\Users\kwakh\.agents\AGENTS.md
