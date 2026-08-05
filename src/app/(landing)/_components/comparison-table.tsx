'use client';

type Check = '✓' | '✗' | '~';

interface Row {
  feature: string;
  gfp: Check;
  langfuse: Check;
  braintrust: Check;
  promptlayer: Check;
  note?: string;
}

const ROWS: Row[] = [
  { feature: 'Local-first / offline', gfp: '✓', langfuse: '✗', braintrust: '✗', promptlayer: '✗', note: 'SQLite Wasm, no cloud needed' },
  { feature: 'Self-hostable (Docker)', gfp: '✓', langfuse: '✓', braintrust: '✗', promptlayer: '✗' },
  { feature: 'Version control (immutable)', gfp: '✓', langfuse: '~', braintrust: '✓', promptlayer: '~' },
  { feature: 'Side-by-side diff view', gfp: '✓', langfuse: '✗', braintrust: '✓', promptlayer: '✗' },
  { feature: 'Eval runner', gfp: '✓', langfuse: '✓', braintrust: '✓', promptlayer: '✗' },
  { feature: 'CLI (push / pull)', gfp: '✓', langfuse: '✗', braintrust: '~', promptlayer: '✗', note: 'gfp push / gfp pull' },
  { feature: 'Variable interpolation', gfp: '✓', langfuse: '✓', braintrust: '✓', promptlayer: '✓' },
  { feature: 'Webhook delivery (HMAC)', gfp: '✓', langfuse: '✓', braintrust: '✗', promptlayer: '✗' },
  { feature: 'Open source', gfp: '✓', langfuse: '✓', braintrust: '✗', promptlayer: '✗' },
  { feature: 'Free tier', gfp: '✓', langfuse: '✓', braintrust: '~', promptlayer: '~' },
];

const HEADERS = ['', 'gfp', 'Langfuse', 'Braintrust', 'PromptLayer'];

const CHECK_STYLE: Record<Check, string> = {
  '✓': 'text-emerald-400',
  '✗': 'text-zinc-700',
  '~': 'text-amber-500',
};

export function ComparisonTable() {
  return (
    <section className="px-6 py-24 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 mb-3">Comparison</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
          How gfp stacks up.
        </h2>
        <p className="mt-4 text-zinc-400 max-w-xl mx-auto text-base leading-relaxed">
          The only prompt management tool that starts offline and syncs to cloud — not the other way around.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
        <table className="w-full text-sm font-mono border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08]">
              {HEADERS.map((h, idx) => (
                <th
                  key={h || 'feature'}
                  className={`px-5 py-3 text-left text-xs tracking-wide font-semibold ${
                    idx === 0
                      ? 'text-zinc-400 w-1/3'
                      : idx === 1
                      ? 'text-[#f5f0eb] bg-white/[0.03]'
                      : 'text-zinc-500'
                  }`}
                >
                  {h || 'Feature'}
                  {idx === 1 && (
                    <span className="ml-2 text-[9px] text-zinc-600 font-normal normal-case tracking-normal">← this</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, rowIdx) => (
              <tr
                key={row.feature}
                className={`border-b border-white/[0.04] ${
                  rowIdx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]'
                }`}
              >
                {/* Feature name */}
                <td className="px-5 py-3 text-zinc-300 text-xs">
                  {row.feature}
                  {row.note && (
                    <span className="ml-2 text-zinc-600 text-[10px] font-normal">({row.note})</span>
                  )}
                </td>

                {/* gfp */}
                <td className={`px-5 py-3 text-center font-bold bg-white/[0.02] ${CHECK_STYLE[row.gfp]}`}>
                  {row.gfp}
                </td>

                {/* Competitors */}
                {(['langfuse', 'braintrust', 'promptlayer'] as const).map((key) => (
                  <td key={key} className={`px-5 py-3 text-center ${CHECK_STYLE[row[key]]}`}>
                    {row[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-center text-[11px] text-zinc-600 font-mono mt-4">
        ~ = partial / requires paid plan · Data accurate as of 2025
      </p>
    </section>
  );
}
