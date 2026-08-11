export default function DashboardLoading() {
  return (
    <div className="space-y-6 font-sans">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800/90 pb-5 gap-4">
        <div className="space-y-2">
          <div className="skeleton h-7 w-48" />
          <div className="skeleton h-4 w-72" style={{ opacity: 0.5 }} />
        </div>
        <div className="skeleton h-9 w-36 shrink-0" />
      </div>

      {/* 4 Stat Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-bg-card p-4 rounded-2xl border border-zinc-800/90 space-y-2"
          >
            <div className="skeleton h-3 w-20 opacity-60" />
            <div className="skeleton h-7 w-12" />
          </div>
        ))}
      </div>

      {/* Repository Table Skeleton */}
      <div className="border border-zinc-800/90 rounded-2xl bg-bg-card overflow-hidden shadow-xl p-4 space-y-3">
        <div className="skeleton h-10 w-full" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-12 w-full" style={{ opacity: 1 - i * 0.15 }} />
          ))}
        </div>
      </div>
    </div>
  );
}
