import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

const markdownLanding = `# Git for Prompts · Local-First Prompt Version Control

> Local-first prompt package manager and version control for AI engineering. Treat your prompts like production code.

OPEN SOURCE PROMPT VERSION CONTROL

Version-control system prompts, model configs, and output schemas. Track changes, run terminal evals, and catch regressions before production. 100% offline via CLI or synced to the cloud.

## Quickstart

Initialize a repository and run evaluations:

\`\`\`bash
npx gitforprompts init
npx gitforprompts run test-suite --all
\`\`\`

## Core Capabilities

### 1. Atomic Prompt Bundles
Every prompt version encapsulates:
- System prompt instructions
- User template with variable interpolation (\`{{variable}}\`)
- Model configurations: provider (Groq, OpenRouter, Anthropic, OpenAI), model name, temperature, topP, maxTokens
- Tools and function schemas
- Strict structured output validation schemas

### 2. Local-First Engine
- Embedded SQLite executes directly in your project root (\`.gitforprompts/\`).
- Save immutable snapshots, diff changes, and execute evals with zero cloud dependency.

### 3. Transactional Concurrency
- Cloud synchronization handles concurrent team pushes safely.
- Uses database transaction locks to guarantee atomic version numbering without races.

### 4. Zero API Key Storage
- Local terminal evaluations execute directly using local environment variables.
- Cloud API keys are securely hashed using non-reversible SHA-256 before storage.

## Developer Resources

- Website & Studio: https://gitforprompts.vercel.app
- GitHub Repository: https://github.com/kwakhare5/Git-for-Prompts
- About & Mission: https://gitforprompts.vercel.app/about
- Contact & Support: https://gitforprompts.vercel.app/contact
- Privacy Policy: https://gitforprompts.vercel.app/privacy
- Agent Index: https://gitforprompts.vercel.app/llms.txt
- Model Context Protocol (MCP): https://gitforprompts.vercel.app/.well-known/mcp.json

## REST API Reference

Base URL: \`https://gitforprompts.vercel.app/api/v1\`
Authorization: \`Bearer <gfp_api_key>\`

- \`GET /api/v1/prompts\` — List all prompt repositories.
- \`GET /api/v1/prompts/:id/latest\` — Fetch latest active version snapshot.
- \`GET /api/v1/prompts/:id/versions\` — List immutable commit history.
- \`POST /api/v1/prompts\` — Create new prompt repository.
`;

export async function GET() {
  return new NextResponse(markdownLanding, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Vary': 'Accept, Accept-Encoding',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
