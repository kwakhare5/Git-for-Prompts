import Link from 'next/link';
import { BrandLogo } from '@/components/layout/brand-logo';
import { StatusBadge } from '@/components/layout/status-badge';
import { Compass, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[70vh] p-6 bg-[#111111] font-sans select-none">
      <div className="w-full max-w-md p-8 rounded-2xl border border-white/[0.08] bg-[#161616] shadow-2xl flex flex-col items-center text-center space-y-6">
        <BrandLogo />

        <StatusBadge variant="sky" icon={Compass}>
          404 Not Found
        </StatusBadge>

        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-[#f5f0eb] tracking-tight">
            Prompt or Route Not Found
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
            The requested prompt bundle or subpage does not exist or has been moved.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[#f5f0eb] text-zinc-950 font-semibold text-xs hover:bg-white active:scale-[0.98] transition-all cursor-pointer shadow-sm"
        >
          <Home className="w-4 h-4 text-zinc-950" />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
