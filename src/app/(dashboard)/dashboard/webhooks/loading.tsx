export default function WebhooksLoading() {
  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-zinc-800/90 pb-5 space-y-2">
        <div className="skeleton h-7 w-40" />
        <div className="skeleton h-4 w-80" style={{ opacity: 0.55 }} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
        {/* Left: form + webhook list skeleton */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-800/90 bg-bg-card p-5 space-y-3 shadow-xl">
            <div className="skeleton h-4 w-36" />
            <div className="skeleton h-10 w-full" />
            <div className="skeleton h-10 w-full" />
            <div className="skeleton h-9 w-28" />
          </div>

          <div className="rounded-2xl border border-zinc-800/90 bg-bg-card overflow-hidden shadow-xl">
            {[70, 55, 60].map((w, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-zinc-800/60 last:border-b-0" style={{ opacity: 1 - i * 0.2 }}>
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <div className="skeleton h-3.5 w-32" />
                  <div className="skeleton h-3" style={{ width: `${w}%` }} />
                </div>
                <div className="skeleton h-5 w-16 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: payload reference skeleton */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-800/90 bg-bg-card p-5 space-y-3 shadow-xl">
            <div className="skeleton h-4 w-32" />
            <div className="skeleton h-48 w-full" />
          </div>
          <div className="rounded-2xl border border-zinc-800/90 bg-bg-card p-5 space-y-3 shadow-xl">
            <div className="skeleton h-4 w-24" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-3 w-full" style={{ opacity: 1 - i * 0.15 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
