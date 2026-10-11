'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import {
  CopyIcon,
  CheckIcon,
  PanelElevated,
  BadgeVersion,
  ButtonPrimary,
} from '@/components/website/ui-tokens';
import { DEMO_PROMPTS } from './types';

interface HeroDetailViewProps {
  onBackToList?: () => void;
}

export function HeroDetailView({ onBackToList }: HeroDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'editor' | 'diff' | 'evals'>('editor');
  const [copiedKey, setCopiedKey] = useState(false);
  const [tempValue, setTempValue] = useState(0.2);
  const [selectedPromptId, setSelectedPromptId] = useState<string>('demo-1');
  const [demoVersion, setDemoVersion] = useState(3);
  const [isSaved, setIsSaved] = useState(false);

  const activePromptName = DEMO_PROMPTS.find((p) => p.id === selectedPromptId)?.name ?? 'security-audit-v2';
  const activePromptDesc = DEMO_PROMPTS.find((p) => p.id === selectedPromptId)?.description ?? 'Version-controlled prompt bundle.';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px] font-sans">
      {/* Left Column: Prompt Selection & Workspace Tools */}
      <div className="lg:col-span-3 bg-bg-card border-r border-zinc-800/90 p-4 space-y-4">
        <div>
          <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span>Prompt Repositories ({DEMO_PROMPTS.length})</span>
            {onBackToList && (
              <button
                type="button"
                onClick={onBackToList}
                className="text-zinc-400 hover:text-zinc-200 text-[10px] cursor-pointer"
              >
                ← All Prompts
              </button>
            )}
          </div>

          <div className="space-y-1.5 font-mono">
            {DEMO_PROMPTS.map((dp) => (
              <div
                key={dp.id}
                onClick={() => setSelectedPromptId(dp.id)}
                className={`p-2.5 rounded-xl font-medium flex items-center justify-between border cursor-pointer transition-all ${
                  selectedPromptId === dp.id
                    ? 'bg-bg-panel text-white border-zinc-800 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-bg-panel/60 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${selectedPromptId === dp.id ? 'bg-emerald-300' : 'bg-zinc-600'}`}></span>
                  <span className="font-mono text-xs font-bold">{dp.name}</span>
                </div>
                <BadgeVersion>{`v${dp.versionCount}`}</BadgeVersion>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-800/90 space-y-2 font-mono text-xs text-zinc-400">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
            Workspace Tools
          </div>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer w-full text-left transition-colors ${
                activeTab === 'editor'
                  ? 'text-zinc-100 bg-zinc-100/10 border border-zinc-800 font-bold'
                  : 'hover:text-zinc-200 text-zinc-400 hover:bg-bg-panel'
              }`}
            >
              <span>Bundle Editor</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('diff')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer w-full text-left transition-colors ${
                activeTab === 'diff'
                  ? 'text-zinc-100 bg-zinc-100/10 border border-zinc-800 font-bold'
                  : 'hover:text-zinc-200 text-zinc-400 hover:bg-bg-panel'
              }`}
            >
              <span>Commit History</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('evals')}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer w-full text-left transition-colors ${
                activeTab === 'evals'
                  ? 'text-zinc-100 bg-zinc-100/10 border border-zinc-800 font-bold'
                  : 'hover:text-zinc-200 text-zinc-400 hover:bg-bg-panel'
              }`}
            >
              <span>Test Suite &amp; Evals</span>
            </button>
            <button
              type="button"
              onClick={() => toast.success('API key credentials are generated with SHA-256 hashes.')}
              className="flex items-center gap-2 hover:text-zinc-200 px-3 py-2 rounded-xl cursor-pointer w-full text-left text-zinc-400 hover:bg-bg-panel transition-colors"
            >
              <span>API Key Credentials</span>
            </button>
          </div>
        </div>
      </div>

      {/* Center Column: Active Tool Workspace */}
      <div className="lg:col-span-6 p-6 space-y-5 bg-bg-page">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/90">
          <div>
            <h3 className="text-lg font-bold text-zinc-100 font-mono flex items-center gap-2.5">
              {activePromptName}
              <BadgeVersion>v{demoVersion} snapshot</BadgeVersion>
            </h3>
            <p className="text-xs text-zinc-400 mt-1 font-sans leading-relaxed">
              {activePromptDesc}
            </p>
          </div>

          <ButtonPrimary
            onClick={() => {
              setDemoVersion((v) => v + 1);
              setIsSaved(true);
              toast.success(`✓ Saved snapshot v${demoVersion + 1} to local SQLite database with commit: 'Updated prompt variables'`);
              setTimeout(() => setIsSaved(false), 2200);
            }}
          >
            {isSaved ? `✓ Saved v${demoVersion}` : '+ Save Version'}
          </ButtonPrimary>
        </div>

        <div className="flex items-center gap-6 border-b border-zinc-800/90 text-xs font-mono pb-2.5">
          <button
            onClick={() => setActiveTab('editor')}
            className={`pb-2.5 -mb-2.5 font-bold cursor-pointer transition-colors ${activeTab === 'editor' ? 'text-zinc-100 border-b-2 border-zinc-100' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            Bundle Editor
          </button>
          <button
            onClick={() => setActiveTab('diff')}
            className={`pb-2.5 -mb-2.5 font-bold cursor-pointer transition-colors ${activeTab === 'diff' ? 'text-zinc-100 border-b-2 border-zinc-100' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            Diff Viewer (v2 → v3)
          </button>
          <button
            onClick={() => setActiveTab('evals')}
            className={`pb-2.5 -mb-2.5 font-bold cursor-pointer transition-colors ${activeTab === 'evals' ? 'text-zinc-100 border-b-2 border-zinc-100' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            Local Evals (100% pass)
          </button>
        </div>

        {activeTab === 'editor' && (
          <div className="space-y-4 font-mono">
            <div>
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1.5">
                System Prompt
              </label>
              <textarea
                readOnly
                rows={4}
                defaultValue="You are an expert senior code reviewer. Analyze the code snippet for security bugs, performance bottlenecks, and style flaws. Return valid JSON adhering strictly to the schema."
                className="w-full bg-bg-card border border-zinc-800 rounded-xl p-3.5 text-zinc-200 text-xs leading-relaxed focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1.5 flex items-center justify-between">
                <span>User Template (Extracted Variables)</span>
                <span className="text-[9px] text-blue-300 font-mono">Click variable tag to copy</span>
              </label>
              <div className="bg-bg-card border border-zinc-800 rounded-xl p-3.5 text-zinc-200 text-xs leading-relaxed">
                <p className="text-zinc-400">Review the following code submission:</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => navigator.clipboard.writeText("{{codeSnippet}}")}
                    className="text-blue-300 font-bold bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 tab-interactive"
                    title="Click to copy {{codeSnippet}}"
                  >
                    <span>{"{{codeSnippet}}"}</span>
                    <CopyIcon className="w-3 h-3 text-blue-400" />
                  </button>

                  <button
                    onClick={() => navigator.clipboard.writeText("{{language}}")}
                    className="text-blue-300 font-bold bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 tab-interactive"
                    title="Click to copy {{language}}"
                  >
                    <span>{"{{language}}"}</span>
                    <CopyIcon className="w-3 h-3 text-blue-400" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-bg-card rounded-xl border border-zinc-800 text-xs grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-zinc-500 text-[10px] block uppercase tracking-wider mb-1 font-mono">Provider</span>
                <div className="relative">
                  <select className="appearance-none bg-bg-page border border-zinc-800 rounded-lg pl-2 pr-7 py-1 text-zinc-100 font-mono text-xs w-full outline-none cursor-pointer [color-scheme:dark]">
                    <option value="groq">groq</option>
                    <option value="openrouter">openrouter</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400 pointer-events-none" strokeWidth={1.5} />
                </div>
              </div>
              <div>
                <span className="text-zinc-500 text-[10px] block uppercase tracking-wider mb-1 font-mono">Model</span>
                <div className="relative">
                  <select className="appearance-none bg-bg-page border border-zinc-800 rounded-lg pl-2 pr-7 py-1 text-blue-300 font-bold font-mono text-xs w-full outline-none cursor-pointer [color-scheme:dark]">
                    <option value="llama-3.3-70b-versatile">llama-3.3-70b</option>
                    <option value="mixtral-8x7b-32768">mixtral-8x7b</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400 pointer-events-none" strokeWidth={1.5} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1 font-mono text-[10px]">
                  <span className="text-zinc-500 uppercase tracking-wider">Temp</span>
                  <span className="text-emerald-300 font-bold">{tempValue}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={tempValue}
                  onChange={(e) => setTempValue(parseFloat(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>
              <div>
                <span className="text-zinc-500 text-[10px] block uppercase tracking-wider mb-1 font-mono">Max Tokens</span>
                <span className="text-zinc-100 font-bold font-mono block pt-0.5">2048</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'diff' && (
          <div className="space-y-3 font-mono">
            <div className="text-xs text-zinc-400 flex items-center justify-between">
              <span>Comparing Version 2 → Version 3</span>
              <span className="text-emerald-300 font-bold">+12 insertions, -4 deletions</span>
            </div>

            <div className="p-4 bg-bg-card rounded-xl border border-zinc-800 text-xs leading-relaxed overflow-x-auto space-y-1.5">
              <div className="text-rose-300 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                - temperature: 0.7
              </div>
              <div className="text-emerald-300 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                + temperature: 0.2
              </div>
              <div className="text-rose-300 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                - responseFormat: null
              </div>
              <div className="text-emerald-300 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                + responseFormat: &#123; type: &quot;json_object&quot;, schema: ZodSchema &#125;
              </div>
            </div>
          </div>
        )}

        {activeTab === 'evals' && (
          <div className="space-y-3 font-mono">
            <div className="p-4 bg-bg-card rounded-xl border border-zinc-800 text-xs space-y-3">
              <div className="flex items-center justify-between text-emerald-300 font-bold">
                <span>✓ test-case-security-pass</span>
                <span className="bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded">100% match</span>
              </div>
              <div className="flex items-center justify-between text-emerald-300 font-bold">
                <span>✓ test-case-syntax-check</span>
                <span className="bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded">100% match</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Snapshots & Bearer Key */}
      <div className="lg:col-span-3 bg-bg-card border-l border-zinc-800/90 p-4 space-y-5">
        <div>
          <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider mb-3">
            Commit Snapshots (Immutable)
          </div>
          <div className="space-y-2 font-mono">
            <div className="p-2.5 rounded-xl bg-bg-panel border border-blue-500/40 text-zinc-100 text-xs shadow-xs">
              <div className="flex justify-between font-bold">
                <span className="text-blue-300">Version 3</span>
                <span className="text-[10px] text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded">Current</span>
              </div>
              <p className="text-[10px] text-zinc-400 mt-1 font-sans">Added Zod JSON response format</p>
            </div>

            <div className="p-2.5 rounded-xl bg-bg-page border border-zinc-800 text-zinc-400 text-xs">
              <div className="flex justify-between font-bold text-zinc-300">
                <span>Version 2</span>
                <span className="text-[10px] text-zinc-500">2 hrs ago</span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-1 font-sans">Lowered temperature to 0.2</p>
            </div>

            <div className="p-2.5 rounded-xl bg-bg-page border border-zinc-800 text-zinc-400 text-xs">
              <div className="flex justify-between font-bold text-zinc-300">
                <span>Version 1</span>
                <span className="text-[10px] text-zinc-500">Yesterday</span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-1 font-sans">Initial prompt repository creation</p>
            </div>
          </div>
        </div>

        <PanelElevated className="space-y-2 font-mono">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
            Deploy Bearer Key
          </span>
          <div className="p-2.5 bg-bg-page rounded-xl border border-zinc-800 text-[11px] text-zinc-300 flex items-center justify-between">
            <span className="font-bold text-zinc-200">gfp_live_9f8a...</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText("gfp_live_9f8a2b3c4d5e");
                setCopiedKey(true);
                setTimeout(() => setCopiedKey(false), 2000);
              }}
              className="text-zinc-400 hover:text-white cursor-pointer"
            >
              {copiedKey ? <CheckIcon className="w-3.5 h-3.5 text-emerald-300" /> : <CopyIcon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </PanelElevated>
      </div>
    </div>
  );
}
