import Link from "next/link";
import { CreatePromptForm } from "@/components/domain/prompts";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "New Prompt — Git for Prompts" };

export default function NewPromptPage() {
  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto font-sans bg-background">
      {/* Page header */}
      <div className="mb-8 pb-6 border-b border-border">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4 font-mono font-semibold"
        >
          <ArrowLeft className="h-4 w-4" /> Prompts
        </Link>
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight font-sans">New Prompt</h1>
        <p className="text-sm text-muted-foreground mt-1.5 font-sans leading-relaxed">
          Give your prompt a name and optional description to get started.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
        {/* Left — form */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <CreatePromptForm />
        </div>

        {/* Right — tips panel */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-8">
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-3 shadow-sm">
            <h2 className="text-base font-bold text-foreground">What happens next</h2>
            <ul className="flex flex-col gap-2.5 text-xs md:text-sm text-muted-foreground leading-relaxed font-sans">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-mono font-semibold shrink-0 mt-0.5">1</span>
                Create the prompt with a name and description
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-mono font-semibold shrink-0 mt-0.5">2</span>
                Write your first version in the editor
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-mono font-semibold shrink-0 mt-0.5">3</span>
                Run tests to evaluate quality across versions
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-mono font-semibold shrink-0 mt-0.5">4</span>
                Fetch the latest version via API in any app
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-3 shadow-sm">
            <h2 className="text-base font-bold text-foreground">Naming tips</h2>
            <ul className="flex flex-col gap-2 text-xs md:text-sm text-muted-foreground leading-relaxed font-sans">
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground shrink-0">·</span>
                Use a descriptive name like <code className="text-foreground font-mono bg-muted px-1.5 py-0.5 rounded border border-border">Customer Support Agent</code>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground shrink-0">·</span>
                Avoid generic names like <code className="text-foreground font-mono bg-muted px-1.5 py-0.5 rounded border border-border">Prompt 1</code>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground shrink-0">·</span>
                Description helps teammates and your future self understand the intent
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
