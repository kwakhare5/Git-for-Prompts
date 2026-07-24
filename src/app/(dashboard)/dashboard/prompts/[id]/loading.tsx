// Skeleton for /dashboard/prompts/[id] — mirrors crumb + action buttons + editor/history grid
export default function PromptDetailLoading() {
  return (
    <div className="p-4 sm:p-8">
      {/* Header: crumb | name + actions */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="skeleton h-4 w-16 shrink-0" style={{ opacity: 0.6 }} />
          <div className="w-px h-4 bg-zinc-800 shrink-0" />
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="skeleton h-6 w-40" />
              <div className="skeleton h-5 w-7 rounded-full shrink-0" />
            </div>
            <div className="skeleton h-3.5 w-56" style={{ opacity: 0.5 }} />
          </div>
        </div>
        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="skeleton h-8 w-12 rounded-md" />
          <div className="skeleton h-8 w-16 rounded-md" />
          <div className="skeleton h-8 w-14 rounded-md" />
          <div className="skeleton h-9 w-28 rounded-md" />
        </div>
      </div>

      {/* Two-col: editor left + history right */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Editor */}
        <div className="skeleton rounded-lg" style={{ height: 'calc(100vh - 260px)', minHeight: 320 }} />
        {/* Version history sidebar */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="skeleton h-4 w-28" />
            <div className="skeleton h-3 w-12" style={{ opacity: 0.5 }} />
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 space-y-2"
              style={{ opacity: Math.max(0.2, 1 - i * 0.18) }}
            >
              <div className="flex items-start gap-3">
                <div className="skeleton h-5 w-7 rounded shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="skeleton h-4 w-3/4" />
                  <div className="skeleton h-3 w-1/2" style={{ opacity: 0.6 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
