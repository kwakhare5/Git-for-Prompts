# Homepage Marketing & Interactive Sandbox Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul the homepage (`src/app/page.tsx`) to feature a top navigation bar swapping between a developer product tour/guide and a fully interactive, in-memory simulated SaaS sandbox/playground.

**Architecture:** Create a self-contained layout in `src/app/page.tsx` utilizing standard React state management (`useState`) to toggle views and hold ephemeral sandbox versions, editing states, and simulation logs.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS v4, Lucide React icons, Clerk ClerkProvider components.

---

### Task 1: Clean and Prepare Home Page Structure

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace home page with base tabbed layout**
  Replace the contents of `src/app/page.tsx` with a basic structure containing the Header Navigation, tab state toggling, and placeholders for Tab 1 (Tour) and Tab 2 (Sandbox). Include Lucide icons.
  
  ```tsx
  'use client';

  import { useState } from 'react';
  import Link from 'next/link';
  import { Show } from '@clerk/nextjs';
  import { 
    GitBranch, 
    FileText, 
    Play, 
    History, 
    Sparkles, 
    Flame, 
    Terminal, 
    BookOpen, 
    Check, 
    ArrowRight,
    Copy,
    Cpu,
    Shield
  } from 'lucide-react';

  export default function Home() {
    const [activeTab, setActiveTab] = useState<'tour' | 'sandbox'>('tour');

    return (
      <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-zinc-800">
        {/* Header */}
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md px-6 py-4">
          <div className="flex items-center gap-2.5">
            <GitBranch className="h-6 w-6 text-zinc-400" />
            <span className="font-bold text-lg tracking-tight">Git for Prompts</span>
          </div>

          <div className="flex items-center bg-zinc-900/80 border border-zinc-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('tour')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'tour'
                  ? 'bg-zinc-800 text-zinc-50 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Tour & Guide
            </button>
            <button
              onClick={() => setActiveTab('sandbox')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'sandbox'
                  ? 'bg-zinc-800 text-zinc-50 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Cpu className="h-4 w-4" />
              Interactive Sandbox
            </button>
          </div>

          <div className="flex items-center gap-4">
            <Show when="signed-in">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-zinc-50 text-zinc-950 hover:bg-zinc-200 transition-colors"
              >
                Go to Dashboard
              </Link>
            </Show>
            <Show when="signed-out">
              <Link
                href="/sign-in"
                className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-zinc-50 text-zinc-950 hover:bg-zinc-200 transition-colors shadow-lg shadow-zinc-50/5"
              >
                Get Started
              </Link>
            </Show>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 flex flex-col">
          {activeTab === 'tour' ? (
            <div className="max-w-6xl mx-auto px-6 py-16 w-full space-y-24">
              {/* Tour Tab Content Placeholder */}
              <div>Product Tour View</div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col p-6 max-w-7xl mx-auto w-full">
              {/* Sandbox Tab Content Placeholder */}
              <div>Interactive Sandbox View</div>
            </div>
          )}
        </main>
      </div>
    );
  }
  ```

- [ ] **Step 2: Verify build**
  Run: `npm run build`
  Expected: Builds without errors.

- [ ] **Step 3: Commit checkpoint**
  ```bash
  git add src/app/page.tsx
  git commit -m "feat: setup main tabbed skeleton on home page"
  ```

---

