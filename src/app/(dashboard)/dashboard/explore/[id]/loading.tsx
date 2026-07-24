// Skeleton for /dashboard/explore/[id] — mirrors crumb + content + fork CTA
export default function ExploreDetailLoading() {
  return (
    <div className="p-4 sm:p-8">
      {/* Crumb + fork button */}
      <div className="flex items-center justify-between mb-8">
        <div className="skeleton h-4 w-28" />
        <div className="skeleton h-9 w-24" />
      </div>
      <div className="flex flex-col gap-6">
        {/* Title + metadata */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="skeleton h-7 w-48" />
            <div className="skeleton h-5 w-8 rounded-full" />
          </div>
          <div className="skeleton h-4 w-72" style={{ opacity: 0.6 }} />
          <div className="skeleton h-3 w-40" style={{ opacity: 0.4 }} />
        </div>
        {/* Variables panel */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-2">
          <div className="skeleton h-3.5 w-36" />
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-7 w-20 rounded" />
            ))}
          </div>
        </div>
        {/* Content preview */}
        <div className="space-y-2">
          <div className="skeleton h-3 w-24" />
          <div className="skeleton h-48 w-full rounded-xl" />
        </div>
        {/* Footer fork CTA */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="skeleton h-4 w-48" />
            <div className="skeleton h-3 w-64" style={{ opacity: 0.6 }} />
          </div>
          <div className="skeleton h-9 w-24 shrink-0" />
        </div>
      </div>
    </div>
  );
}
