# ADR 001: Website Restructuring and De-cluttering Plan

## Status
Approved

## Context
The **Git for Prompts** landing page (`src/app/page.tsx`) currently functions as a 1,700-line "god component" holding the landing page layout, macOS mockup animations, vertical feature cards selector, 4 bespoke SVG graphic engines (with inline CSS keyframe animations, React state management, and autoplay loops), and a client-side mock Sandbox console. 

To transition from this visual-only presentation into a production-grade SaaS product, we need to:
1. **Decompose `src/app/page.tsx`** into modular, reusable, easily maintainable sub-components.
2. **Establish the complete Website/App routing structure** based on Next.js 15 (App Router), Clerk Auth, and Supabase/Drizzle ORM data fetching.

---

## Proposed Component & Directory Structure

Here is the complete architectural layout for the website:

```text
d:/Git for Prompts/
├── src/
│   ├── app/
│   │   ├── (landing)/                   # Public Landing Page Component Group
│   │   │   ├── _components/             # Sub-components extracted from page.tsx
│   │   │   │   ├── hero.tsx             # Hero section & interactive macOS dashboard loop
│   │   │   │   ├── features.tsx         # Features section wrapper (Left Features List + Right Canvas)
│   │   │   │   ├── fixes-section.tsx    # "What Git for Prompts Fixes" problem grid
│   │   │   │   ├── footer.tsx           # Standard site footer
│   │   │   │   └── graphics/            # Isolated SVG simulation canvases
│   │   │   │       ├── git-tree.tsx     # Branching Git Tree (activeFeature === 0)
│   │   │   │       ├── diff-wipe.tsx    # Draggable Split-Screen Wipe (activeFeature === 1)
│   │   │   │       ├── pipeline.tsx     # Animated Test Case Flow (activeFeature === 2)
│   │   │   │       └── api-flow.tsx     # Public API Fetch Packet Flow (activeFeature === 3)
│   │   │   └── page.tsx                 # Main public landing page index
│   │   │
│   │   ├── (auth)/                      # Authentication group (Clerk-guarded)
│   │   │   ├── sign-in/[[...sign-in]]/
│   │   │   │   └── page.tsx             # Clerk Sign-In Page
│   │   │   └── sign-up/[[...sign-up]]/
│   │   │       └── page.tsx             # Clerk Sign-Up Page
│   │   │
│   │   ├── (dashboard)/                 # Main application dashboard (Protected)
│   │   │   ├── layout.tsx               # Sidebar + Header navigation shell
│   │   │   ├── page.tsx                 # Prompts Dashboard (Prompts search, filters, list)
│   │   │   └── prompts/
│   │   │       ├── new/
│   │   │       │   └── page.tsx         # Create Prompt Wizard form
│   │   │       └── [id]/
│   │   │           ├── page.tsx         # Prompt Details view & Version history timeline
│   │   │           ├── edit/
│   │   │           │   └── page.tsx     # Prompt Editor (Monaco code editor with markdown preview)
│   │   │           ├── diff/
│   │   │           │   └── page.tsx     # Compare Versions page (Monaco DiffEditor)
│   │   │           └── tests/
│   │   │               └── page.tsx     # Test Suite Runner and Assertion scoring page
│   │   │
│   │   └── api/
│   │       └── v1/                      # Public Developer API (API Key Auth)
│   │           └── prompts/
│   │               └── [id]/
│   │                   └── latest/
│   │                       └── route.ts # GET /api/v1/prompts/:id/latest
│   │
│   ├── components/                      # Global Reusable UI Components
│   │   ├── ui/                          # shadcn/ui primitives (button, sheet, dialog, etc.)
│   │   ├── sidebar.tsx                  # Dashboard Sidebar component
│   │   ├── prompt-editor.tsx            # Monaco Editor wrapper for prompts
│   │   ├── diff-viewer.tsx              # Monaco DiffEditor wrapper
│   │   └── test-runner.tsx              # Automated test suite controller
│   │
│   ├── db/                              # Database layer (Drizzle ORM)
│   │   ├── index.ts                     # Database connection initialization
│   │   └── schema.ts                    # PostgreSQL schemas (prompts, versions, test_cases, test_results, api_keys)
│   │
│   └── lib/                             # Core Business Logic & Clients
│       ├── actions/                     # Next.js Server Actions (Mutations)
│       │   ├── prompts.ts
│       │   ├── versions.ts
│       │   └── tests.ts
│       ├── validations/                 # Zod payload parsers
│       ├── ai.ts                        # LLM Orchestrator (Groq / OpenRouter)
│       ├── rate-limit.ts                # Security & rate limiting config
│       └── utils.ts                     # UI utility functions
```

---

## Architectural Decisions

1. **Sub-Folder Grouping for Landing Component**: 
   All components specific to the landing page go under `src/app/(landing)/_components/` using Next.js private folders prefix (`_`) to prevent route generation for these assets.
2. **Separation of Monaco Components**: 
   The complex `@monaco-editor/react` implementations (`prompt-editor.tsx` and `diff-viewer.tsx`) reside in `/src/components` as globally reusable components, keeping them separate from page-level routing bundles.
3. **Clerk Auth Route Groups**: 
   Route group `(auth)` separates sign-in and sign-up layouts from the main `(dashboard)` navigation sidebar layout, ensuring auth flow remains clean.
4. **Data Isolation Rules**:
   - Reads: Directly via server components utilizing Drizzle (`db.select().from(prompts).where(...)`).
   - Writes: Handled strictly via Next.js Server Actions under `src/lib/actions/` protected with `auth()` checks validating `ownerId`.
