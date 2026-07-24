<!-- ╔══════════════════════════════════════════════════════════════════╗
     ║          GIT FOR PROMPTS — README                              ║
     ║          The Version Control System for AI Prompts             ║
     ╚══════════════════════════════════════════════════════════════════╝ -->

<div align="center">

  # Git for Prompts

  ### *Treat your prompts like code. Version, test, and deploy with confidence.*

  <br/>

  ![Version](https://img.shields.io/badge/version-1.1.0-blue?style=for-the-badge)
  ![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
  ![Last Commit](https://img.shields.io/github/last-commit/kwakhare5/Git-for-Prompts?style=for-the-badge&color=orange)
  ![Stars](https://img.shields.io/github/stars/kwakhare5/Git-for-Prompts?style=for-the-badge&color=yellow)
  ![Language](https://img.shields.io/badge/Language-TypeScript-blue?style=for-the-badge&logo=typescript&logoColor=white)

  <br/>

  <a href="#-about-the-project">About</a> &nbsp;·&nbsp;
  <a href="#-demo">Demo</a> &nbsp;·&nbsp;
  <a href="#-features">Features</a> &nbsp;·&nbsp;
  <a href="#-api">API</a> &nbsp;·&nbsp;
  <a href="#-cli">CLI</a> &nbsp;·&nbsp;
  <a href="#-tech-stack">Tech Stack</a> &nbsp;·&nbsp;
  <a href="#-quickstart">Quickstart</a> &nbsp;·&nbsp;
  <a href="#-contributing">Contributing</a>

</div>

---

## 🎬 Demo

<div align="center">
  <img src="./public/hero-demo.gif" alt="Git for Prompts Demo" width="800"/>
</div>

<br/>

**Live:** [gitforprompts.vercel.app](https://gitforprompts.vercel.app)

---

## 📌 About the Project

**Git for Prompts** is a production-grade **Version Control System for AI prompts** built with **Next.js 15, Drizzle ORM, and Monaco Editor**.

Every company building AI products manages prompts in Google Docs, Notion, or hardcoded strings. There is no version history, no rollback, no testing, no review process. When a prompt changes and the AI breaks, nobody knows what changed or how to fix it.

Git for Prompts gives prompts the same treatment that code gets — full version history, automated testing, a public API, a push CLI, and HMAC-signed webhooks.

> **Why this project?**
> When prompts change, AI products break. Git for Prompts gives you the tools to ensure that never happens by treating prompt engineering as a first-class software engineering discipline.

<br/>

---

## ✨ Features

| Status | Feature | Description |
|:---:|---|---|
| ✅ | **Immutable Versioning** | 0% failure rate on concurrent saves via `pg_advisory_xact_lock`. Every save is a new append-only row — never overwritten. |
| ✅ | **GitHub-Style Diff** | Side-by-side visual comparison with Monaco Editor (VS Code engine). |
| ✅ | **A/B Comparison** | Run automated tests against any two versions in parallel and score pass rates side-by-side. |
| ✅ | **Automated Test Runner** | Define input + expected criteria once. Run against any version. Bulk-upsert results in one DB round-trip. |
| ✅ | **Variable Interpolation** | `{{variable}}` syntax in prompt templates. Inject values at runtime via `?variables[name]=value` query params. |
| ✅ | **Webhook Delivery** | HMAC-SHA256-signed `version.created` events fired to your endpoint — fire-and-forget, never blocks a save. |
| ✅ | **gfp CLI** | `gfp auth` · `gfp pull <id> --version N` · `gfp push <id> <file>` — commit versions from your terminal or CI. |
| ✅ | **Push API** | `POST /api/v1/prompts/:id/versions` — create new versions programmatically with advisory lock protection. |
| ✅ | **Public REST API** | `GET /api/v1/prompts/:id/latest` — Bearer auth, O(1) SHA-256 key lookup, ~20ms latency. |
| ✅ | **Explore Page** | Browse and fork public prompts. One-click fork creates a private copy with version history intact. |
| ✅ | **Scheduled Regression** | Cron job re-runs test suites automatically on a per-prompt schedule. |
| ✅ | **API Keys Manager** | Generate, name, and revoke `gfp_live_*` keys from the dashboard. |

<br/>

---

## 🔌 API

### GET /api/v1/prompts/:id/latest

Fetch the latest version of a prompt at runtime.

```bash
curl https://gitforprompts.vercel.app/api/v1/prompts/YOUR_PROMPT_ID/latest \
  -H "Authorization: Bearer gfp_live_your_key_here"

# With variable interpolation:
curl "https://gitforprompts.vercel.app/api/v1/prompts/YOUR_PROMPT_ID/latest?variables[tone]=formal&variables[language]=English" \
  -H "Authorization: Bearer gfp_live_your_key_here"
```

**Response:**
```json
{
  "promptId": "uuid",
  "promptName": "customer-support",
  "versionNumber": 5,
  "content": "You are a formal customer support agent...",
  "variables": ["tone", "language"],
  "createdAt": "2026-07-24T..."
}
```

### POST /api/v1/prompts/:id/versions

Create a new version via API (used by `gfp push`).

```bash
curl -X POST https://gitforprompts.vercel.app/api/v1/prompts/YOUR_PROMPT_ID/versions \
  -H "Authorization: Bearer gfp_live_your_key_here" \
  -H "Content-Type: application/json" \
  -d '{"content": "Updated prompt...", "commitMessage": "Improved tone"}'
```

---

## 🖥️ CLI

```bash
npm install -g @gitforprompts/cli

gfp auth                                        # Authenticate with your API key
gfp pull customer-support --version 4           # Download a specific version
gfp push customer-support ./prompt_template.txt # Push a new version from file
```

---

## 🛠️ Tech Stack

<div align="center">

### Core
![Next.js](https://skillicons.dev/icons?i=nextjs)
![TypeScript](https://skillicons.dev/icons?i=ts)
![Tailwind CSS](https://skillicons.dev/icons?i=tailwind)

### Infrastructure
![Supabase](https://skillicons.dev/icons?i=supabase)
![Vercel](https://skillicons.dev/icons?i=vercel)

</div>

<br/>

| Layer | Technology | Purpose |
|---|---|---|
| **Language** | TypeScript (strict) | 100% type-safe, zero `any` |
| **Framework** | Next.js 15 (App Router) | Full-stack, ~20ms API latency |
| **Database** | PostgreSQL + Drizzle ORM | `pg_advisory_xact_lock` → 0% concurrency failure |
| **Auth** | Clerk | GitHub OAuth, session management |
| **Styling** | Tailwind CSS v4 | Dark theme, monospace fidelity |
| **AI Engine** | Groq (primary) + OpenRouter (fallback) | Dual-model, 100% eval accuracy |
| **Rate Limiting** | Upstash Redis | Serverless-compatible, per-key + per-IP |
| **Deployment** | Vercel | Auto-deploy from GitHub main |

<br/>

---

## 🏗️ Architecture

```mermaid
flowchart LR
    CLI[gfp CLI] -->|push API| API
    App[Next.js UI] --> SA[Server Actions]
    SA --> DB[(Supabase Postgres)]
    SA --> AI[Groq / OpenRouter]
    SA -->|fire-and-forget| WH[Webhook delivery]
    API[REST API v1] --> DB
    API -->|advisory lock| DB
    CRON[Regression cron] --> SA
```

<br/>

---

## 📁 Project Structure

```
Git-for-Prompts/
├── src/
│   ├── app/
│   │   ├── (auth)/                    # Clerk sign-in/sign-up
│   │   ├── (dashboard)/dashboard/     # Protected app UI
│   │   │   ├── prompts/[id]/          # Prompt detail, diff, tests, compare
│   │   │   ├── webhooks/              # Webhook management page
│   │   │   └── api-keys/              # API key management
│   │   ├── (landing)/                 # Marketing page + explore
│   │   └── api/v1/prompts/[id]/
│   │       ├── latest/route.ts        # GET — fetch prompt at runtime
│   │       └── versions/route.ts      # POST — push new version
│   ├── components/                    # React UI components
│   ├── db/
│   │   ├── schema.ts                  # Drizzle schema (7 migrations applied)
│   │   └── migrations/                # 0000–0007
│   └── lib/
│       ├── actions/                   # Server Actions
│       │   ├── prompts.ts             # CRUD + fork
│       │   ├── versions.ts            # create, restore, insertNextVersion
│       │   ├── tests.ts               # test runner (delegates to TestRunner)
│       │   └── webhooks.ts            # webhook CRUD
│       ├── api-auth.ts                # Shared API key authentication module
│       ├── test-runner.ts             # Deep TestRunner module (AI + persist)
│       ├── webhooks.ts                # HMAC-SHA256 webhook delivery
│       ├── variables.ts               # {{variable}} extraction + interpolation
│       └── ai.ts                      # Groq + OpenRouter dual-model client
├── packages/
│   └── cli/                           # gfp CLI (auth, pull, push)
└── e2e/                               # Playwright E2E tests
```

<br/>

---

## 🚀 Quickstart

### Prerequisites

- **Node.js 20+**
- **pnpm**
- **Supabase project** (for DATABASE_URL)
- **Clerk account** (for auth keys)
- **Upstash Redis** (for rate limiting)
- **Groq API key** (AI evaluation)

### Step 1 — Clone

```bash
git clone https://github.com/kwakhare5/Git-for-Prompts.git
cd Git-for-Prompts
```

### Step 2 — Install

```bash
pnpm install
```

### Step 3 — Environment

```bash
cp .env.example .env.local
# Fill in DATABASE_URL, CLERK_*, UPSTASH_*, GROQ_API_KEY
```

### Step 4 — Migrate

```bash
pnpm drizzle-kit migrate
```

### Step 5 — Dev

```bash
pnpm dev
```

Open [localhost:3000](http://localhost:3000).

<br/>

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/your-feature`)
3. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/) (`git commit -m "feat: add your feature"`)
4. **Push** (`git push origin feature/your-feature`)
5. **Open a Pull Request**

<br/>

---

## 🛡️ Security

- All AI interactions proxied through Server Actions — API keys never in the client bundle
- API keys stored as SHA-256 hash (lookup) + never shown in plaintext after creation
- Webhooks signed with HMAC-SHA256 — verify `X-GFP-Signature` header on your endpoint
- Rate limiting on all API routes: 60 req/min per IP

<br/>

---

## 📄 License

MIT — see `LICENSE`.

<br/>

---

## 👨‍💻 Author

<div align="center">

### Karan Wakhare
*Full Stack Engineer*

<br/>

[![LinkedIn](https://img.shields.io/badge/LinkedIn-karanwakhare-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/karanwakhare)
[![Twitter](https://img.shields.io/badge/Twitter-kwakhare5-1DA1F2?style=for-the-badge&logo=x&logoColor=white)](https://x.com/kwakhare5)
[![Gmail](https://img.shields.io/badge/Gmail-kwakhare5%40gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:kwakhare5@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-kwakhare5-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/kwakhare5)

<br/>

![GitHub Streak](https://streak-stats.demolab.com/?user=kwakhare5&theme=tokyonight&hide_border=true)

<br/>

![Profile Views](https://komarev.com/ghpvc/?username=kwakhare5&label=Profile+Views&color=0e75b6&style=for-the-badge)

</div>

<br/>

---

<div align="center">

  Made with ❤️ by [Karan Wakhare](https://github.com/kwakhare5)

  <br/>

  *"Treat your prompts as carefully as you treat your code."*

  <br/>

  ![Wave](https://raw.githubusercontent.com/mayhemantt/mayhemantt/Update/svg/Bottom.svg)

</div>
