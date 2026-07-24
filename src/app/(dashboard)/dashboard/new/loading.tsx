// Skeleton for /dashboard/new — mirrors two-column form + tips layout
export default function NewPromptLoading() {
  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8 space-y-2">
        <div className="skeleton h-3 w-16" style={{ opacity: 0.5 }} />
        <div className="skeleton h-7 w-32" />
        <div className="skeleton h-4 w-56" style={{ opacity: 0.55 }} />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px] lg:items-start">
        {/* Left: form card */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6">
          <div className="space-y-2">
            <div className="skeleton h-3.5 w-12" />
            <div className="skeleton h-10 w-full" />
          </div>
          <div className="space-y-2">
            <div className="skeleton h-3.5 w-20" />
            <div className="skeleton h-20 w-full" />
          </div>
          <div className="flex gap-3 pt-1">
            <div className="skeleton h-9 w-28" />
            <div className="skeleton h-9 w-16" style={{ opacity: 0.4 }} />
          </div>
        </div>
        {/* Right: tip panels */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
            <div className="skeleton h-4 w-32" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-3 w-full" style={{ opacity: 1 - i * 0.12 }} />
            ))}
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
            <div className="skeleton h-4 w-24" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-3 w-full" style={{ opacity: 1 - i * 0.15 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
