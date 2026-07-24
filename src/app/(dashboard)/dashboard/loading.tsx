// Skeleton that mirrors the exact structure of /dashboard (PromptTable layout).
// Uses the .skeleton shimmer class from globals.css — no animate-pulse.

export default function DashboardLoading() {
  return (
    <div className="p-4 sm:p-8">
      {/* Header row — mirrors DashboardPage header */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <div className="skeleton h-7 w-24" />
          <div className="skeleton h-4 w-44" style={{ opacity: 0.6 }} />
        </div>
        <div className="skeleton h-9 w-32" />
      </div>

      {/* Table skeleton — mirrors PromptTable exactly */}
      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        {/* Table header */}
        <div className="flex items-center gap-6 px-4 sm:px-6 py-2.5 border-b border-zinc-800 bg-zinc-900/50">
          <div className="skeleton h-3 w-14 flex-1" style={{ maxWidth: 56 }} />
          <div className="skeleton h-3 w-10 hidden sm:block" />
          <div className="skeleton h-3 w-16 hidden md:block" />
          <div className="skeleton h-3 w-8" />
        </div>

        {/* 5 rows fading out */}
        {([70, 55, 65, 45, 60] as const).map((nameW, i) => (
          <div
            key={i}
            className="flex items-center gap-6 px-4 sm:px-6 py-3.5 border-b border-zinc-800/60 bg-zinc-950 last:border-b-0"
            style={{ opacity: Math.max(0.15, 1 - i * 0.18) }}
          >
            {/* Name + version badge */}
            <div className="flex-1 space-y-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <div className="skeleton h-4" style={{ width: `${nameW}%` }} />
                <div className="skeleton h-4 w-7 shrink-0" />
              </div>
              <div className="skeleton h-3" style={{ width: `${nameW - 15}%` }} />
            </div>
            {/* Tests */}
            <div className="skeleton h-3.5 w-10 shrink-0 hidden sm:block" />
            {/* Updated */}
            <div className="skeleton h-3 w-16 shrink-0 hidden md:block" />
            {/* Actions */}
            <div className="skeleton h-3.5 w-12 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