### Task 2: Implement Tab 1 (Product Tour & Guide)

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Write Tour Layout & Sub-sections**
  Replace the Tour placeholder in `src/app/page.tsx` with high-fidelity developer copy, features grid, use cases, and the code integration panel.
  
  Code replacement block:
  ```tsx
  {/* Hero */}
  <section className="text-center space-y-6 py-8">
    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-50 via-zinc-100 to-zinc-400 bg-clip-text text-transparent max-w-4xl mx-auto leading-tight">
      Treat your prompts like code.
    </h1>
    <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
      Version, test, A/B compare, and deploy AI prompt templates using a clean, developer-first Git workflow. No more prompt chaos in Notion or Google Docs.
    </p>
    <div className="flex items-center justify-center gap-4 pt-4">
      <button
        onClick={() => setActiveTab('sandbox')}
        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg bg-zinc-50 text-zinc-950 hover:bg-zinc-200 transition-all cursor-pointer shadow-lg hover:shadow-zinc-50/10"
      >
        Try Sandbox <ArrowRight className="h-4 w-4" />
      </button>
      <Link
        href="/sign-up"
        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg border border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:border-zinc-700 transition-all"
      >
        Sign Up Free
      </Link>
    </div>
  </section>

  {/* Pillars Grid */}
  <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-900/30 backdrop-blur-sm space-y-3">
      <div className="p-2 w-fit rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
        <History className="h-5 w-5" />
      </div>
      <h3 className="font-semibold text-zinc-100">Immutable Versioning</h3>
      <p className="text-sm text-zinc-500 leading-relaxed">
        Every save writes a permanent version snapshot. Roll back or compare against historical edits instantly.
      </p>
    </div>

    <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-900/30 backdrop-blur-sm space-y-3">
      <div className="p-2 w-fit rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
        <GitBranch className="h-5 w-5" />
      </div>
      <h3 className="font-semibold text-zinc-100">Monaco Diff Viewer</h3>
      <p className="text-sm text-zinc-500 leading-relaxed">
        Trace prompt updates side-by-side. Highlight deletions and additions using a code-inspired layout.
      </p>
    </div>

    <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-900/30 backdrop-blur-sm space-y-3">
      <div className="p-2 w-fit rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
        <Play className="h-5 w-5" />
      </div>
      <h3 className="font-semibold text-zinc-100">Dual-Provider Testing</h3>
      <p className="text-sm text-zinc-500 leading-relaxed">
        Execute test suites concurrently on Groq (Llama 3.3) with OpenRouter fallback. Verify responses in seconds.
      </p>
    </div>

    <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-900/30 backdrop-blur-sm space-y-3">
      <div className="p-2 w-fit rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
        <Sparkles className="h-5 w-5" />
      </div>
      <h3 className="font-semibold text-zinc-100">Prompt API Delivery</h3>
      <p className="text-sm text-zinc-500 leading-relaxed">
        Decouple prompt cycles from code deployments. Fetch prompt versions dynamically in your apps via public API.
      </p>
    </div>
  </section>

  {/* Use Cases */}
  <section className="border-t border-zinc-900 pt-16 space-y-12">
    <div className="text-center space-y-2">
      <span className="text-xs font-mono tracking-widest text-zinc-600 uppercase">Use Cases</span>
      <h2 className="text-3xl font-bold text-zinc-100">Why Developers Choose Git for Prompts</h2>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Flame className="h-5 w-5 text-red-500" />
          <h4 className="font-semibold text-zinc-200">Regression Testing</h4>
        </div>
        <p className="text-sm text-zinc-500 leading-relaxed">
          Ensure updates to prompts don't break existing features. Automatically grade LLM outputs against strict criteria before pushing prompts to live systems.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-emerald-500" />
          <h4 className="font-semibold text-zinc-200">System of Record & Audit Trails</h4>
        </div>
        <p className="text-sm text-zinc-500 leading-relaxed">
          Maintain a historical timeline of prompt changes. Know exactly who updated a prompt, when, and what commit message accompanied the revision.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Terminal className="h-5 w-5 text-sky-500" />
          <h4 className="font-semibold text-zinc-200">Decoupled Release Cycles</h4>
        </div>
        <p className="text-sm text-zinc-500 leading-relaxed">
          Stop rebuilding and redeploying your server code just to fix a spelling mistake or refine a system instruction. Fetch versions dynamically from our API.
        </p>
      </div>
    </div>
  </section>

  {/* Integration Guide Section */}
  <section className="border-t border-zinc-900 pt-16 pb-12 space-y-8">
    <div className="max-w-2xl space-y-3">
      <h3 className="text-2xl font-bold text-zinc-100">Integration: Fetching at Runtime</h3>
      <p className="text-sm text-zinc-500 leading-relaxed">
        Load the latest approved version of your prompt dynamically in your application using our simple HTTP endpoint.
      </p>
    </div>

    <div className="relative rounded-xl border border-zinc-900 bg-zinc-950 overflow-hidden font-mono text-sm max-w-3xl">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-900 bg-zinc-900/30">
        <span className="text-xs text-zinc-500">typescript - api_client.ts</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(`const response = await fetch("https://gitforprompts.com/api/v1/prompts/[prompt-id]/latest", {
  headers: {
    "Authorization": "Bearer " + process.env.GFP_API_KEY
  }
});
const { content } = await response.json();`);
          }}
          className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors p-1"
        >
          <Copy className="h-3 w-3" /> Copy
        </button>
      </div>
      <pre className="p-5 overflow-x-auto text-zinc-300 font-mono">
        <code>{`const response = await fetch("https://gitforprompts.com/api/v1/prompts/[prompt-id]/latest", {
  headers: {
    "Authorization": "Bearer " + process.env.GFP_API_KEY
  }
});

