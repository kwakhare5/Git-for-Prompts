import Link from "next/link";
import { CreatePromptForm } from "@/components/create-prompt-form";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "New Prompt" };

export default function NewPromptPage() {
  return (
    <div className="p-4 sm:p-8 max-w-2xl">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors mb-4 font-mono"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Prompts
        </Link>
        <h1 className="text-2xl font-bold text-zinc-50">New Prompt</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Give your prompt a name and optional description.
        </p>
      </div>
      <CreatePromptForm />
    </div>
  );
}
