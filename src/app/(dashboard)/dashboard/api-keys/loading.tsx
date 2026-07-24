// Skeleton for /dashboard/api-keys — mirrors two-column layout exactly
export default function ApiKeysLoading() {
  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8 space-y-2">
        <div className="skeleton h-7 w-20" />
        <div className="skeleton h-4 w-72" style={{ opacity: 0.55 }} />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
        {/* Left: generate form + key list */}
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4">
            <div className="skeleton h-4 w-32" />
            <div className="skeleton h-3 w-64" style={{ opacity: 0.55 }} />
            <div className="flex gap-2 mt-1">
              <div className="skeleton h-10 flex-1" />
              <div className="skeleton h-10 w-24 shrink-0" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="skeleton h-4 w-20" />
            <div className="rounded-xl border border-zinc-800 overflow-hidden">
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
        {/* Right: ref panels */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4">
            <div className="skeleton h-4 w-28" />
            <div className="skeleton h-20 w-full rounded-lg" />
            <div className="skeleton h-24 w-full rounded-lg" />
            <div className="flex gap-3 pt-1 border-t border-zinc-800">
              <div className="skeleton h-4 w-12" />
              <div className="skeleton h-4 w-12" />
              <div className="skeleton h-4 w-12" />
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
            <div className="skeleton h-4 w-20" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-3 w-full" style={{ opacity: 1 - i * 0.12 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
