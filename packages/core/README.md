# @gfp/core

The framework-agnostic core domain engine for **Git for Prompts**. Pure TypeScript, zero framework dependencies, with Zod runtime validation.

[![npm version](https://img.shields.io/badge/package-@gfp%2Fcore-blue.svg)](https://github.com/kwakhare5/git-for-prompts)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

---

## Capabilities

- **Atomic Prompt Bundles**: Validates structured prompt snapshots encapsulating system prompts, user templates with `{{variable}}` syntax, model hyperparameters (temperature, top_p, maxTokens), tools, and response format schemas.
- **Structural Diff Engine**: Performs semantic diffing across prompt text, model configs, tool definitions, and JSON schemas.
- **Variable Engine**: Extracts template variables (`extractVariables`) and safely interpolates runtime values (`renderBundle`) with prototype-pollution guards.
- **Provider-Agnostic Eval Runner**: Executes evaluation test cases and scores criteria against any provider implementing the minimal `AIProvider` interface.
- **Storage Adapter Contract**: Defines the unified `StorageAdapter` interface implemented by both local SQLite (CLI) and PostgreSQL (Cloud SaaS).

---

## Installation

```bash
pnpm add @gfp/core
```

---

## Core API

### 1. Bundle Validation & Schema

```typescript
import { validateBundle, PromptBundleSchema, type PromptBundle } from '@gfp/core';

const rawInput = {
  systemPrompt: "You are a concise code reviewer.",
  userTemplate: "Review this diff: {{diff}}",
  modelConfig: {
    provider: "groq",
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    maxTokens: 2048,
  },
};

const bundle: PromptBundle = validateBundle(rawInput);
```

### 2. Variable Extraction & Interpolation

```typescript
import { extractVariables, renderBundle } from '@gfp/core';

// Extract all {{variable}} placeholders
const variables = extractVariables(bundle);
// => ["diff"]

// Render template with runtime values
const rendered = renderBundle(bundle, { diff: "const x = 1;" });
console.log(rendered.userPrompt);
// => "Review this diff: const x = 1;"
```

### 3. Structural Diffing

```typescript
import { diffBundles } from '@gfp/core';

const diff = diffBundles(bundleV1, bundleV2);
console.log(diff.hasChanges);
console.log(diff.modelConfigDiff);
console.log(diff.systemPromptDiff);
```

### 4. Running Evaluations

```typescript
import { runEvaluations, type AIProvider, type TestCase } from '@gfp/core';

const provider: AIProvider = {
  async chat(messages, config) {
    // Call LLM provider of choice
    return "Output response";
  },
};

const results = await runEvaluations(bundle, testCases, provider);
```

---

## License

MIT © Karan Wakhare
