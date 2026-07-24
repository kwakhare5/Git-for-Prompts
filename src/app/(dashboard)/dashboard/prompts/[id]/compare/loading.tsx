// Skeleton for /dashboard/prompts/[id]/compare — mirrors crumb + compare runner panels
export default function CompareLoading() {
  return (
    <div className="p-4 sm:p-8">
      {/* Crumb + title */}
      <div className="flex items-center gap-3 mb-8 min-w-0">
        <div className="skeleton h-4 w-28" style={{ opacity: 0.6 }} />
        <div className="w-px h-4 bg-zinc-800 shrink-0" />
        <div className="skeleton h-6 w-24" />
        <div className="skeleton h-5 w-24 rounded-full" style={{ opacity: 0.6 }} />
      </div>
      {/* Version selectors */}
      <div className="flex items-center gap-3 mb-6">
        <div className="skeleton h-9 w-44 rounded-md" />
        <div className="skeleton h-4 w-6 rounded-full" style={{ opacity: 0.4 }} />
        <div className="skeleton h-9 w-44 rounded-md" />
        <div className="skeleton h-9 w-28 rounded-md ml-auto" />
      </div>
      {/* Side-by-side result panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[0, 1].map((col) => (
          <div key={col} className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="skeleton h-4 w-16" />
              <div className="skeleton h-5 w-10 rounded-full" />
            </div>
            <div className="skeleton h-32 w-full rounded" />
            <div className="skeleton h-3 w-2/3" style={{ opacity: 0.5 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
