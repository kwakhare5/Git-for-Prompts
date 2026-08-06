'use client';

import { Play } from 'lucide-react';
import { usePromptSandbox } from '@/hooks/use-prompt-sandbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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
    <div className="flex-1 flex flex-col p-6 max-w-7xl mx-auto w-full animate-in fade-in duration-200 font-sans">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 border border-border rounded-2xl overflow-hidden bg-card min-h-[500px] touch-pan-y overscroll-y-auto shadow-2xl">
        {/* Sidebar */}
        <div className="border-r border-border bg-muted/40 p-5 space-y-6">
          <div>
            <h3 className="font-semibold text-sm text-foreground font-mono">customer-support-returns</h3>
            <p className="text-xs text-muted-foreground mt-1 font-mono">Simulated sandbox workspace</p>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-mono tracking-wider text-muted-foreground uppercase font-semibold">Version History</span>
            <div className="space-y-1.5">
              {versions.slice().reverse().map((v) => (
                <Button
                  key={v.versionNumber}
                  type="button"
                  variant={activeVersionNumber === v.versionNumber ? 'secondary' : 'ghost'}
                  onClick={() => {
                    setActiveVersionNumber(v.versionNumber);
                    setEditorContent(v.content);
                  }}
                  className="w-full h-auto flex flex-col items-start text-left p-3 rounded-lg border border-border cursor-pointer font-sans"
                >
                  <div className="flex items-center justify-between w-full font-mono text-xs">
                    <span className="font-semibold text-foreground">v{v.versionNumber}</span>
                    <span className="text-muted-foreground">{v.createdAt}</span>
                  </div>
                  <p className="text-xs truncate w-full mt-1 text-muted-foreground font-mono font-normal">{v.commitMessage}</p>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Panel */}
        <div className="lg:col-span-3 flex flex-col">
          {/* Sub-tab Navigation */}
          <div className="flex items-center justify-between border-b border-border bg-muted/20 px-5 py-2 font-mono">
            <div className="flex items-center gap-1">
              {(['edit', 'diff', 'tests', 'compare'] as const).map((tab) => (
                <Button
                  key={tab}
                  type="button"
                  variant={activeSubTab === tab ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveSubTab(tab)}
                  className="h-8 px-3 text-xs font-semibold uppercase tracking-wider font-mono cursor-pointer"
                >
                  {tab}
                </Button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-5 flex flex-col">
            {activeSubTab === 'edit' && (
              <div className="flex-1 flex flex-col space-y-4 animate-in fade-in duration-200">
                <div className="flex-1 flex flex-col border border-border rounded-xl bg-background overflow-hidden min-h-[300px]">
                  <div className="px-4 py-2 border-b border-border bg-muted/40 flex items-center justify-between text-xs text-muted-foreground font-mono">
                    <span>prompt_template.txt</span>
                    <span>v{activeVersionNumber}</span>
                  </div>
                  <Textarea
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    className="flex-1 p-4 bg-transparent outline-none resize-none font-mono text-sm leading-relaxed text-foreground overscroll-y-auto border-none focus-visible:ring-0"
                    placeholder="Write your prompt system instruction..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <Input
                    type="text"
                    value={commitInput}
                    onChange={(e) => setCommitInput(e.target.value)}
                    placeholder="Commit message (e.g. Adjust refund instructions)"
                    className="md:col-span-3 font-mono text-sm"
                  />
                  <Button
                    onClick={handleCommitSave}
                    variant="default"
                    size="default"
                    className="font-semibold cursor-pointer shadow-sm font-sans"
                  >
                    Commit Save
                  </Button>
                </div>
              </div>
            )}

            {activeSubTab === 'diff' && (
              <div className="flex-1 flex flex-col space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                  <span className="px-2 py-0.5 rounded bg-destructive/10 text-destructive border border-destructive/20">v1 (Original)</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">v{activeVersionNumber} (Active Sandbox)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-border rounded-xl overflow-hidden bg-background min-h-[300px] p-4 font-mono text-xs text-foreground">
                  <div className="space-y-1">
                    <p className="text-muted-foreground border-b border-border pb-1">v1 Original</p>
                    <p>{versions[0]?.content}</p>
                  </div>
                  <div className="space-y-1 border-l border-border pl-4">
                    <p className="text-emerald-400 border-b border-border pb-1">v{activeVersionNumber} Modified</p>
                    <p>{editorContent}</p>
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === 'tests' && (
              <div className="flex-1 flex flex-col space-y-4 animate-in fade-in duration-200 font-mono text-xs">
                <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                  <div>
                    <span className="font-semibold text-foreground text-sm">{testCase.name}</span>
                    <p className="text-muted-foreground text-xs mt-0.5">{testCase.input_text}</p>
                  </div>
                  <Button
                    onClick={handleRunTestCase}
                    variant="default"
                    size="sm"
                    className="gap-1.5 cursor-pointer font-semibold text-xs shadow-sm font-sans"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Run Test
                  </Button>
                </div>

                {testResult !== 'idle' && (
                  <div className="p-4 rounded-xl border border-border bg-background space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Execution Status</span>
                      <span className={testResult === 'passed' ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                        {testResult.toUpperCase()}
                      </span>
                    </div>
                    {testOutput && (
                      <div className="p-3 rounded bg-muted/40 border border-border text-foreground whitespace-pre-wrap">
                        {testOutput}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeSubTab === 'compare' && (
              <div className="flex-1 flex flex-col space-y-4 animate-in fade-in duration-200 font-mono text-xs">
                <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
                  <select
                    value={compareVerA}
                    onChange={(e) => setCompareVerA(Number(e.target.value))}
                    className="bg-background border border-border rounded px-2 py-1 text-foreground"
                  >
                    {versions.map((v) => (
                      <option key={v.versionNumber} value={v.versionNumber}>
                        Version {v.versionNumber}
                      </option>
                    ))}
                  </select>
                  <span className="text-muted-foreground">VS</span>
                  <select
                    value={compareVerB}
                    onChange={(e) => setCompareVerB(Number(e.target.value))}
                    className="bg-background border border-border rounded px-2 py-1 text-foreground"
                  >
                    {versions.map((v) => (
                      <option key={v.versionNumber} value={v.versionNumber}>
                        Version {v.versionNumber}
                      </option>
                    ))}
                  </select>
                  <Button
                    onClick={handleRunComparison}
                    variant="default"
                    size="sm"
                    className="ml-auto font-semibold transition-all cursor-pointer font-sans shadow-sm"
                  >
                    Compare Outputs
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
