'use client';

import Link from 'next/link';
import { GitFork } from 'lucide-react';

interface BrandLogoProps {
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function BrandLogo({ href = '/', onClick, className }: BrandLogoProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`font-mono text-sm font-semibold text-[#f5f0eb] tracking-tight hover:text-zinc-300 transition-colors flex items-center gap-2.5 group select-none ${className ?? ''}`}
    >
      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-zinc-900 border border-white/10 group-hover:border-white/20 transition-colors shadow-inner shrink-0">
        <GitFork className="w-4 h-4 text-[#f5f0eb]" />
      </div>
      <div className="flex flex-col">
        <span className="font-extrabold text-sm text-[#f5f0eb] tracking-tight leading-none font-sans">
          Git for Prompts
        </span>
        <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-[0.2em] font-medium mt-0.5">
          PROMPT VCS
        </span>
      </div>
    </Link>
  );
}
