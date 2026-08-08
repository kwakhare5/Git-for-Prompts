'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";
import { createPromptSchema, type CreatePromptInput } from "@/lib/validations/prompt";
import { createPrompt } from "@/lib/actions/prompts";

export function CreatePromptForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<CreatePromptInput>({
    resolver: zodResolver(createPromptSchema),
  });

  function onSubmit(data: CreatePromptInput) {
    startTransition(async () => {
      try {
        const prompt = await createPrompt(data);
        router.push(`/dashboard/prompts/${prompt.id}`);
      } catch {
        setError("root", { message: "Failed to create prompt. Please try again." });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 font-sans">
      {/* Name */}
      <div className="space-y-1.5">
        <label htmlFor="name" className="block text-xs font-mono font-bold text-zinc-200">
          Repository Name <span className="text-rose-400">*</span>
        </label>
        <input
          id="name"
          {...register("name")}
          placeholder="e.g. Customer Support AI Agent..."
          autoComplete="off"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          className="w-full rounded-xl border border-zinc-800 bg-[#121214] px-3.5 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 outline-none font-mono focus:border-zinc-600"
        />
        {errors.name && (
          <p className="text-xs text-rose-300 font-mono">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label htmlFor="description" className="block text-xs font-mono font-bold text-zinc-200">
          Description
          <span className="ml-1.5 text-[11px] text-zinc-500 font-normal">(optional)</span>
        </label>
        <textarea
          id="description"
          {...register("description")}
          placeholder="Purpose and business context of this prompt bundle..."
          autoComplete="off"
          rows={3}
          className="w-full rounded-xl border border-zinc-800 bg-[#121214] px-3.5 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 outline-none font-mono focus:border-zinc-600"
        />
        {errors.description && (
          <p className="text-xs text-rose-300 font-mono">{errors.description.message}</p>
        )}
      </div>

      {/* Engine Default Pill */}
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 text-xs text-blue-300 flex items-center justify-between font-mono">
        <span>Initial Engine Preset:</span>
        <span className="font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
          groq/llama-3.3-70b-versatile
        </span>
      </div>

      {/* Root error */}
      {errors.root && (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300 font-mono">
          {errors.root.message}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 font-mono">
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl text-xs font-bold shadow-xs active:scale-97 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isPending ? "Creating Repository…" : "+ Initialize Prompt Repository"}
        </button>
        <Link
          href="/dashboard"
          className="px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