const { content } = await response.json();`}</code>
      </pre>
    </div>
  </section>
  ```

- [ ] **Step 2: Verify lint and compile**
  Run: `npm run build`
  Expected: Compiled successfully.

- [ ] **Step 3: Commit**
  ```bash
  git add src/app/page.tsx
  git commit -m "feat: complete tour & guide marketing content on homepage"
  ```

---

### Task 3: Implement Tab 2 (Interactive Sandbox Core State & UI Layout)

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Set up React states for the Sandbox**
  Inside the `Home` component at `src/app/page.tsx`, define state variables for sandbox versions, text editor content, commit inputs, sub-tab selection, test logs, outputs, and results. Include the default mock values.

  ```tsx
  // Put this at the beginning of the Home component:
  const [activeSubTab, setActiveSubTab] = useState<'edit' | 'diff' | 'tests'>('edit');
  
  const [versions, setVersions] = useState<Array<{
    versionNumber: number;
    content: string;
    commitMessage: string;
    createdAt: string;
  }>>([
    {
      versionNumber: 1,
      content: `You answer questions about customer returns.`,
      commitMessage: 'Initial draft',
      createdAt: '1 hour ago'
    },
    {
      versionNumber: 2,
      content: `You are a polite returns department agent. If the customer received a broken item, offer a full refund. Sign off with "Customer Support Team".`,
      commitMessage: 'Clarified returns policy',
      createdAt: '10 minutes ago'
    }
  ]);

  const [activeVersionNumber, setActiveVersionNumber] = useState(2);
  const [editorContent, setEditorContent] = useState(
    `You are a polite returns department agent. If the customer received a broken item, offer a full refund. Sign off with "Customer Support Team".`
  );
  const [commitInput, setCommitInput] = useState('');
  
  // Test case details
  const testCase = {
    name: 'Returns Refund Request',
    input_text: 'I bought shoes yesterday and they arrived with a cracked sole. Can I get my money back?',
    expectedCriteria: 'Must offer a full refund and sign off with "Customer Support Team".'
  };

  const [testResult, setTestResult] = useState<'idle' | 'running' | 'passed' | 'failed'>('idle');
  const [testOutput, setTestOutput] = useState('');
  const [testLogs, setTestLogs] = useState<string[]>([]);
  ```

