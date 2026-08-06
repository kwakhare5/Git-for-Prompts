import { Topbar } from "@/components/layout/topbar";

export default function DashboardLoading() {
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#111111] animate-in fade-in duration-150">
      <Topbar />

      <div className="p-6 lg:p-8 space-y-8 select-none font-sans max-w-7xl w-full mx-auto">
        {/* Header Shimmer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="skeleton h-8 w-44 rounded-xl" />
              <div className="skeleton h-5 w-24 rounded-full" />
            </div>
            <div className="skeleton h-4 w-72 rounded-lg" style={{ opacity: 0.6 }} />
          </div>
          <div className="skeleton h-10 w-36 rounded-xl shrink-0" />
        </div>

        {/* 4 Stat Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border border-white/[0.08] bg-[#161616] space-y-3 shadow-sm"
              style={{ opacity: Math.max(0.4, 1 - (i - 1) * 0.15) }}
            >
              <div className="flex items-center justify-between">
                <div className="skeleton h-3 w-20 rounded-md" />
                <div className="skeleton h-8 w-8 rounded-xl" />
              </div>
              <div className="skeleton h-8 w-12 rounded-lg" />
              <div className="skeleton h-3 w-32 rounded-md" style={{ opacity: 0.5 }} />
            </div>
          ))}
        </div>

        {/* Prompt Table Skeleton */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="skeleton h-4 w-48 rounded-md" />
            <div className="skeleton h-4 w-24 rounded-md" />
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#161616] overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/[0.08] bg-[#141414]">
              <div className="skeleton h-3 w-28 rounded-md" />
              <div className="skeleton h-3 w-16 rounded-md" />
            </div>

            {[75, 55, 65, 45, 60].map((width, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] last:border-b-0"
                style={{ opacity: Math.max(0.2, 1 - i * 0.16) }}
              >
                <div className="space-y-2 flex-1 max-w-sm">
                  <div className="flex items-center gap-2">
                    <div className="skeleton h-4 rounded-md" style={{ width: `${width}%` }} />
                    <div className="skeleton h-4 w-10 rounded-full" />
                  </div>
                  <div className="skeleton h-3 w-40 rounded-md" style={{ opacity: 0.5 }} />
                </div>
                <div className="skeleton h-5 w-16 rounded-full hidden sm:block" />
                <div className="skeleton h-3 w-20 rounded-md hidden md:block" />
                <div className="skeleton h-7 w-20 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
