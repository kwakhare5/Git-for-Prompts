export default function TestsLoading() {
  return (
    <div className="space-y-6 font-sans">
      {/* Stacked Breadcrumb Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-zinc-800/90 pb-5 gap-3">
        <div className="space-y-2 font-mono">
          <div className="skeleton h-4 w-48" style={{ opacity: 0.6 }} />
          <div className="skeleton h-7 w-44" />
        </div>
        <div className="skeleton h-6 w-32 shrink-0" />
      </div>

      {/* Version selector row skeleton */}
      <div className="flex items-center gap-3">
        <div className="skeleton h-4 w-20" style={{ opacity: 0.6 }} />
        <div className="skeleton h-9 w-48" />
        <div className="skeleton h-9 w-24 ml-auto" />
      </div>

      {/* Test case cards skeleton */}
      <div className="flex flex-col gap-3 font-mono">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-zinc-800/90 bg-bg-card p-4 space-y-3 shadow-xl"
            style={{ opacity: Math.max(0.4, 1 - i * 0.2) }}
          >
            <div className="flex items-center justify-between">
              <div className="skeleton h-4 w-40" />
              <div className="skeleton h-5 w-16" />
            </div>
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-3/4" style={{ opacity: 0.6 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

