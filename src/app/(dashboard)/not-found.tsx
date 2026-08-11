import Link from 'next/link';
import { BrandLogo } from '@/components/layout/brand-logo';
import { Compass, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[70vh] p-6 font-sans select-none">
      <div className="w-full max-w-md p-8 rounded-2xl border border-zinc-800/90 bg-bg-card shadow-2xl flex flex-col items-center text-center space-y-6">
        <BrandLogo />

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs font-mono font-bold">
          <Compass className="w-3.5 h-3.5" />
          <span>404 Not Found</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold font-mono text-zinc-100">
            Prompt or Route Not Found
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
            The requested prompt repository bundle or subpage does not exist or has been moved.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-mono font-bold text-xs shadow-xs btn-interactive"
        >
          <Home className="w-4 h-4 text-zinc-950" />
          Return to Workspace
        </Link>
      </div>
    </div>
  );
}
