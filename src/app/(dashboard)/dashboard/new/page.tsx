import Link from "next/link";
import { CreatePromptForm } from "@/components/domain/prompts";

export const dynamic = 'force-dynamic';
export const metadata = { title: "New Prompt — Git for Prompts" };

export default function NewPromptPage() {
  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-zinc-800/90 pb-5">
        <Link href="/dashboard" className="text-xs font-mono font-bold text-zinc-400 hover:text-zinc-100 transition-colors">
          ← Back to Repositories
        </Link>
        <h1 className="text-2xl font-bold font-mono text-zinc-100 mt-2 flex items-center gap-2">
          <span>Create Prompt Repository</span>
          <span className="text-xs font-sans font-normal bg-blue-500/10 text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-500/20">
            Groq / OpenRouter AI
          </span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1 font-sans">
          Initialize a new prompt bundle with version control, variable extraction, and test suite evals.
        </p>
      </div>

      <div className="max-w-2xl bg-bg-card p-6 border border-zinc-800/90 rounded-2xl shadow-xl">
        <CreatePromptForm />
      </div>
    </div>
  );
}
