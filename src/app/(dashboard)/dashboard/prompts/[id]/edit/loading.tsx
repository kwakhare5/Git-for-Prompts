export default function EditPromptLoading() {
  return (
    <div className="space-y-6 font-sans">
      {/* Stacked Breadcrumb Header Skeleton */}
      <div className="border-b border-zinc-800/90 pb-5 space-y-2 font-mono">
        <div className="skeleton h-4 w-48" style={{ opacity: 0.6 }} />
        <div className="flex items-center gap-2">
          <div className="skeleton h-7 w-40" />
          <div className="skeleton h-5 w-8 rounded-full" />
        </div>
        <div className="skeleton h-3.5 w-56" style={{ opacity: 0.5 }} />
      </div>

      {/* Monaco Editor Container Skeleton */}
      <div
        className="skeleton"
        style={{ height: 'calc(100vh - 220px)', minHeight: 380 }}
      />
    </div>
  );
}
