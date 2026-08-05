'use client';

import { Play } from 'lucide-react';
import { usePromptSandbox } from '@/hooks/use-prompt-sandbox';

export function SandboxWorkspace() {
  const {
    versions,
    activeVersionNumber,
    setActiveVersionNumber,
    editorContent,
    setEditorContent,
    commitInput,
    setCommitInput,
    activeSubTab,
    setActiveSubTab,
    compareVerA,
    setCompareVerA,
    compareVerB,
    setCompareVerB,
    compareStatus,
    testCase,
    testResult,
    testOutput,
    testLogs,
    handleCommitSave,
    handleRunTestCase,
    handleRunComparison,
  } = usePromptSandbox();

  return (
    <div className="flex-1 flex flex-col p-6 max-w-7xl mx-auto w-full animate-in fade-in duration-200">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 border border-white/[0.08] rounded-2xl overflow-hidden bg-[#161616] min-h-[500px]">
        {/* Sidebar */}
        <div className="border-r border-white/[0.08] bg-[#121212] p-5 space-y-6">
          <div>
            <h3 className="font-semibold text-sm text-zinc-200 font-mono">customer-support-returns</h3>
            <p className="text-xs text-zinc-500 mt-1 font-mono">Simulated sandbox workspace</p>
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
                      ? 'bg-white/10 border-white/20 text-white shadow-sm'
                      : 'bg-white/[0.02] border-white/[0.06] hover:border-white/10 text-zinc-400 hover:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full font-mono text-[10px]">
                    <span className="font-semibold text-zinc-300">v{v.versionNumber}</span>
                    <span className="text-zinc-500">{v.createdAt}</span>
                  </div>
                  <p className="text-xs truncate w-full mt-1.5 text-zinc-400 font-mono">{v.commitMessage}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Panel */}
        <div className="lg:col-span-3 flex flex-col">
          {/* Sub-tab Navigation */}
          <div className="flex items-center justify-between border-b border-white/10 bg-[#141414] px-5 font-mono">
            <div className="flex">
              {(['edit', 'diff', 'tests', 'compare'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveSubTab(tab)}
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    activeSubTab === tab
                      ? 'border-white text-white font-bold'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-5 flex flex-col">
            {activeSubTab === 'edit' && (
              <div className="flex-1 flex flex-col space-y-4 animate-in fade-in duration-200">
                <div className="flex-1 flex flex-col border border-white/10 rounded-xl bg-[#0e0e0e] overflow-hidden min-h-[300px]">
                  <div className="px-4 py-2 border-b border-white/10 bg-[#141414] flex items-center justify-between text-xs text-zinc-400 font-mono">
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
                    className="md:col-span-3 px-4 py-2 text-sm rounded-lg bg-[#141414] border border-white/10 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-white/20 font-mono"
                  />
                  <button
                    onClick={handleCommitSave}
                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#f5f0eb] text-zinc-950 hover:bg-white active:scale-[0.97] transition-all cursor-pointer"
                  >
                    Commit Save
                  </button>
                </div>
              </div>
            )}

            {activeSubTab === 'diff' && (
              <div className="flex-1 flex flex-col space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                  <span className="px-2 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-900/50">v1 (Original)</span>
                  <span className="text-zinc-600">→</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-900/50">v{activeVersionNumber} (Active Sandbox)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-white/10 rounded-xl overflow-hidden bg-[#0e0e0e] min-h-[300px] p-4 font-mono text-xs text-zinc-300">
                  <div className="space-y-1">
                    <p className="text-zinc-500 border-b border-white/[0.06] pb-1">v1 Original</p>
                    <p>{versions[0]?.content}</p>
                  </div>
                  <div className="space-y-1 border-l border-white/[0.08] pl-4">
                    <p className="text-emerald-400 border-b border-white/[0.06] pb-1">v{activeVersionNumber} Modified</p>
                    <p>{editorContent}</p>
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === 'tests' && (
              <div className="flex-1 flex flex-col space-y-4 animate-in fade-in duration-200 font-mono text-xs">
                <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-[#121212]">
                  <div>
                    <span className="font-semibold text-zinc-200">{testCase.name}</span>
                    <p className="text-zinc-400 text-[11px] mt-0.5">{testCase.input_text}</p>
                  </div>
                  <button
                    onClick={handleRunTestCase}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f5f0eb] text-zinc-950 hover:bg-white active:scale-[0.97] transition-all cursor-pointer font-semibold"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Run Test
                  </button>
                </div>

                {testResult !== 'idle' && (
                  <div className="p-4 rounded-xl border border-white/10 bg-[#0e0e0e] space-y-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400">Execution Status</span>
                      <span className={testResult === 'passed' ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                        {testResult.toUpperCase()}
                      </span>
                    </div>
                    {testOutput && (
                      <div className="p-3 rounded bg-[#141414] border border-white/[0.06] text-zinc-300 whitespace-pre-wrap">
                        {testOutput}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeSubTab === 'compare' && (
              <div className="flex-1 flex flex-col space-y-4 animate-in fade-in duration-200 font-mono text-xs">
                <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-[#121212]">
                  <select
                    value={compareVerA}
                    onChange={(e) => setCompareVerA(Number(e.target.value))}
                    className="bg-[#1a1a1a] border border-white/10 rounded px-2 py-1 text-zinc-200"
                  >
                    {versions.map((v) => (
                      <option key={v.versionNumber} value={v.versionNumber}>
                        Version {v.versionNumber}
                      </option>
                    ))}
                  </select>
                  <span className="text-zinc-500">VS</span>
                  <select
                    value={compareVerB}
                    onChange={(e) => setCompareVerB(Number(e.target.value))}
                    className="bg-[#1a1a1a] border border-white/10 rounded px-2 py-1 text-zinc-200"
                  >
                    {versions.map((v) => (
                      <option key={v.versionNumber} value={v.versionNumber}>
                        Version {v.versionNumber}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleRunComparison}
                    className="ml-auto px-3 py-1.5 rounded-lg bg-[#f5f0eb] text-zinc-950 hover:bg-white active:scale-[0.97] font-semibold transition-all cursor-pointer"
                  >
                    Compare Outputs
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
