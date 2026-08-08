'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createPrompt } from '@/lib/actions/prompts';
import { createVersion } from '@/lib/actions/versions';
import { createTestCase } from '@/lib/actions/tests';
import { Zap } from 'lucide-react';

export function CreateSamplePromptButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleCreateSample() {
    startTransition(async () => {
      try {
        // 1. Create prompt repository
        const prompt = await createPrompt({
          name: 'code-reviewer-v3',
          description: 'Senior Automated Code Reviewer & Static Analysis Engine.',
        });

        if (!prompt?.id) return;

        // 2. Create initial version with a complete V2 bundle
        await createVersion({
          promptId: prompt.id,
          commitMessage: 'Initial code reviewer bundle commit',
          bundle: {
            systemPrompt:
              'You are an expert senior code reviewer. Analyze the submitted code snippet for security vulnerabilities, performance bottlenecks, and code style flaws. Return valid JSON adhering strictly to the output schema.',
            userTemplate:
              'Review the following {{language}} submission:\n\n```\n{{codeSnippet}}\n```\n\nReturn JSON with fields: securityScore, issues (array of strings), and recommendations.',
            modelConfig: {
              provider: 'groq',
              model: 'llama-3.3-70b-versatile',
              temperature: 0.2,
              maxTokens: 2048,
            },
            tools: [],
            responseFormat: { type: 'json_object' },
          },
        });

        // 3. Create initial test case assertions
        await createTestCase({
          promptId: prompt.id,
          name: 'Security Vulnerability Test Case',
          inputText: 'Review the following typescript submission:\n\n```\nconst query = "SELECT * FROM users WHERE id = " + req.query.id;\n```',
          expectedCriteria: 'Must identify SQL injection vulnerability and recommend parameterized query.',
        });

        router.push(`/dashboard/prompts/${prompt.id}`);
      } catch (err) {
        console.error('Failed to create sample prompt', err);
      }
    });
  }

  return (
    <button
      onClick={handleCreateSample}
      disabled={isPending}
      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-mono font-bold shadow-xs active:scale-97 transition-all shrink-0 cursor-pointer disabled:opacity-50"
    >
      <Zap className="w-4 h-4 text-blue-300" />
      <span>{isPending ? 'Initializing Sample Bundle…' : 'Initialize Starter Bundle'}</span>
    </button>
  );
}
