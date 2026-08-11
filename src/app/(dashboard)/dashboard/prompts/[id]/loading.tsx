export default function PromptDetailLoading() {
  return (
    <div className="space-y-6 font-sans">
      {/* Header & Subnav Skeleton */}
      <div className="border-b border-zinc-800/90 pb-5 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="skeleton h-7 w-48" />
            <div className="skeleton h-4 w-64" style={{ opacity: 0.5 }} />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="skeleton h-8 w-20" />
            <div className="skeleton h-8 w-24" />
          </div>
        </div>

        {/* Studio Subnav Tabs Skeleton */}
        <div className="flex items-center gap-2 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton h-8 w-24" style={{ opacity: 1 - i * 0.12 }} />
          ))}
        </div>
      </div>

      {/* Two-col layout: Editor left + Version History right */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6 items-start">
        <div className="skeleton" style={{ height: 'calc(100vh - 280px)', minHeight: 360 }} />
        <div className="space-y-3 font-mono">
          <div className="flex items-center justify-between">
            <div className="skeleton h-4 w-28" />
            <div className="skeleton h-4 w-12" style={{ opacity: 0.5 }} />
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-zinc-800/90 bg-bg-card p-4 space-y-2"
              style={{ opacity: Math.max(0.3, 1 - i * 0.18) }}
            >
              <div className="flex items-start gap-3">
                <div className="skeleton h-5 w-8 shrink-0" />
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
