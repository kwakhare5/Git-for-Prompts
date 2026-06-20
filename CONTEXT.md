# Project Domain Context (Glossary)

This file defines the specific business language and component mapping for this project. **Agents MUST update this file** inline whenever a new term is introduced or a major decision is made.

### Domain Glossary

- **Prompt**: The top-level entity representing an AI prompt. Contains metadata (name, description) but no content. Handled by `prompts` table.
- **Version**: An immutable snapshot of a Prompt's content. Every save creates a new version with a commit message and an auto-incremented version number. Handled by `versions` table.
- **Test Case**: A defined requirement for a Prompt, containing `inputText` (the user message) and `expectedCriteria` (natural language requirement). Handled by `test_cases` table.
- **Test Result**: The outcome (PASS/FAIL + evaluation reason) of running a specific Version against a specific Test Case. Handled by `test_results` table.
- **Diff Viewer**: The core UI component built with Monaco Editor to visually compare two prompt Versions, identical in feel to a GitHub PR diff.
- **Test Runner**: The system that executes a Prompt Version against its Test Cases using the AI Engine (Groq/OpenRouter) to score its accuracy.
- **Public API**: The programmatic interface (`/api/v1/`) allowing developers to fetch prompts in real-time, authenticated via hashed `api_keys`.

### Architectural Decisions (ADRs)

- **[June 2026] - Chose App Router (Next.js 15)**: To unify frontend and API routes in a single repo using Server Actions and Route Handlers without a separate backend.
- **[June 2026] - Chose Drizzle ORM over Supabase JS Client**: To enforce TypeScript-first, fully type-safe SQL queries and migrations, completely avoiding raw SQL.
- **[June 2026] - Chose Monaco Editor**: To handle prompt viewing and diffing. This replaces `diff` npm library to provide a native VS Code/GitHub developer experience.
- **[June 2026] - Groq + OpenRouter for Testing**: Selected for ultra-fast, low-cost execution of test cases instead of direct OpenAI/Anthropic APIs.
- **[June 2026] - UI Aesthetics (Dark + Mono)**: Enforced a dark theme with `font-mono` for all prompt content to ensure the product feels like a serious developer tool, not a consumer SaaS dashboard.
