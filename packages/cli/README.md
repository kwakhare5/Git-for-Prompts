# gitforprompts

The local-first prompt package manager & version control system for AI engineering.

[![npm version](https://img.shields.io/npm/v/gitforprompts?color=blue)](https://www.npmjs.com/package/gitforprompts)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**Git for Prompts** brings Git-like version control, side-by-side diffing, and automated multi-model evals directly to your terminal. It stores prompt versions entirely offline in an embedded SQLite database (`.gitforprompts/`) powered by WebAssembly (`sql.js`).

---

## Quickstart

Run with zero install via `npx`:

```bash
# Initialize a local prompt repository (.gitforprompts/)
npx gitforprompts init

# Track a prompt bundle inline or interactively
gitforprompts add system-prompt "You are a senior TypeScript architect."

# View version history
gitforprompts history system-prompt

# Diff versions side-by-side
gitforprompts diff system-prompt 1 2

# Add a test case and run evaluations
gitforprompts test-add system-prompt
gitforprompts run system-prompt

# Connect and sync with the Cloud Dashboard
gitforprompts auth gfp_live_your_api_key
gitforprompts push system-prompt
gitforprompts pull system-prompt
```

---

## Commands

| Command | Description |
|---|---|
| `gitforprompts init` | Initialize a `.gitforprompts/` directory with local SQLite database |
| `gitforprompts add <name> [content]` | Track or update a prompt bundle (inline or interactive editor) |
| `gitforprompts list` | List all tracked prompt bundles and their latest versions |
| `gitforprompts history <name>` | Show commit history, hashes, and change logs |
| `gitforprompts diff <name> <v1> <v2>` | Compare two versions side-by-side |
| `gitforprompts test-add <name>` | Add an eval test case with variables and assertions |
| `gitforprompts run <name>` | Execute evaluations against test cases |
| `gitforprompts auth <api-key>` | Save API key for cloud synchronization |
| `gitforprompts push <name>` | Push local prompt bundle to the cloud platform |
| `gitforprompts pull <name>` | Pull cloud prompt to local SQLite repository |

---

## Global Installation

```bash
npm install -g gitforprompts
```

---

## Links

- **Web Platform & Dashboard:** [https://gitforprompts.vercel.app](https://gitforprompts.vercel.app)
- **GitHub Repository:** [https://github.com/kwakhare5/git-for-prompts](https://github.com/kwakhare5/git-for-prompts)
- **Documentation:** [README.md](https://github.com/kwakhare5/git-for-prompts#readme)
