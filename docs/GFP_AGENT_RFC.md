# Implementation Plan: Interactive `gfp agent` CLI Assistant

Add an autonomous prompt-tuning AI agent to the `@git-for-prompts/cli` package, powered by OpenRouter. Developers will be able to run `npx gfp agent` to interactively diagnose, optimize, evaluate, and commit prompt bundles directly inside their terminal.

## User Review Required

> [!IMPORTANT]
> - The new command will live inside `packages/cli` as `gfp agent`.
> - The hybrid auth model uses the user's `OPENROUTER_API_KEY` if configured, or falls back to free high-quality models (`meta-llama/llama-3.3-70b-instruct:free` or `openrouter/free`).
> - No existing CLI commands, Next.js routes, or database tables are modified or broken.

## Proposed Changes

### 1. Dependencies in `packages/cli`

#### [MODIFY] [package.json](file:///d:/Git%20for%20Prompts/packages/cli/package.json)
- Add `@openrouter/agent` or lightweight OpenAI-compatible agent loop for streaming & tool calling.

---

### 2. Prompt Engineering Tools (`packages/cli/src/agent/`)

#### [NEW] `packages/cli/src/agent/tools.ts`
- `list_prompts`: List all local prompt repositories.
- `read_prompt`: Read prompt bundle (system prompt, user template, model parameters, Zod response schema).
- `update_prompt`: Apply improvements to prompt text or model settings.
- `run_tests`: Run eval assertions against the prompt and report passing/failing test cases.
- `commit_version`: Commit the optimized version into local SQLite repository.

---

### 3. Terminal UI & Renderer (`packages/cli/src/agent/`)

#### [NEW] `packages/cli/src/agent/tui.ts`
- Block-style input box with `›` prompt.
- Braille spinner (`⠋⠙⠹...`) during model reasoning.
- Live token streaming for fast interactive feedback.
- Clean color-coded diff output when a prompt is edited.

---

### 4. CLI Command Integration

#### [NEW] `packages/cli/src/commands/agent.ts`
- Core runner managing the interactive REPL session, OpenRouter connection, and conversation history.

#### [MODIFY] [packages/cli/src/index.ts](file:///d:/Git%20for%20Prompts/packages/cli/src/index.ts)
- Register `program.command('agent')` with description `"Interactive AI agent to optimize, evaluate, and version prompts"`.

## Verification Plan

### Automated Tests
- Run `pnpm test` to ensure existing 154 tests remain 100% green.
- Type check: `pnpm --filter @git-for-prompts/cli build`

### Manual Verification
- Run `node packages/cli/dist/index.js agent` in a test directory.
- Test prompting the agent: `"Inspect main prompt, optimize it for brevity, and run test cases"`.
- Verify the agent edits, runs tests, and creates an immutable SQLite version row.
