// Skeleton for /dashboard/webhooks — mirrors two-column layout exactly
export default function WebhooksLoading() {
  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8 space-y-2">
        <div className="skeleton h-7 w-24" />
        <div className="skeleton h-4 w-80" style={{ opacity: 0.55 }} />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
        {/* Left: form + webhook list */}
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
            <div className="skeleton h-3.5 w-36" />
            <div className="skeleton h-10 w-full" />
            <div className="skeleton h-10 w-full" />
            <div className="skeleton h-9 w-28" />
          </div>
          <div className="rounded-xl border border-zinc-800 overflow-hidden">
            {[70, 55, 60].map((w, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3.5 border-b border-zinc-800/60 last:border-b-0" style={{ opacity: 1 - i * 0.2 }}>
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <div className="skeleton h-3.5 w-32" />
                  <div className="skeleton h-3" style={{ width: `${w}%` }} />
                </div>
                <div className="skeleton h-5 w-16 shrink-0" />
                <div className="skeleton h-5 w-5 shrink-0 rounded" />
              </div>
            ))}
          </div>
        </div>
        {/* Right: payload + how-it-works */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
            <div className="skeleton h-4 w-32" />
            <div className="skeleton h-48 w-full rounded-lg" />
            <div className="skeleton h-3 w-48" style={{ opacity: 0.5 }} />
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
            <div className="skeleton h-4 w-24" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-3 w-full" style={{ opacity: 1 - i * 0.12 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
