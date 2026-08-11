export default function DiffLoading() {
  return (
    <div className="space-y-6 font-sans">
      {/* Header & Version Selectors Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-zinc-800/90 pb-5 gap-4">
        <div className="space-y-2 font-mono">
          <div className="skeleton h-4 w-48" style={{ opacity: 0.6 }} />
          <div className="skeleton h-7 w-36" />
          <div className="skeleton h-3.5 w-44" style={{ opacity: 0.5 }} />
        </div>

        {/* Version selectors skeleton */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="skeleton h-9 w-36" />
          <div className="skeleton h-4 w-4 rounded-full" style={{ opacity: 0.5 }} />
          <div className="skeleton h-9 w-36" />
        </div>
      </div>

      {/* Diff viewer container skeleton */}
      <div
        className="skeleton"
        style={{ height: 'calc(100vh - 240px)', minHeight: 380 }}
      />
    </div>
  );
}
