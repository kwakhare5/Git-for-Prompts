'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";
import { createPromptSchema, type CreatePromptInput } from "@/lib/validations/prompt";
import { createPrompt } from "@/lib/actions/prompts";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
        <label htmlFor="name" className="block text-sm font-medium text-foreground">
          Name <span className="text-destructive">*</span>
        </label>
        <Input
          id="name"
          {...register("name")}
          placeholder="e.g. Customer Support Agent…"
          autoComplete="off"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label htmlFor="description" className="block text-sm font-medium text-foreground">
          Description
          <span className="ml-1.5 text-xs text-muted-foreground">(optional)</span>
        </label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="What does this prompt do?…"
          autoComplete="off"
          rows={3}
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Root error */}
      {errors.root && (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {errors.root.message}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1">
        <Button
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Creating…" : "Create Prompt"}
        </Button>
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
