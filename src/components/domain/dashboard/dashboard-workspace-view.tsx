'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  CopyIcon,
  CheckIcon,
  TerminalIcon,
  CardDark,
  PanelElevated,
  BadgeVersion,
  ButtonPrimary,
} from '@/components/website/ui-tokens';

interface PromptWithStats {
  id: string;
  name: string;
  description: string | null;
  versionCount: number;
  testsPassed: number;
  testsTotal: number;
  isPublic: boolean;
  updatedAt?: Date | string;
}

interface PromptRepositoriesListProps {
  prompts: PromptWithStats[];
}

export function PromptRepositoriesList({ prompts }: PromptRepositoriesListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'public' | 'private'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const filteredPrompts = useMemo(() => {
    return prompts.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (visibilityFilter === 'public') return p.isPublic;
      if (visibilityFilter === 'private') return !p.isPublic;
      return true;
    });
  }, [prompts, searchQuery, visibilityFilter]);

  const publicCount = useMemo(() => prompts.filter((p) => p.isPublic).length, [prompts]);
  const privateCount = useMemo(() => prompts.filter((p) => !p.isPublic).length, [prompts]);

  return (
    <div className="space-y-4 font-sans">
      {/* Search, Filter, and View Mode Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-[#161619] border border-zinc-800/90 rounded-2xl shadow-xl">
        {/* Search input */}
        <div className="relative flex-1 font-mono">
          <input
            type="text"
            placeholder="Search prompt repositories by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121214] border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-zinc-500 hover:text-zinc-300 font-mono cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Visibility filters & View toggle */}
        <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
          <div className="flex items-center bg-[#121214] p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setVisibilityFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                visibilityFilter === 'all'
                  ? 'bg-[#202024] text-zinc-100 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All ({prompts.length})
            </button>
            <button
              onClick={() => setVisibilityFilter('public')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                visibilityFilter === 'public'
                  ? 'bg-emerald-500/20 text-emerald-300 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Public ({publicCount})
            </button>
            <button
              onClick={() => setVisibilityFilter('private')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                visibilityFilter === 'private'
                  ? 'bg-[#202024] text-zinc-200 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Private ({privateCount})
            </button>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center bg-[#121214] p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setViewMode('table')}
              title="Table View"
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-[#202024] text-zinc-100 shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#202024] text-zinc-100 shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Grid
            </button>
          </div>
        </div>
      </div>

      {/* Filtered list content */}
      {filteredPrompts.length === 0 ? (
        <div className="p-8 text-center border border-zinc-800/90 rounded-2xl bg-[#161619] text-zinc-400 font-mono text-xs shadow-xl">
          No prompt repositories found matching your filter criteria.
        </div>
      ) : viewMode === 'table' ? (
        <div className="border border-zinc-800/90 rounded-2xl bg-[#161619] overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1D1D22] border-b border-zinc-800/90 text-zinc-400 font-mono font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4 pl-5">Prompt Name</th>
                <th className="p-4">Description</th>
                <th className="p-4">Version</th>
                <th className="p-4">Test Suite</th>
                <th className="p-4">Visibility</th>
                <th className="p-4 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-sans">
              {filteredPrompts.map((prompt) => (
                <tr key={prompt.id} className="hover:bg-[#1D1D22]/60 transition-colors">
                  <td className="p-4 pl-5 font-semibold text-zinc-100 font-mono">
                    <Link href={`/dashboard/prompts/${prompt.id}`} className="hover:text-blue-300 transition-colors">
                      {prompt.name}
                    </Link>
                  </td>
                  <td className="p-4 text-zinc-400 max-w-xs truncate text-xs">
                    {prompt.description || '—'}
                  </td>
                  <td className="p-4 font-mono">
                    <span className="bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded text-[11px] font-bold">
                      v{prompt.versionCount}
                    </span>
                  </td>
                  <td className="p-4 font-mono">
                    {prompt.testsTotal > 0 ? (
                      <span className="text-emerald-300 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-[11px]">
                        {prompt.testsPassed}/{prompt.testsTotal} ({Math.round((prompt.testsPassed / prompt.testsTotal) * 100)}%)
                      </span>
                    ) : (
                      <span className="text-zinc-500 text-[11px]">No evals</span>
                    )}
                  </td>
                  <td className="p-4">
                    {prompt.isPublic ? (
                      <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
                        Public
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono bg-[#202024] text-zinc-400 border border-zinc-700/60 px-2 py-0.5 rounded">
                        Private
                      </span>
                    )}
                  </td>
                  <td className="p-4 pr-5 text-right space-x-3 font-mono text-[11px]">
                    <Link
                      href={`/dashboard/prompts/${prompt.id}`}
                      className="text-blue-300 hover:text-blue-200 font-bold transition-colors"
                    >
                      Studio
                    </Link>
                    <Link
                      href={`/dashboard/prompts/${prompt.id}/edit`}
                      className="text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/dashboard/prompts/${prompt.id}/diff`}
                      className="text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      Diff
                    </Link>
                    <Link
                      href={`/dashboard/prompts/${prompt.id}/tests`}
                      className="text-emerald-300 hover:text-emerald-200 transition-colors"
                    >
                      Evals
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-sans">
          {filteredPrompts.map((prompt) => (
            <div
              key={prompt.id}
              className="bg-[#161619] border border-zinc-800/90 p-5 rounded-2xl shadow-xl flex flex-col justify-between space-y-4 hover:border-zinc-700/80 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 font-mono">
                  <Link
                    href={`/dashboard/prompts/${prompt.id}`}
                    className="text-sm font-bold text-zinc-100 hover:text-blue-300 transition-colors truncate"
                  >
                    {prompt.name}
                  </Link>
                  <span className="bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded text-[11px] font-bold shrink-0">
                    v{prompt.versionCount}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-sans">
                  {prompt.description || 'No description provided.'}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  {prompt.isPublic ? (
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
                      Public
                    </span>
                  ) : (
                    <span className="text-[10px] bg-[#202024] text-zinc-400 border border-zinc-700/60 px-2 py-0.5 rounded">
                      Private
                    </span>
                  )}
                  {prompt.testsTotal > 0 ? (
                    <span className="text-[10px] text-emerald-300 font-bold">
                      {Math.round((prompt.testsPassed / prompt.testsTotal) * 100)}% Pass
                    </span>
                  ) : (
                    <span className="text-[10px] text-zinc-500">No evals</span>
                  )}
                </div>

                <Link
                  href={`/dashboard/prompts/${prompt.id}`}
                  className="px-3 py-1 bg-zinc-100 hover:bg-white text-zinc-950 rounded-lg text-xs font-bold active:scale-97 transition-all cursor-pointer"
                >
                  Open Studio →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface PromptSummary {
  id: string;
  name: string;
  description: string | null;
  currentVersionId?: string | null;
  updatedAt?: Date | string;
}

interface DashboardWorkspaceViewProps {
  isDemo?: boolean;
  prompts?: PromptSummary[];
  isFullScreen?: boolean;
}

export function DashboardWorkspaceView({
  isDemo = false,
  prompts = [],
  isFullScreen = false,
}: DashboardWorkspaceViewProps) {
  const [activeTab, setActiveTab] = useState<'editor' | 'diff' | 'evals'>('editor');
  const [copiedKey, setCopiedKey] = useState(false);
  const [tempValue, setTempValue] = useState(0.2);
  const [selectedPromptId, setSelectedPromptId] = useState<string>(
    prompts.length > 0 ? prompts[0].id : 'demo-1'
  );

  const demoPrompts = [
    { id: 'demo-1', name: 'code-reviewer-v3', version: 'v3', desc: 'Automated code review & static analysis prompt bundle.' },
    { id: 'demo-2', name: 'customer-support-v2', version: 'v2', desc: 'Customer ticket classification and auto-reply.' },
    { id: 'demo-3', name: 'json-extractor', version: 'v1', desc: 'Structured JSON data extraction from unformatted text.' },
  ];

  const activePromptName = isDemo
    ? (demoPrompts.find((p) => p.id === selectedPromptId)?.name ?? 'code-reviewer-v3')
    : (prompts.find((p) => p.id === selectedPromptId)?.name ?? (prompts[0]?.name || 'my-first-prompt'));

  const activePromptDesc = isDemo
    ? (demoPrompts.find((p) => p.id === selectedPromptId)?.desc ?? 'Automated code review & static analysis prompt bundle.')
    : (prompts.find((p) => p.id === selectedPromptId)?.description || 'Version-controlled prompt bundle.');

  const workspaceContent = (
    <div className={`grid grid-cols-1 lg:grid-cols-12 text-xs ${isFullScreen ? 'min-h-[calc(100vh-140px)]' : 'min-h-[620px]'}`}>
      <div className="lg:col-span-3 bg-[#161619] border-r border-zinc-800/90 p-4 space-y-6">
        <div className="relative font-mono">
          <input
            type="text"
            readOnly={isDemo}
            placeholder="Search prompts..."
            className="w-full bg-[#121214] border border-zinc-800 rounded-xl px-3.5 py-2 text-zinc-200 text-xs font-mono focus:outline-none placeholder:text-zinc-500 shadow-inner"
          />
          <span className="absolute right-2.5 top-2 text-[10px] font-mono text-zinc-500 bg-[#1D1D22] px-1.5 py-0.5 rounded border border-zinc-800">⌘K</span>
        </div>

        <div>
          <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span>Prompt Repositories ({isDemo ? demoPrompts.length : (prompts.length || 0)})</span>
            {!isDemo && (
              <Link href="/dashboard/new" className="text-blue-300 hover:underline text-xs font-bold lowercase">
                +new
              </Link>
            )}
          </div>

          <div className="space-y-1.5 font-mono">
            {isDemo ? (
              demoPrompts.map((dp) => (
                <div
                  key={dp.id}
                  onClick={() => setSelectedPromptId(dp.id)}
                  className={`p-2.5 rounded-xl font-medium flex items-center justify-between border cursor-pointer transition-all ${
                    selectedPromptId === dp.id
                      ? 'bg-[#1D1D22] text-white border-zinc-700/80 shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1D1D22]/60 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${selectedPromptId === dp.id ? 'bg-emerald-300' : 'bg-zinc-600'}`}></span>
                    <span className="font-mono text-xs font-bold">{dp.name}</span>
                  </div>
                  <BadgeVersion>{dp.version}</BadgeVersion>
                </div>
              ))
            ) : prompts.length === 0 ? (
              <div className="p-4 bg-[#121214] rounded-xl border border-zinc-800 text-zinc-500 text-center font-mono">
                No repositories yet.
              </div>
            ) : (
              prompts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPromptId(p.id)}
                  className={`p-2.5 rounded-xl font-medium flex items-center justify-between border cursor-pointer transition-all ${
                    selectedPromptId === p.id
                      ? 'bg-[#1D1D22] text-white border-zinc-700/80 shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1D1D22]/60 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${selectedPromptId === p.id ? 'bg-emerald-300' : 'bg-zinc-600'}`}></span>
                    <span className="font-mono text-xs font-bold truncate">{p.name}</span>
                  </div>
                  <BadgeVersion>active</BadgeVersion>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-800/90 space-y-2 font-mono text-xs text-zinc-400">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
            Workspace Tools
          </div>
          <div className="flex items-center gap-2 text-blue-300 bg-blue-500/10 border border-blue-500/20 px-3 py-2 rounded-xl font-bold">
            <span>⚡ Bundle Editor</span>
          </div>
          <Link href={!isDemo && selectedPromptId ? `/dashboard/prompts/${selectedPromptId}/diff` : '#'} className="flex items-center gap-2 hover:text-zinc-200 px-3 py-2 rounded-xl cursor-pointer block">
            <span>📜 Commit History</span>
          </Link>
          <Link href={!isDemo && selectedPromptId ? `/dashboard/prompts/${selectedPromptId}/tests` : '#'} className="flex items-center gap-2 hover:text-zinc-200 px-3 py-2 rounded-xl cursor-pointer block">
            <span>🧪 Test Suite & Evals</span>
          </Link>
          <Link href={!isDemo ? '/dashboard/api-keys' : '#'} className="flex items-center gap-2 hover:text-zinc-200 px-3 py-2 rounded-xl cursor-pointer block">
            <span>🔑 API Key Credentials</span>
          </Link>
        </div>
      </div>

      <div className="lg:col-span-6 p-6 space-y-5 bg-[#121214]">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/90">
          <div>
            <h3 className="text-lg font-bold text-zinc-100 font-mono flex items-center gap-2.5">
              {activePromptName}
              <BadgeVersion>v3 snapshot</BadgeVersion>
            </h3>
            <p className="text-xs text-zinc-400 mt-1 font-sans leading-relaxed">
              {activePromptDesc}
            </p>
          </div>

          {!isDemo && selectedPromptId && selectedPromptId !== 'demo-1' ? (
            <Link href={`/dashboard/prompts/${selectedPromptId}`}>
              <ButtonPrimary>
                Open Studio
              </ButtonPrimary>
            </Link>
          ) : (
            <ButtonPrimary>
              + Save Version
            </ButtonPrimary>
          )}
        </div>

        <div className="flex items-center gap-6 border-b border-zinc-800/90 text-xs font-mono pb-2.5">
          <button
            onClick={() => setActiveTab('editor')}
            className={`pb-2.5 -mb-2.5 font-bold cursor-pointer transition-colors ${activeTab === 'editor' ? 'text-blue-300 border-b-2 border-blue-300' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            Bundle Editor
          </button>
          <button
            onClick={() => setActiveTab('diff')}
            className={`pb-2.5 -mb-2.5 font-bold cursor-pointer transition-colors ${activeTab === 'diff' ? 'text-blue-300 border-b-2 border-blue-300' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            Diff Viewer (v2 → v3)
          </button>
          <button
            onClick={() => setActiveTab('evals')}
            className={`pb-2.5 -mb-2.5 font-bold cursor-pointer transition-colors ${activeTab === 'evals' ? 'text-blue-300 border-b-2 border-blue-300' : 'text-zinc-400 hover:text-zinc-200'}`}
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
                readOnly={isDemo}
                rows={4}
                defaultValue="You are an expert senior code reviewer. Analyze the code snippet for security bugs, performance bottlenecks, and style flaws. Return valid JSON adhering strictly to the schema."
                className="w-full bg-[#161619] border border-zinc-800 rounded-xl p-3.5 text-zinc-200 text-xs leading-relaxed focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1.5 flex items-center justify-between">
                <span>User Template (Extracted Variables)</span>
                <span className="text-[9px] text-blue-300 font-mono">Click variable tag to copy</span>
              </label>
              <div className="bg-[#161619] border border-zinc-800 rounded-xl p-3.5 text-zinc-200 text-xs leading-relaxed">
                <p className="text-zinc-400">Review the following code submission:</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => navigator.clipboard.writeText("{{codeSnippet}}")}
                    className="text-blue-300 font-bold bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                    title="Click to copy {{codeSnippet}}"
                  >
                    <span>{"{{codeSnippet}}"}</span>
                    <CopyIcon className="w-3 h-3 text-blue-400" />
                  </button>

                  <button
                    onClick={() => navigator.clipboard.writeText("{{language}}")}
                    className="text-blue-300 font-bold bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                    title="Click to copy {{language}}"
                  >
                    <span>{"{{language}}"}</span>
                    <CopyIcon className="w-3 h-3 text-blue-400" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#161619] rounded-xl border border-zinc-800 text-xs grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-zinc-500 text-[10px] block uppercase tracking-wider mb-1 font-mono">Provider</span>
                <select className="bg-[#121214] border border-zinc-800 rounded-lg px-2 py-1 text-zinc-100 font-mono text-xs w-full outline-none">
                  <option value="groq">groq</option>
                  <option value="openrouter">openrouter</option>
                </select>
              </div>
              <div>
                <span className="text-zinc-500 text-[10px] block uppercase tracking-wider mb-1 font-mono">Model</span>
                <select className="bg-[#121214] border border-zinc-800 rounded-lg px-2 py-1 text-blue-300 font-bold font-mono text-xs w-full outline-none">
                  <option value="llama-3.3-70b-versatile">llama-3.3-70b</option>
                  <option value="mixtral-8x7b-32768">mixtral-8x7b</option>
                </select>
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

            <div className="p-4 bg-[#161619] rounded-xl border border-zinc-800 text-xs leading-relaxed overflow-x-auto space-y-1.5">
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
            <div className="p-4 bg-[#161619] rounded-xl border border-zinc-800 text-xs space-y-3">
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

      <div className="lg:col-span-3 bg-[#161619] border-l border-zinc-800/90 p-4 space-y-5">
        <div>
          <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider mb-3">
            Commit Snapshots (Immutable)
          </div>
          <div className="space-y-2 font-mono">
            <div className="p-2.5 rounded-xl bg-[#1D1D22] border border-blue-500/40 text-zinc-100 text-xs shadow-xs">
              <div className="flex justify-between font-bold">
                <span className="text-blue-300">Version 3</span>
                <span className="text-[10px] text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded">Current</span>
              </div>
              <p className="text-[10px] text-zinc-400 mt-1 font-sans">Added Zod JSON response format</p>
            </div>

            <div className="p-2.5 rounded-xl bg-[#121214] border border-zinc-800 text-zinc-400 text-xs">
              <div className="flex justify-between font-bold text-zinc-300">
                <span>Version 2</span>
                <span className="text-[10px] text-zinc-500">2 hrs ago</span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-1 font-sans">Lowered temperature to 0.2</p>
            </div>

            <div className="p-2.5 rounded-xl bg-[#121214] border border-zinc-800 text-zinc-400 text-xs">
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
          <div className="p-2.5 bg-[#121214] rounded-xl border border-zinc-800 text-[11px] text-zinc-300 flex items-center justify-between">
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

  if (isFullScreen) {
    return (
      <div className="rounded-2xl border border-zinc-800/90 bg-[#161619] shadow-2xl overflow-hidden font-sans">
        <div className="bg-[#121214] text-zinc-300 px-5 py-3 flex items-center justify-between text-xs font-mono border-b border-zinc-800/90">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-[#1D1D22] border border-zinc-700/60 text-zinc-200">
              <TerminalIcon className="w-3.5 h-3.5 text-blue-300" />
              <span>Workspace Studio · Git for Prompts</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-zinc-400 font-mono">
            <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
              Live Workspace Connected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-[#1D1D22] text-zinc-400 px-2.5 py-0.5 rounded-lg border border-zinc-700/60 font-mono">
              gfp-cli
            </span>
          </div>
        </div>

        {workspaceContent}
      </div>
    );
  }

  return (
    <CardDark className="shadow-2xl font-sans text-xs">
      <div className="bg-[#121214] text-zinc-300 px-4 py-3 flex items-center justify-between text-xs font-mono border-b border-zinc-800/90">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-[#1D1D22] border border-zinc-700/60 text-zinc-200">
            <TerminalIcon className="w-3.5 h-3.5 text-blue-300" />
            <span>kwakhare5 / Git-for-Prompts</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-zinc-400 font-mono">
          <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
            Local SQLite Wasm Engine Online (Demo Mode)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-[#1D1D22] text-zinc-400 px-2.5 py-0.5 rounded-lg border border-zinc-700/60 font-mono">
            gfp-cli
          </span>
        </div>
      </div>

      {workspaceContent}
    </CardDark>
  );
}
