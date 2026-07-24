import { CreatePromptForm } from "@/components/create-prompt-form";

export const metadata = { title: "New Prompt" };

export default function NewPromptPage() {
  return (
    <div className="p-8 max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-50">New Prompt</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Give your prompt a name and optional description.
        </p>
      </div>
      <CreatePromptForm />
    </div>
  );
}
