import * as React from "react";
import { StatusBadge, StatusBadgeVariant } from "./status-badge";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: {
    label: string;
    variant?: StatusBadgeVariant;
    icon?: React.ComponentType<{ className?: string }>;
  };
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  badge,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#f5f0eb] tracking-tight font-sans">
            {title}
          </h1>
          {badge && (
            <StatusBadge variant={badge.variant || "sky"} icon={badge.icon}>
              {badge.label}
            </StatusBadge>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-zinc-400 mt-1.5 font-sans leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {children && (
        <div className="flex items-center gap-2 shrink-0">
          {children}
        </div>
      )}
    </div>
  );
}
