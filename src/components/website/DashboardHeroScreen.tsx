import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { DashboardWorkspaceView } from '@/components/domain/dashboard/dashboard-workspace-view';

export function DashboardHeroScreen() {
  return (
    <section className="px-4 md:px-8 max-w-7xl mx-auto mt-6 mb-24 font-sans">
      <div className="bg-[#161619] rounded-2xl border border-zinc-800/90 shadow-2xl overflow-hidden">
        
        {/* Browser Top Window Bar */}
        <div className="bg-[#121214] text-zinc-300 px-4 py-3 flex items-center justify-between text-xs font-mono border-b border-zinc-800/90">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            </div>
            <div className="px-3 py-1 rounded-xl bg-[#1D1D22] border border-zinc-700/60 text-zinc-200 text-[11px]">
              https://gitforprompts.com/dashboard (Demo Workspace)
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-emerald-300 font-mono text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
            100% Interactive Demo
          </div>
        </div>

        {/* Replica App Layout Shell (Sidebar + Main Studio Workspace) */}
        <div className="flex flex-col md:flex-row min-h-[640px]">
          <DashboardSidebar isDemo={true} />
          <div className="flex-1 p-4 bg-[#121214] min-w-0">
            <DashboardWorkspaceView isDemo={true} isFullScreen={true} />
          </div>
        </div>

      </div>
    </section>
  );
}


