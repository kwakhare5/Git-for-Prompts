export default function DashboardLoading() {
  return (
    <div className="space-y-6 font-sans animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between border-b border-zinc-800/90 pb-5">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-bg-card rounded-xl border border-zinc-800/90" />
          <div className="h-4 w-72 bg-bg-card rounded-lg border border-zinc-800/90" />
        </div>
        <div className="h-9 w-36 bg-bg-card rounded-xl border border-zinc-800/90" />
      </div>

      {/* 4 Stat Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-bg-card p-4 rounded-2xl border border-zinc-800/90 space-y-2"
          >
            <div className="h-3 w-20 bg-bg-page rounded" />
            <div className="h-8 w-12 bg-bg-page rounded-lg" />
          </div>
        ))}
      </div>

      {/* Repository Table Skeleton */}
      <div className="border border-zinc-800/90 rounded-2xl bg-bg-card overflow-hidden shadow-xl p-4 space-y-3">
        <div className="h-10 w-full bg-bg-page rounded-xl" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 w-full bg-bg-page rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
