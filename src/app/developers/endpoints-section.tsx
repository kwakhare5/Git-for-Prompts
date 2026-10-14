import React from 'react';
import { Cpu } from 'lucide-react';

export function EndpointsSection() {
  return (
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
  );
}
