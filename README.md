<!-- ╔══════════════════════════════════════════════════════════════════╗
     ║          GIT FOR PROMPTS — README                              ║
     ║          The Local-First Prompt Package Manager                ║
     ╚══════════════════════════════════════════════════════════════════╝ -->

<div align="center">

  # Git for Prompts

  ### *The local-first prompt package manager. Version, diff, and evaluate your AI prompts.*

  <br/>

  ![Version](https://img.shields.io/badge/version-2.0.0-blue?style=for-the-badge)
  ![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
  ![Last Commit](https://img.shields.io/github/last-commit/kwakhare5/Git-for-Prompts?style=for-the-badge&color=orange)
  ![Language](https://img.shields.io/badge/Language-TypeScript-blue?style=for-the-badge&logo=typescript&logoColor=white)

  <br/>

  <a href="#-about-the-project">About</a> &nbsp;·&nbsp;
  <a href="#-features">Features</a> &nbsp;·&nbsp;
  <a href="#-gfp-cli">CLI</a> &nbsp;·&nbsp;
  <a href="#-v2-prompt-bundles">V2 Bundles</a> &nbsp;·&nbsp;
  <a href="#-architecture">Architecture</a> &nbsp;·&nbsp;
  <a href="#-docker-self-hosting">Self-Hosting</a> &nbsp;·&nbsp;
  <a href="#-quickstart">Quickstart</a>

</div>

---

## 📌 About the Project

**Git for Prompts (`gfp`)** is a **local-first prompt package manager & version control system** built for developers working with LLMs.

Most teams manage prompts in scattered Google Docs, Notion pages, or hardcoded strings deep in codebase repositories. When a prompt changes and an AI feature degrades, nobody knows who changed what, why, or how to roll back.

`gfp` fixes this by providing:
1. **Local-first SQLite repository** — manage and version prompt bundles completely offline in your terminal (`.gfp/`).
2. **Cloud Synchronization** — push local prompt bundles to the central cloud platform when you're ready to share or run hosted evaluations (`gfp push` / `gfp pull`).
3. **Structured V2 Prompt Bundles** — version system prompts, user templates, model configs (provider, model, temperature, max tokens), tools, and response formats together as a single unit.

---

## ✨ Features

| Status | Feature | Description |
|:---:|---|---|
| ✅ | **Local-First SQLite** | `gfp init` creates a Wasm-powered `.gfp/` SQLite database right inside your project directory. 100% offline. |
| ✅ | **V2 Prompt Bundles** | Version system prompt, user template, model settings (Groq, OpenAI, Anthropic, Ollama), tools, & response schemas. |
| ✅ | **Monaco Diff Engine** | Side-by-side visual comparison with line-level diffs and model config comparison header. |
| ✅ | **Cloud Sync (`push` / `pull`)** | `gfp push <name>` and `gfp pull <name>` seamlessly synchronize local SQLite state with cloud Postgres via REST API. |
| ✅ | **Automated Eval Runner** | Run evaluations against local or cloud prompt versions using custom test cases and AI scoring criteria. |
| ✅ | **Variable Interpolation** | Auto-detect `{{variable}}` placeholders in system & user prompts; inject at runtime via query params or CLI flags. |
| ✅ | **HMAC-Signed Webhooks** | Fire-and-forget `version.created` events with HMAC-SHA256 signature verification. |
| ✅ | **Docker Self-Hosting** | Spin up the full platform + PostgreSQL database offline with a single `docker compose up -d`. |

---

## 🖥️ `gfp` CLI

The `gfp` CLI is powered by an in-process Wasm SQLite engine (`sql.js`), enabling fast local operations without native build dependencies.

```bash
# Global installation
npm install -g @gitforprompts/cli

# Initialize a local prompt repository (.gfp/ directory)
gfp init

# Authenticate with your cloud account
gfp auth --key gfp_live_your_key_here

# Create or commit a new prompt version locally
gfp add "customer-support" -m "Adjusted temperature to 0.7 for tone"

# View local commit history
gfp history customer-support

# Compare local versions
gfp diff customer-support 1 2

# Execute prompt locally with test variables
gfp run customer-support --var tone=polite --var issue="broken item"

# Sync with Cloud
gfp push customer-support         # Push local bundle -> Cloud
gfp pull customer-support         # Pull latest cloud version -> Local
```

---

## 📦 V2 Prompt Bundles

`gfp` uses a structured JSON representation for prompt bundles defined in `@gfp/core`:

```json
{
  "systemPrompt": "You are a customer support agent for Acme Corp.",
  "userTemplate": "Issue reported by {{user_name}}: {{issue_description}}",
  "modelConfig": {
    "provider": "groq",
    "model": "llama-3.3-70b-versatile",
    "temperature": 0.7,
    "maxTokens": 1024
  },
  "tools": [],
  "responseFormat": { "type": "text" }
}
```

---

## 🏗️ Architecture & Monorepo Structure

`Git for Prompts` is organized as a pnpm workspace with clean separation of concerns:

```mermaid
flowchart TD
    Core["@gfp/core (Shared Library)"]
    CLI["gfp CLI (SQLite Wasm)"]
    Web["Next.js 15 Web Platform"]
    DB[(PostgreSQL)]

    CLI -->|Imports schemas & diff engine| Core
    Web -->|Imports schemas & diff engine| Core
    CLI -->|push / pull REST API| Web
    Web --> DB
```

```
Git-for-Prompts/
├── packages/
│   ├── core/                        # @gfp/core: Schemas, bundle types, diff engine, eval runner
│   └── cli/                         # @gitforprompts/cli: SQLite Wasm CLI (init, add, push, pull, run)
├── src/
│   ├── app/                         # Next.js 15 App Router
│   │   ├── (dashboard)/dashboard/   # Prompt detail, Monaco bundle editor, diff, evals
│   │   ├── (landing)/               # Marketing page (Geist font, animated terminal)
│   │   └── api/v1/                  # Cloud REST API endpoints (GET latest, POST versions, GET name lookup)
│   ├── components/                  # Bundle editor, Monaco diff viewer, version history with badges
│   └── lib/                         # Server Actions, auth, webhooks, DB client
├── Dockerfile                       # Multi-stage standalone build
└── docker-compose.yml               # Local Docker orchestrator (Postgres 16 + Next.js App)
```

---

## 🐳 Docker Self-Hosting

Run **Git for Prompts** completely self-hosted inside your infrastructure:

```bash
# 1. Clone repository
git clone https://github.com/kwakhare5/Git-for-Prompts.git
cd Git-for-Prompts

# 2. Set environment variables
export NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_key"
export CLERK_SECRET_KEY="your_secret"

# 3. Spin up application & database
docker compose up -d
```

Access your instance at `http://localhost:3000`.

---

## 🚀 Local Development Quickstart

### Prerequisites
- Node.js 20+
- pnpm 9+

### Setup

```bash
# 1. Clone & install dependencies
git clone https://github.com/kwakhare5/Git-for-Prompts.git
cd Git-for-Prompts
pnpm install

# 2. Configure environment
cp .env.example .env.local

# 3. Run database migrations
pnpm drizzle-kit migrate

# 4. Start development server
pnpm dev
```

---

## 🧪 Testing

```bash
# Run unit & API integration test suite
pnpm test

# Type-check entire workspace
npx tsc --noEmit
```

---

## 📄 License

MIT — see `LICENSE`.

<br/>

<div align="center">

  Made with ❤️ by [Karan Wakhare](https://github.com/kwakhare5)

  *"Treat your prompts as carefully as you treat your code."*

</div>
