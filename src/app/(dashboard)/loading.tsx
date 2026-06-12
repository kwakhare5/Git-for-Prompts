export default function DashboardLoading() {
  return (
    <div className="p-6 md:p-10 space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-48 rounded bg-zinc-800" />
        <div className="h-4 w-72 rounded bg-zinc-900" />
      </div>

      {/* Stats row skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-2"
          >
            <div className="h-3 w-20 rounded bg-zinc-800" />
            <div className="h-6 w-12 rounded bg-zinc-800" />
          </div>
        ))}
      </div>

      {/* Card grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 space-y-3"
          >
            <div className="h-4 w-3/4 rounded bg-zinc-800" />
            <div className="h-3 w-1/2 rounded bg-zinc-800" />
            <div className="h-3 w-1/3 rounded bg-zinc-800" />
          </div>
        ))}
      </div>
    </div>
  );
}
