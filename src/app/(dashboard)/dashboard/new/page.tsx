import Link from "next/link";
import { CreatePromptForm } from "@/components/domain/prompts";

export const dynamic = 'force-dynamic';
export const metadata = { title: "New Prompt — Git for Prompts" };

export default function NewPromptPage() {
  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-zinc-800/90 pb-5 gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/dashboard"
            className="text-xs font-mono font-bold text-zinc-400 hover:text-zinc-100 transition-colors shrink-0 flex items-center gap-1"
          >
            <span>←</span>
            <span>Back to Repositories</span>
          </Link>
          <div className="h-4 w-px bg-zinc-800 shrink-0" aria-hidden="true" />
          <h1 className="text-2xl font-bold font-mono text-zinc-100 flex items-center gap-2.5">
            <span>Create Prompt Repository</span>
            <span className="text-xs font-sans font-normal bg-emerald-500/10 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Groq / OpenRouter AI
            </span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="bg-bg-card p-6 border border-zinc-800/90 rounded-2xl shadow-xl">
          <CreatePromptForm />
        </div>

        <aside className="space-y-4 text-xs bg-bg-card p-5 border border-zinc-800/90 rounded-2xl shadow-xl font-mono">
          <div className="space-y-2">
            <h2 className="font-bold text-zinc-100 uppercase tracking-wider text-[11px]">Prompt VCS Repositories</h2>
            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
              Prompt repositories represent atomic prompt bundles containing:
            </p>
            <ul className="list-disc pl-4 text-zinc-300 space-y-1 text-[11px] font-sans">
              <li>System prompts & templates</li>
              <li>LLM parameters (temperature, model, maxTokens)</li>
              <li>Variables & Zod validation schemas</li>
              <li>Unit evaluation test suites</li>
            </ul>
          </div>

          <hr className="border-zinc-800/80" />

          <div className="space-y-2">
            <h2 className="font-bold text-zinc-100 uppercase tracking-wider text-[11px]">Syncing to Cloud</h2>
            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
              Initialize locally offline, then connect and sync using your API token:
            </p>
            <pre className="bg-bg-page p-3 border border-zinc-800 rounded-xl text-zinc-200 text-[11px] leading-relaxed overflow-x-auto">
{`$ gfp push`}
            </pre>
          </div>
        </aside>
      </div>
    </div>
  );
}
