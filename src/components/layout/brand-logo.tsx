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
      className={`font-sans text-sm font-semibold text-foreground hover:text-muted-foreground transition-colors flex items-center gap-2.5 group select-none ${className ?? ''}`}
    >
      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-muted border border-border group-hover:border-primary/40 transition-colors shadow-inner shrink-0">
        <GitFork className="w-4 h-4 text-foreground" />
      </div>
      <div className="flex flex-col">
        <span className="font-extrabold text-sm text-foreground tracking-tight leading-none font-sans">
          Git for Prompts
        </span>
        <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider font-semibold mt-0.5">
          PROMPT VCS
        </span>
      </div>
    </Link>
  );
}
