export default function ExploreLoading() {
  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-zinc-800/90 pb-5 space-y-2">
        <div className="skeleton h-7 w-40" />
        <div className="skeleton h-4 w-72" style={{ opacity: 0.55 }} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[75, 60, 80, 50, 70, 65].map((w, i) => (
          <div
            key={i}
            className="rounded-2xl border border-zinc-800/90 bg-bg-card p-5 flex flex-col gap-3 shadow-xl"
            style={{ opacity: Math.max(0.3, 1 - i * 0.1) }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="skeleton h-4 flex-1" style={{ maxWidth: `${w}%` }} />
              <div className="skeleton h-5 w-8 shrink-0" />
            </div>
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-4/5" style={{ opacity: 0.7 }} />
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-800/60">
              <div className="skeleton h-3 w-14" />
              <div className="skeleton h-7 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
