'use client';

interface BundleVariablesTabProps {
  detectedVariables: string[];
  minHeight?: string;
}

export function BundleVariablesTab({ detectedVariables, minHeight = '680px' }: BundleVariablesTabProps) {
  return (
    <div className="p-6 bg-bg-card font-sans" style={{ minHeight }}>
      {detectedVariables.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="text-3xl font-mono text-zinc-600 mb-3 font-bold">{'{{}}'}</span>
          <p className="text-xs text-zinc-400 font-mono">No variables detected yet.</p>
          <p className="text-xs text-zinc-500 mt-1 font-sans">
            Use <code className="font-mono bg-bg-page border border-zinc-800 px-1.5 py-0.5 rounded text-emerald-400">{'{{variable_name}}'}</code> in your user templates.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 max-w-md font-mono text-xs">
          <p className="text-xs text-zinc-400">
            {detectedVariables.length} variable{detectedVariables.length !== 1 ? 's' : ''} extracted across prompt template:
          </p>
          <div className="flex flex-wrap gap-2">
            {detectedVariables.map((v) => (
              <span
                key={v}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-300 font-bold"
              >
                <span className="opacity-40">{'{{'}</span>
                {v}
                <span className="opacity-40">{'}}'}</span>
              </span>
            ))}
          </div>
          <div className="p-3.5 rounded-xl bg-bg-page border border-zinc-800 text-[11px] text-zinc-400">
            <span>Interpolate via REST API:</span>
            <code className="font-mono text-emerald-400 block mt-1">POST /api/v1/prompts/ID/latest?vars[user_name]=Karan</code>
          </div>
        </div>
      )}
    </div>
  );
}