- [ ] **Step 2: Add sidebar rendering**
  Implement the Left Sidebar layout inside the sandbox view, displaying the active simulated prompt (`customer-support-returns`) and rendering the version list mapping click events.

  ```tsx
  {/* Replace Sandbox Tab Content Placeholder with: */}
  <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 border border-zinc-900 rounded-xl overflow-hidden bg-zinc-950/20 backdrop-blur-sm min-h-[500px]">
    {/* Sandbox Sidebar */}
    <div className="border-r border-zinc-900 bg-zinc-900/10 p-5 space-y-6">
      <div>
        <h3 className="font-semibold text-sm text-zinc-200">customer-support-returns</h3>
        <p className="text-xs text-zinc-500 mt-1">Simulated sandbox playground</p>
      </div>

      <div className="space-y-3">
        <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase">Version History</span>
        <div className="space-y-1.5">
          {versions.slice().reverse().map((v) => (
            <button
              key={v.versionNumber}
              onClick={() => {
                setActiveVersionNumber(v.versionNumber);
                setEditorContent(v.content);
              }}
              className={`w-full flex flex-col items-start text-left p-3 rounded-lg border transition-all cursor-pointer ${
                activeVersionNumber === v.versionNumber
                  ? 'bg-zinc-900/80 border-zinc-700 text-zinc-100 shadow-sm'
                  : 'bg-zinc-900/20 border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-[10px] font-semibold text-zinc-400">v{v.versionNumber}</span>
                <span className="text-[10px] text-zinc-500">{v.createdAt}</span>
              </div>
              <p className="text-xs truncate w-full mt-1.5 text-zinc-400">
                {v.commitMessage}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>

    {/* Sandbox Workspace Area */}
    <div className="lg:col-span-3 flex flex-col">
      {/* Tab bar */}
      <div className="flex items-center justify-between border-b border-zinc-900 bg-zinc-900/10 px-5">
        <div className="flex">
          {(['edit', 'diff', 'tests'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeSubTab === tab
                  ? 'border-zinc-50 text-zinc-100'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Workspace Content Panel */}
      <div className="flex-1 p-5 flex flex-col">
        {/* Sub-tab content will go here */}
      </div>
    </div>
  </div>
  ```

- [ ] **Step 3: Verify build**
  Run: `npm run build`
  Expected: Compiled successfully.

- [ ] **Step 4: Commit**
  ```bash
  git add src/app/page.tsx
  git commit -m "feat: layout sandbox sidebar and workspace tabs skeleton"
  ```

---

### Task 4: Implement Workspace Edit & Diff Tabs

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Code the Edit Tab workspace**
  Implement the textarea editor and the mock commit form. Make sure prompt text has the non-negotiable `font-mono` class.
  
  ```tsx
  {/* Inside workspace content panel, render based on activeSubTab: */}
  {activeSubTab === 'edit' && (
    <div className="flex-1 flex flex-col space-y-4">
      <div className="flex-1 flex flex-col border border-zinc-900 rounded-lg bg-zinc-950 overflow-hidden min-h-[300px]">
        <div className="px-4 py-2 border-b border-zinc-900 bg-zinc-900/30 flex items-center justify-between text-xs text-zinc-500 font-mono">
          <span>prompt_template.txt</span>
          <span>v{activeVersionNumber}</span>
        </div>
        <textarea
          value={editorContent}
          onChange={(e) => setEditorContent(e.target.value)}
          className="flex-1 p-4 bg-transparent outline-none resize-none font-mono text-sm leading-relaxed text-zinc-100"
          placeholder="Write your prompt system instruction..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          type="text"
          value={commitInput}
          onChange={(e) => setCommitInput(e.target.value)}
          placeholder="Commit message (e.g. Adjust refund instructions)"
          className="md:col-span-3 px-4 py-2 text-sm rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
        />
        <button
          onClick={() => {
            if (!editorContent.trim()) return;
            const nextVersion = versions.length + 1;
            const msg = commitInput.trim() || `Update version ${nextVersion}`;
            
            const newVer = {
              versionNumber: nextVersion,
              content: editorContent,
              commitMessage: msg,
              createdAt: 'Just now'
            };
            
            setVersions([...versions, newVer]);
            setActiveVersionNumber(nextVersion);
            setCommitInput('');
          }}
          className="px-4 py-2 text-sm font-semibold rounded-lg bg-zinc-50 text-zinc-950 hover:bg-zinc-200 transition-colors cursor-pointer"
        >
          Commit Save
        </button>
      </div>
    </div>
  )}
  ```

- [ ] **Step 2: Code the Diff Tab workspace**
  Implement the line-by-line diff generator comparing `v1` content and `editorContent`.
  
  ```tsx
  {activeSubTab === 'diff' && (() => {
    const v1Content = versions[0].content;
    const originalLines = v1Content.split('\n');
    const modifiedLines = editorContent.split('\n');

    return (
      <div className="flex-1 flex flex-col space-y-4">
        <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
          <span className="px-2 py-0.5 rounded bg-red-950/30 text-red-400 border border-red-900/50">v1 (Original)</span>
          <span className="text-zinc-600">→</span>
          <span className="px-2 py-0.5 rounded bg-emerald-950/30 text-emerald-400 border border-emerald-900/50">v{activeVersionNumber} (Active Sandbox)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-zinc-900 rounded-lg overflow-hidden bg-zinc-950 min-h-[300px]">
          {/* Original View */}
          <div className="p-4 border-r border-zinc-900 bg-zinc-900/5 overflow-y-auto max-h-[350px]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-2">Original</span>
            <pre className="font-mono text-xs leading-relaxed text-zinc-400 space-y-1">
              {originalLines.map((line, idx) => (
                <div 
                  key={idx} 
                  className={`px-1.5 py-0.5 rounded ${
                    editorContent.includes(line) ? '' : 'bg-red-950/30 text-red-300 border border-red-900/30 font-semibold'
                  }`}
                >
                  {editorContent.includes(line) ? ' ' : '- '} {line}
                </div>
              ))}
            </pre>
          </div>

          {/* Sandbox View */}
          <div className="p-4 overflow-y-auto max-h-[350px]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-2">Sandbox (Edited)</span>
            <pre className="font-mono text-xs leading-relaxed text-zinc-400 space-y-1">
              {modifiedLines.map((line, idx) => (
                <div 
                  key={idx} 
                  className={`px-1.5 py-0.5 rounded ${
                    v1Content.includes(line) ? '' : 'bg-emerald-950/30 text-emerald-300 border border-emerald-900/30 font-semibold'
                  }`}
                >
                  {v1Content.includes(line) ? ' ' : '+ '} {line}
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>
    );
  })()}
  ```

- [ ] **Step 3: Verify build**
  Run: `npm run build`
  Expected: Compiled successfully.

- [ ] **Step 4: Commit**
  ```bash
  git add src/app/page.tsx
  git commit -m "feat: implement sandbox edit editor and comparative side-by-side diff renderer"
  ```

---

### Task 5: Implement Test Runner & Simulation Logs

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Code the test runner view and logs mechanism**
  Add the Tests sub-tab content, the mock test card, the simulated execution logs logic, and output verification.

  ```tsx
  {activeSubTab === 'tests' && (
    <div className="flex-1 flex flex-col space-y-6">
      {/* Test Case Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-zinc-200">Suite Assertions</h4>
          <p className="text-xs text-zinc-500 mt-1">Run prompts against test criteria using the simulated engine.</p>
        </div>
        <button
          onClick={async () => {
            setTestResult('running');
            setTestLogs([]);
            setTestOutput('');

            const appendLog = (log: string, delay: number) => {
              return new Promise<void>((resolve) => {
                setTimeout(() => {
                  setTestLogs((prev) => [...prev, log]);
                  resolve();
                }, delay);
              });
            };

            await appendLog('⏱️ [17:55:00] Initializing test pipeline...', 0);
            await appendLog('🤖 [17:55:00] Querying simulated Groq provider: llama-3.3-70b-versatile...', 400);
            await appendLog('✅ [17:55:01] Response received. Starting natural language validation assertions...', 500);

            // Dynamic Check
            const hasRefund = editorContent.toLowerCase().includes('refund');
            const hasTeam = editorContent.toLowerCase().includes('customer support team');

            if (hasRefund) {
              await appendLog('✔️ [17:55:01] Assertion "Must offer a full refund" -> PASSED', 400);
            } else {
              await appendLog('❌ [17:55:01] Assertion "Must offer a full refund" -> FAILED', 400);
            }

            if (hasTeam) {
              await appendLog('✔️ [17:55:02] Assertion "Sign off with Customer Support Team" -> PASSED', 400);
            } else {
              await appendLog('❌ [17:55:02] Assertion "Sign off with Customer Support Team" -> FAILED', 400);
            }

            setTimeout(() => {
              if (hasRefund && hasTeam) {
                setTestOutput(
                  `Hi Karan,\n\nI am so sorry to hear that your shoes arrived yesterday with a cracked sole. That is certainly not up to our department standards. Since the item is damaged, we will issue a full refund to your original payment method immediately. Let us know if you need anything else!\n\nBest regards,\nCustomer Support Team`
                );
                setTestResult('passed');
                setTestLogs((prev) => [...prev, '🎉 [17:55:02] Overall evaluation score: 100/100 (PASSED)']);
              } else {
                setTestOutput(
                  `I received your message regarding cracked soles on shoes. Please return the package using a returns label. Let us know if you have questions.`
                );
                setTestResult('failed');
                setTestLogs((prev) => [...prev, '⚠️ [17:55:02] Overall evaluation score: 50/100 (FAILED)']);
              }
            }, 300);
          }}
          disabled={testResult === 'running'}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg shadow-md transition-all cursor-pointer ${
            testResult === 'running'
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-800'
              : 'bg-zinc-50 text-zinc-950 hover:bg-zinc-200'
          }`}
        >
          <Play className="h-4 w-4 fill-current" />
          {testResult === 'running' ? 'Running Tests...' : 'Run Test Suite'}
        </button>
      </div>

      {/* Test Card & Output Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Test card */}
        <div className="md:col-span-1 border border-zinc-900 bg-zinc-900/10 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase">Test Case</span>
            {testResult === 'passed' && (
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider rounded border border-emerald-900/50 bg-emerald-950/30 text-emerald-400">PASSED</span>
            )}
            {testResult === 'failed' && (
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider rounded border border-red-900/50 bg-red-950/30 text-red-400">FAILED</span>
            )}
            {testResult === 'running' && (
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider rounded border border-sky-900/50 bg-sky-950/30 text-sky-400 animate-pulse">RUNNING</span>
            )}
            {testResult === 'idle' && (
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider rounded border border-zinc-800 bg-zinc-900 text-zinc-400">UNTESTED</span>
            )}
          </div>

          <div>
            <h5 className="font-semibold text-sm text-zinc-200">{testCase.name}</h5>
          </div>

          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 block uppercase">Input Variables</span>
              <p className="text-xs text-zinc-400 font-mono bg-zinc-900/50 p-2.5 rounded border border-zinc-900">
                {testCase.input_text}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 block uppercase">Assertions</span>
              <p className="text-xs text-zinc-400 font-mono bg-zinc-900/50 p-2.5 rounded border border-zinc-900">
                {testCase.expectedCriteria}
              </p>
            </div>
          </div>
        </div>

        {/* Output & logs */}
        <div className="md:col-span-2 flex flex-col space-y-4">
          {/* Logs */}
          {testLogs.length > 0 && (
            <div className="border border-zinc-900 bg-zinc-950 rounded-lg p-4 font-mono text-xs text-zinc-400 space-y-1.5 max-h-[140px] overflow-y-auto">
              {testLogs.map((log, index) => (
                <div key={index} className="leading-relaxed">{log}</div>
              ))}
            </div>
          )}

          {/* Actual output */}
          {testOutput && (
            <div className="flex-1 border border-zinc-900 bg-zinc-950 rounded-lg overflow-hidden flex flex-col">
              <div className="px-4 py-2 border-b border-zinc-900 bg-zinc-900/30 text-xs text-zinc-500 font-mono">
                actual_response.txt
              </div>
              <pre className="p-4 font-mono text-xs text-zinc-300 whitespace-pre-wrap flex-1 leading-relaxed">
                {testOutput}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )}
  ```

- [ ] **Step 2: Verify lint and compile**
  Run: `npm run build`
  Expected: Compiled successfully.

- [ ] **Step 3: Commit**
  ```bash
  git add src/app/page.tsx
  git commit -m "feat: complete interactive sandbox test runner simulation with live terminal log output"
  ```
