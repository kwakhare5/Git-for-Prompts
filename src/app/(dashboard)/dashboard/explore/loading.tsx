// Skeleton for /dashboard/explore — mirrors header + 3-col card grid
export default function ExploreLoading() {
  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <div className="skeleton h-7 w-20" />
          <div className="skeleton h-4 w-64" style={{ opacity: 0.55 }} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[75, 60, 80, 50, 70, 65].map((w, i) => (
          <div
            key={i}
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 flex flex-col gap-3"
            style={{ opacity: Math.max(0.2, 1 - i * 0.1) }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="skeleton h-4 flex-1" style={{ maxWidth: `${w}%` }} />
              <div className="skeleton h-5 w-7 shrink-0 rounded-full" />
            </div>
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-4/5" style={{ opacity: 0.7 }} />
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-zinc-800/60">
              <div className="skeleton h-3 w-14" />
              <div className="skeleton h-7 w-16 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
