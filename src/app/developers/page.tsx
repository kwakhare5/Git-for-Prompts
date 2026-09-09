import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DeveloperFooter } from '@/components/website/DeveloperFooter';
import { Terminal, Shield, Cpu, Key, ExternalLink, RefreshCw, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Developer Portal & API Reference | Git for Prompts',
  description:
    'Complete developer documentation for Git for Prompts: CLI commands, REST API v1 endpoints, RFC rate limiting, 90-day deprecation policy, and Model Context Protocol (MCP) server configuration.',
  alternates: {
    canonical: 'https://gitforprompts.vercel.app/developers',
  },
};

export const dynamic = 'force-static';

export default function DevelopersPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-bg-page text-zinc-100 font-sans">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 font-sans w-full flex-1">
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-4 border-b border-zinc-800/90 pb-8">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.5} />
              <span>DEVELOPER PORTAL &amp; API SPECIFICATION</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-semibold text-zinc-100 tracking-normal">
              Git for Prompts Developer Reference
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-3xl font-sans">
              Integrate prompt version control, automated diffs, and evaluation pipelines directly into your CI/CD workflows, terminal sessions, or AI agent runtimes via our CLI, REST API, and Model Context Protocol (MCP) server.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/openapi.json"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
                <span>OpenAPI 3.1.0 Spec</span>
                <ExternalLink className="w-3 h-3 text-zinc-500" strokeWidth={1.5} />
              </Link>
              <Link
                href="/.well-known/mcp.json"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 transition-colors"
              >
                <Cpu className="w-4 h-4 text-purple-400" strokeWidth={1.5} />
                <span>MCP Manifest (JSON)</span>
                <ExternalLink className="w-3 h-3 text-zinc-500" strokeWidth={1.5} />
              </Link>
              <Link
                href="/llms.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 transition-colors"
              >
                <Shield className="w-4 h-4 text-blue-400" strokeWidth={1.5} />
                <span>llms.txt for Agents</span>
                <ExternalLink className="w-3 h-3 text-zinc-500" strokeWidth={1.5} />
              </Link>
            </div>
          </div>

          {/* Quickstart & CLI */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 font-mono flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" strokeWidth={1.5} />
              <span>1. Command Line Interface (CLI)</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              The official CLI works completely offline with a local SQLite database in your repository (<code className="text-emerald-400 font-mono text-xs">.gitforprompts/</code>) and syncs securely to Git for Prompts cloud when authenticated.
            </p>
            <div className="bg-zinc-950 border border-zinc-800/90 rounded-2xl p-5 font-mono text-xs text-zinc-300 space-y-3 overflow-x-auto">
              <div className="text-zinc-500"># 1. Initialize local repository in your current directory</div>
              <div className="text-emerald-400 font-bold">$ npx gitforprompts init</div>
              <div className="text-zinc-500 pt-2"># 2. Stage and commit a prompt bundle locally</div>
              <div>$ npx gitforprompts commit -m &quot;Refactor system prompt to enforce strict JSON output&quot;</div>
              <div className="text-zinc-500 pt-2"># 3. View visual diff between two commits or against HEAD</div>
              <div>$ npx gitforprompts diff HEAD~1</div>
              <div className="text-zinc-500 pt-2"># 4. Push local changes to cloud repository</div>
              <div>$ npx gitforprompts push &lt;promptId&gt; prompt.bundle.json</div>
              <div className="text-zinc-500 pt-2"># 5. Pull latest cloud snapshot into your local workspace</div>
              <div>$ npx gitforprompts pull &lt;promptId&gt;</div>
            </div>
          </section>

          {/* Authentication & Scopes */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 font-mono flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-400" strokeWidth={1.5} />
              <span>2. API Authentication &amp; Scopes</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              All REST API and MCP requests require an API key passed in the <code className="text-emerald-400 font-mono text-xs">Authorization</code> header as a Bearer token. Generate keys inside your <Link href="/dashboard/api-keys" className="text-emerald-400 underline hover:text-emerald-300">API Keys Dashboard</Link>.
            </p>
            <div className="bg-zinc-950 border border-zinc-800/90 rounded-2xl p-4 font-mono text-xs text-zinc-300">
              <code>Authorization: Bearer gfp_live_your_secret_api_key_here</code>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-bg-card border border-zinc-800/90 space-y-1">
                <span className="font-mono text-xs font-bold text-emerald-400">prompts:read</span>
                <p className="text-xs text-zinc-400">Fetch prompt repositories, version history, and active bundles.</p>
              </div>
              <div className="p-4 rounded-xl bg-bg-card border border-zinc-800/90 space-y-1">
                <span className="font-mono text-xs font-bold text-blue-400">prompts:write</span>
                <p className="text-xs text-zinc-400">Create new prompt repositories and configure evaluation settings.</p>
              </div>
              <div className="p-4 rounded-xl bg-bg-card border border-zinc-800/90 space-y-1">
                <span className="font-mono text-xs font-bold text-purple-400">versions:write</span>
                <p className="text-xs text-zinc-400">Push new immutable prompt version snapshots from CLI or CI runners.</p>
              </div>
            </div>
          </section>

          {/* REST API Endpoints */}
          <section className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 font-mono flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-400" strokeWidth={1.5} />
              <span>3. REST API Endpoints</span>
            </h2>

            {/* GET /api/v1/prompts */}
            <div className="p-5 rounded-2xl bg-bg-card border border-zinc-800/90 space-y-3">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">GET</span>
                <code className="text-sm font-mono text-zinc-200">/api/v1/prompts?name=&lt;name&gt;</code>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400">
                Resolve a prompt name to its unique ID for the authenticated key owner.
              </p>
              <pre className="bg-zinc-950 p-3 rounded-xl font-mono text-xs text-zinc-300 overflow-x-auto">{`curl -H "Authorization: Bearer $GFP_API_KEY" \\
  "https://gitforprompts.vercel.app/api/v1/prompts?name=customer-support-agent"`}</pre>
            </div>

            {/* GET /api/v1/prompts/[id]/latest */}
            <div className="p-5 rounded-2xl bg-bg-card border border-zinc-800/90 space-y-3">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">GET</span>
                <code className="text-sm font-mono text-zinc-200">/api/v1/prompts/:id/latest</code>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400">
                Retrieve the latest active version snapshot with optional runtime variable interpolation via query params (<code className="text-emerald-400 font-mono text-xs">?variables[user_name]=Alice</code>).
              </p>
              <pre className="bg-zinc-950 p-3 rounded-xl font-mono text-xs text-zinc-300 overflow-x-auto">{`curl -H "Authorization: Bearer $GFP_API_KEY" \\
  "https://gitforprompts.vercel.app/api/v1/prompts/pr_abc123/latest?variables[user_name]=Alice"`}</pre>
            </div>

            {/* POST /api/v1/prompts/[id]/versions */}
            <div className="p-5 rounded-2xl bg-bg-card border border-zinc-800/90 space-y-3">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">POST</span>
                <code className="text-sm font-mono text-zinc-200">/api/v1/prompts/:id/versions</code>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400">
                Push a new immutable version snapshot. Protected by advisory transactional database locks to prevent concurrent sequence collisions.
              </p>
              <pre className="bg-zinc-950 p-3 rounded-xl font-mono text-xs text-zinc-300 overflow-x-auto">{`curl -X POST \\
  -H "Authorization: Bearer $GFP_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"content":"You are a billing specialist...","commitMessage":"Update refund escalation policy"}' \\
  "https://gitforprompts.vercel.app/api/v1/prompts/pr_abc123/versions"`}</pre>
            </div>
          </section>

          {/* Rate Limiting & RFC Headers */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 font-mono flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-emerald-400" strokeWidth={1.5} />
              <span>4. Rate Limiting &amp; RFC Headers</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              To protect service availability and prevent token exhaustion, Git for Prompts implements multi-layered token-bucket rate limiting backed by distributed Redis.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-5 rounded-2xl bg-bg-card border border-zinc-800/90 space-y-2">
                <h3 className="font-bold text-zinc-200 text-sm">Standard Read / Query Limit</h3>
                <p className="text-zinc-400 font-sans">
                  <strong>60 requests per minute</strong> per client IP address across all read endpoints.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-bg-card border border-zinc-800/90 space-y-2">
                <h3 className="font-bold text-zinc-200 text-sm">Expensive Mutation Limit</h3>
                <p className="text-zinc-400 font-sans">
                  <strong>20 version creations per minute</strong> per API key to ensure database consistency.
                </p>
              </div>
            </div>
            <p className="text-xs text-zinc-400 font-sans">
              Every API response includes standard RFC rate limit headers:
            </p>
            <div className="bg-zinc-950 border border-zinc-800/90 rounded-2xl p-4 font-mono text-xs text-zinc-300 space-y-1">
              <div>RateLimit-Limit: 60</div>
              <div>RateLimit-Remaining: 59</div>
              <div>RateLimit-Reset: 60</div>
              <div className="text-zinc-500"># On 429 status code:</div>
              <div className="text-amber-400">Retry-After: 60</div>
            </div>
          </section>

          {/* Error Handling & Agent Self-Healing */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 font-mono flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-400" strokeWidth={1.5} />
              <span>5. Structured Errors &amp; Agent Self-Healing</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              All error responses return machine-readable status codes and human-understandable <code className="text-emerald-400 font-mono text-xs">hint</code> directives allowing autonomous AI coding agents (Claude, Cursor, Devin) to self-heal when encountering 400, 401, 404, or 429 errors.
            </p>
            <div className="bg-zinc-950 border border-zinc-800/90 rounded-2xl p-4 font-mono text-xs text-zinc-300">
              <pre>{`{
  "error": "Prompt not found",
  "code": "PROMPT_NOT_FOUND",
  "hint": "Verify that the prompt ID exists and is owned by the authenticated account. You can discover prompts using GET /api/v1/prompts?name=<name>."
}`}</pre>
            </div>
          </section>

          {/* Model Context Protocol (MCP) Server */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 font-mono flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400" strokeWidth={1.5} />
              <span>6. Model Context Protocol (MCP) Setup</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Git for Prompts natively supports Anthropic&apos;s open Model Context Protocol. Connect Cursor, Claude Desktop, or Windsurf directly to inspect prompts and run evaluations inside your chat agent.
            </p>
            <div className="p-5 rounded-2xl bg-bg-card border border-zinc-800/90 space-y-3">
              <h3 className="font-mono text-xs font-bold text-zinc-200">Cursor / Claude Desktop Config (.cursor/mcp.json)</h3>
              <div className="bg-zinc-950 p-4 rounded-xl font-mono text-xs text-zinc-300 overflow-x-auto">
                <pre>{`{
  "mcpServers": {
    "gitforprompts": {
      "url": "https://gitforprompts.vercel.app/api/v1/mcp",
      "headers": {
        "Authorization": "Bearer gfp_live_YOUR_API_KEY"
      }
    }
  }
}`}</pre>
              </div>
            </div>
          </section>

          {/* API Deprecation & Sunset Policy */}
          <section className="space-y-4 border-t border-zinc-800/90 pt-8">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 font-mono flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-zinc-400" strokeWidth={1.5} />
              <span>7. Versioning &amp; 90-Day Sunset Deprecation Policy</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Our API follows strict semantic URI versioning (<code className="text-emerald-400 font-mono text-xs">/api/v1</code>). We guarantee backward compatibility for all stable endpoints.
            </p>
            <div className="p-5 rounded-2xl bg-bg-card border border-zinc-800/90 space-y-2 text-xs sm:text-sm text-zinc-400">
              <p>
                <strong>Deprecation Notice:</strong> Any endpoint scheduled for retirement will emit standard HTTP <code className="text-amber-400 font-mono text-xs">Deprecation: true</code> and <code className="text-amber-400 font-mono text-xs">Sunset: &lt;HTTP-date&gt;</code> headers.
              </p>
              <p>
                <strong>90-Day Grace Period:</strong> Deprecated endpoints are guaranteed to remain fully functional for a minimum of 90 calendar days following official notification before being retired.
              </p>
            </div>
          </section>
        </div>
      </main>
      <DeveloperFooter />
    </div>
  );
}
