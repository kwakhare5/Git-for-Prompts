export default function CompareLoading() {
  return (
    <div className="space-y-6 font-sans">
      {/* Stacked Breadcrumb Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-zinc-800/90 pb-5 gap-3">
        <div className="space-y-2 font-mono">
          <div className="skeleton h-4 w-48" style={{ opacity: 0.6 }} />
          <div className="skeleton h-7 w-48" />
        </div>
        <div className="skeleton h-6 w-32 shrink-0" />
      </div>

      {/* Version selectors skeleton */}
      <div className="flex items-center gap-3">
        <div className="skeleton h-9 w-44" />
        <div className="skeleton h-4 w-6" style={{ opacity: 0.4 }} />
        <div className="skeleton h-9 w-44" />
        <div className="skeleton h-9 w-28 ml-auto" />
      </div>

      {/* Side-by-side result panels skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
        {[0, 1].map((col) => (
          <div key={col} className="rounded-2xl border border-zinc-800/90 bg-bg-card p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="skeleton h-4 w-16" />
              <div className="skeleton h-5 w-12" />
            </div>
            <div className="skeleton h-32 w-full" />
            <div className="skeleton h-3 w-2/3" style={{ opacity: 0.5 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

