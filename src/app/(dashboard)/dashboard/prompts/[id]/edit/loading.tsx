// Skeleton for /dashboard/prompts/[id]/edit — mirrors crumb + full-height Monaco editor
export default function EditPromptLoading() {
  return (
    <div className="p-4 sm:p-8">
      {/* Crumb breadcrumb */}
      <div className="flex items-center gap-3 mb-6">
        <div className="skeleton h-4 w-28" style={{ opacity: 0.6 }} />
        <div className="w-px h-4 bg-zinc-800" />
        <div className="space-y-1">
          <div className="skeleton h-6 w-40" />
          <div className="skeleton h-3 w-32" style={{ opacity: 0.5 }} />
        </div>
      </div>
      {/* Full-height editor block */}
      <div
        className="skeleton rounded-lg"
        style={{ height: 'calc(100vh - 200px)', minHeight: 400 }}
      />
    </div>
  );
}
