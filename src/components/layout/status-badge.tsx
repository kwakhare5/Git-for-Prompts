import * as React from "react";
import { cn } from "@/lib/utils";

export type StatusBadgeVariant =
  | "sky"
  | "emerald"
  | "rose"
  | "amber"
  | "violet"
  | "neutral";

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: StatusBadgeVariant;
  icon?: React.ComponentType<{ className?: string }>;
}

const variantStyles: Record<StatusBadgeVariant, string> = {
  sky: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  amber: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  neutral: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({
  variant = "neutral",
  icon: Icon,
  children,
  className,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold border shrink-0 transition-all duration-150 ease-out hover:scale-[1.02]",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      {children}
    </span>
  );
}
