'use client';

interface BundleVariablesTabProps {
  detectedVariables: string[];
  minHeight?: string;
}

export function BundleVariablesTab({ detectedVariables, minHeight = '680px' }: BundleVariablesTabProps) {
  return (
    <div className="p-6" style={{ minHeight }}>
      {detectedVariables.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="text-3xl font-mono text-muted-foreground mb-3">{'{{}}'}</span>
          <p className="text-sm text-muted-foreground">No variables detected.</p>
          <p className="text-xs text-muted-foreground mt-1">
            Use <code className="font-mono bg-muted px-1 rounded">{'{{variable_name}}'}</code> in your prompt templates.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 max-w-md">
          <p className="text-xs text-muted-foreground">
            {detectedVariables.length} variable{detectedVariables.length !== 1 ? 's' : ''} detected across system prompt + user template.
          </p>
          <div className="flex flex-wrap gap-2">
            {detectedVariables.map((v) => (
              <span
                key={v}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-sky-500/10 border border-sky-500/20 text-xs font-mono text-sky-400"
              >
                <span className="opacity-40">{'{{'}</span>
                {v}
                <span className="opacity-40">{'}}'}</span>
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Pass values via API: <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs text-foreground">?variables[name]=value</code>
          </p>
        </div>
      )}
    </div>
  );
}
