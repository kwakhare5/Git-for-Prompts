'use client';

import Link from 'next/link';

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
      className={`font-sans text-sm font-semibold text-zinc-100 hover:text-white transition-colors flex items-center gap-2.5 group select-none ${className ?? ''}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.svg"
        alt="Git for Prompts Logo"
        width={28}
        height={28}
        className="w-7 h-7 rounded-lg shrink-0 shadow-md group-hover:scale-105 transition-transform"
      />
      <div className="flex flex-col">
        <span className="font-extrabold text-sm text-zinc-100 tracking-tight leading-none font-sans">
          Git for Prompts
        </span>
        <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider font-semibold mt-0.5">
          PROMPT VCS
        </span>
      </div>
    </Link>
  );
}
