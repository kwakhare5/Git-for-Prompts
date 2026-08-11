export default function ApiKeysLoading() {
  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-zinc-800/90 pb-5 space-y-2">
        <div className="skeleton h-7 w-40" />
        <div className="skeleton h-4 w-72" style={{ opacity: 0.55 }} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
        {/* Left: generate form + key list skeleton */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-800/90 bg-bg-card p-5 space-y-4 shadow-xl">
            <div className="skeleton h-4 w-32" />
            <div className="skeleton h-3 w-64" style={{ opacity: 0.55 }} />
            <div className="flex gap-2 mt-1">
              <div className="skeleton h-10 flex-1" />
              <div className="skeleton h-10 w-28 shrink-0" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="skeleton h-4 w-24" />
            <div className="rounded-2xl border border-zinc-800/90 bg-bg-card overflow-hidden shadow-xl">
              {[80, 65, 55].map((w, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-zinc-800/60 last:border-b-0" style={{ opacity: 1 - i * 0.2 }}>
                  <div className="skeleton h-3.5 flex-1" style={{ maxWidth: `${w}%` }} />
                  <div className="skeleton h-3 w-16 shrink-0" />
                  <div className="skeleton h-6 w-6 shrink-0 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: reference panels skeleton */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-800/90 bg-bg-card p-5 space-y-4 shadow-xl">
            <div className="skeleton h-4 w-28" />
            <div className="skeleton h-20 w-full" />
            <div className="skeleton h-24 w-full" />
          </div>
          <div className="rounded-2xl border border-zinc-800/90 bg-bg-card p-5 space-y-3 shadow-xl">
            <div className="skeleton h-4 w-20" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-3 w-full" style={{ opacity: 1 - i * 0.15 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
