import Link from "next/link";
import { CreatePromptForm } from "@/components/create-prompt-form";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "New Prompt — Git for Prompts" };

export default function NewPromptPage() {
  return (
    <div className="p-4 sm:p-8">
      {/* Page header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors mb-4 font-mono"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Prompts
        </Link>
        <h1 className="text-2xl font-bold text-zinc-50">New Prompt</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Give your prompt a name and optional description to get started.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px] lg:items-start">
        {/* Left — form */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <CreatePromptForm />
        </div>

        {/* Right — tips panel */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-8">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-zinc-300">What happens next</h2>
            <ul className="flex flex-col gap-2 text-xs text-zinc-500">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 shrink-0 mt-0.5">1</span>
                Create the prompt with a name and description
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 shrink-0 mt-0.5">2</span>
                Write your first version in the editor
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 shrink-0 mt-0.5">3</span>
                Run tests to evaluate quality across versions
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 shrink-0 mt-0.5">4</span>
                Fetch the latest version via API in any app
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-zinc-300">Naming tips</h2>
            <ul className="flex flex-col gap-1.5 text-xs text-zinc-500">
              <li className="flex items-start gap-1.5">
                <span className="text-zinc-600 shrink-0">·</span>
                Use a descriptive name like <code className="text-zinc-400 font-mono">Customer Support Agent</code>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-zinc-600 shrink-0">·</span>
                Avoid generic names like <code className="text-zinc-400 font-mono">Prompt 1</code>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-zinc-600 shrink-0">·</span>
                Description helps teammates and your future self understand the intent
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
