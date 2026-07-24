// Skeleton for /dashboard/prompts/[id]/diff — mirrors crumb + version selectors + diff viewer
export default function DiffLoading() {
  return (
    <div className="p-4 sm:p-8">
      {/* Header row */}
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <div className="skeleton h-4 w-28" style={{ opacity: 0.6 }} />
          <div className="w-px h-4 bg-zinc-800 shrink-0" />
          <div className="space-y-1">
            <div className="skeleton h-6 w-36" />
            <div className="skeleton h-3 w-28" style={{ opacity: 0.5 }} />
          </div>
        </div>
        {/* Version selector row */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="skeleton h-9 w-36 rounded-md" />
          <div className="skeleton h-4 w-4 rounded-full" style={{ opacity: 0.5 }} />
          <div className="skeleton h-9 w-36 rounded-md" />
        </div>
      </div>
      {/* Diff viewer */}
      <div
        className="skeleton rounded-lg"
        style={{ height: 'calc(100vh - 240px)', minHeight: 360 }}
      />
    </div>
  );
}
