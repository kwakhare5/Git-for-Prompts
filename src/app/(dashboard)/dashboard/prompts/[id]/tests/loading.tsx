// Skeleton for /dashboard/prompts/[id]/tests — mirrors crumb + TestRunner
export default function TestsLoading() {
  return (
    <div className="p-4 sm:p-8">
      {/* Crumb + title */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="skeleton h-4 w-28" style={{ opacity: 0.6 }} />
          <div className="w-px h-4 bg-zinc-800" />
          <div className="skeleton h-6 w-24" />
          <div className="skeleton h-5 w-10 rounded-full" style={{ opacity: 0.6 }} />
        </div>
      </div>
      {/* Version selector row */}
      <div className="flex items-center gap-3 mb-6">
        <div className="skeleton h-4 w-20" style={{ opacity: 0.6 }} />
        <div className="skeleton h-9 w-48 rounded-md" />
        <div className="skeleton h-9 w-24 rounded-md ml-auto" />
      </div>
      {/* Test case cards */}
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3"
            style={{ opacity: Math.max(0.25, 1 - i * 0.2) }}
          >
            <div className="flex items-center justify-between">
              <div className="skeleton h-4 w-40" />
              <div className="skeleton h-5 w-16 rounded-full" />
            </div>
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-3/4" style={{ opacity: 0.6 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
