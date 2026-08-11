export default function NewPromptLoading() {
  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-zinc-800/90 pb-5 space-y-2">
        <div className="skeleton h-3 w-16" style={{ opacity: 0.5 }} />
        <div className="skeleton h-7 w-32" />
        <div className="skeleton h-4 w-56" style={{ opacity: 0.55 }} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
        {/* Left: form card skeleton */}
        <div className="rounded-2xl border border-zinc-800/90 bg-bg-card p-6 space-y-6 shadow-xl">
          <div className="space-y-2">
            <div className="skeleton h-3.5 w-16" />
            <div className="skeleton h-10 w-full" />
          </div>
          <div className="space-y-2">
            <div className="skeleton h-3.5 w-24" />
            <div className="skeleton h-24 w-full" />
          </div>
          <div className="flex gap-3 pt-2">
            <div className="skeleton h-9 w-32" />
            <div className="skeleton h-9 w-20" style={{ opacity: 0.4 }} />
          </div>
        </div>

        {/* Right: reference panels skeleton */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-800/90 bg-bg-card p-5 space-y-3 shadow-xl">
            <div className="skeleton h-4 w-32" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-3 w-full" style={{ opacity: 1 - i * 0.12 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
