# Specification — Homepage Marketing & Interactive Sandbox

**Date**: 2026-06-12  
**Status**: Draft  
**Target File**: `src/app/page.tsx`

---

## 1. Overview
This specification details the overhaul of the root page (`/`) from a basic landing page to a dual-tab dashboard representing **Git for Prompts**. The home route will feature two views:
1. **Tour (Marketing & Guide)**: Value propositions, core features, common use cases, and code integration snippets.
2. **Interactive Sandbox (Try It)**: An ephemeral, fully-functional client-side simulation of the prompt editor, history versioning, comparative diffs, and concurrent test runs.

---

## 4. Navigation Header
The page header spans the top of the root route:
- **Logo**: `Git for Prompts` using high-contrast bold fonts and a branching icon.
- **Tab Swapper**: A pill-toggle button group:
  - **Tour** (Default)
  - **Sandbox (Try It)**
- **Auth CTAs**:
  - `Sign In` (Redirects to `/sign-in` via Clerk)
  - `Get Started` (Redirects to `/sign-up` via Clerk, styled as a high-contrast button)

---

## 5. Tab 1: Product Tour & Guide Layout
When the `activeTab` is `"tour"`, we display the following vertical sections:

### 5.1 Hero Section
- **Headline**: "Treat your prompts like code." (Gradient colored, high-impact font).
- **Subheadline**: "Version, test, and deploy AI prompts with a developer-first git workflow. No more prompt chaos in Notion or Google Docs."
- **CTA Actions**: 
  - "Try the Sandbox" (Switches state to `sandbox` tab).
  - "Get Started for Free" (Redirects to sign-up).

### 5.2 Key Features Grid
Cards containing visual icons and concise text:
- **Immutable Versioning**: Explain that every prompt revision is logged with a author details and a commit message.
- **Visual Diffing**: Show that prompts can be compared side-by-side to track alterations.
- **Dual-Provider Test Runner**: Highlight the Groq primary + OpenRouter fallback execution running 10 parallel test runs in seconds.
- **Public API Integration**: Discuss loading prompts at runtime with secure API keys.

### 5.3 SaaS Use Cases
Detailed developer scenarios:
- **Prompt Regression Testing**: Run automated test cases to prevent updates from breaking existing outputs.
- **Prompt-as-Service**: Fetch prompt templates at runtime via the API, allowing updates without redeploying main code.
- **Auditable Prompts**: Complete history of who modified which instructions and why.

### 5.4 Integration Guide
A beautiful developer terminal layout showing how to query the public API:
```javascript
// Example: Fetching latest active version of a prompt
const response = await fetch("https://gitforprompts.com/api/v1/prompts/[prompt-id]/latest", {
  headers: {
    "Authorization": `Bearer ${process.env.GFP_API_KEY}`
  }
});
const { content } = await response.json();
```
*(Includes a copy-to-clipboard button)*.

---

## 6. Tab 2: Interactive Sandbox UI
When the `activeTab` is `"sandbox"`, we render a split pane dashboard representing a project workspace.

### 6.1 Ephemeral State
The sandbox stores its state in React `useState`:
- **Versions**:
  - `v1`: `You answer questions about customer returns.`
  - `v2`: `You are a polite returns department agent. If the customer received a broken item, offer a full refund. Sign off with "Customer Support Team".`
- **Active Edited Content**: Textarea state initialized to `v2` content.
- **Current Active Version**: Defaults to `v2`.
- **Test Case**:
  - `inputText`: `I bought shoes yesterday and they arrived with a cracked sole. Can I get my money back?`
  - `expectedCriteria`: `Must offer a full refund and sign off with "Customer Support Team".`

### 6.2 Workspace Layout
- **Left Column: Version Sidebar**:
  - Lists the versions (`v2`, `v1`).
  - Allows selecting a version to view.
  - A subtle highlight is placed on the current version.
- **Right Column: Workspace Area**:
  - Sub-tabs: `Edit`, `Diff`, `Tests`.

#### Edit Sub-Tab
- Monospace textarea containing active prompt text.
- Commit message input field (placeholder: "Clarify returns instructions").
- **Commit** button: Pushes a new version (e.g. `v3`) to the local list, clears the commit message, and alerts the user of successful "commit".

#### Diff Sub-Tab
- Renders original `v1` vs the current edited state.
- Red highlighted deleted lines and emerald highlighted added lines.
- Evaluated inline using a simple line-by-line comparison algorithm.

#### Tests Sub-Tab
- Displays the mock test card.
- **Run Tests** button:
  - Triggers a 2-second simulated load.
  - Displays scrolling terminal logs showing Groq evaluation steps.
  - Generates a mock AI output satisfying the returns prompt criteria, yielding a **PASSED** badge.
  - If the user edits the prompt in the Edit tab to remove the refund policy and commits it, running tests will fail and output a **FAILED** badge.

---

## 7. Success Criteria & Verification
- **Compilation**: High-fidelity compilation with Next.js 15 and Tailwind v4.
- **Transitions**: Toggle between Tour and Sandbox tabs must be instant and state-preserving.
- **Simulations**: Editing the prompt, committing, viewing diffs, and running tests must work correctly and update the in-memory state.
