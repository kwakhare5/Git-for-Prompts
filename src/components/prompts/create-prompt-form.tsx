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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name */}
      <div className="space-y-1.5">
        <label htmlFor="name" className="block text-sm font-medium text-zinc-300">
          Name <span className="text-red-400">*</span>
        </label>
        <input
          id="name"
          {...register("name")}
          placeholder="e.g. Customer Support Agent…"
          autoComplete="off"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-colors"
        />
        {errors.name && (
          <p className="text-xs text-red-400">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label htmlFor="description" className="block text-sm font-medium text-zinc-300">
          Description
          <span className="ml-1.5 text-xs text-zinc-600">(optional)</span>
        </label>
        <textarea
          id="description"
          {...register("description")}
          placeholder="What does this prompt do?…"
          autoComplete="off"
          rows={3}
          className="w-full resize-none rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 transition-colors"
        />
        {errors.description && (
          <p className="text-xs text-red-400">{errors.description.message}</p>
        )}
      </div>

      {/* Root error */}
      {errors.root && (
        <p className="rounded-md border border-red-900 bg-red-950/50 px-3 py-2 text-xs text-red-400">
          {errors.root.message}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-md bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? "Creating…" : "Create Prompt"}
        </button>
        <Link
          href="/dashboard"
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
