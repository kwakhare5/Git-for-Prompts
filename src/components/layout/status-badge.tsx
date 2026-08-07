import * as React from "react";
import { Badge } from "@/components/ui/badge";
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

export function StatusBadge({
  variant = "neutral",
  icon: Icon,
  children,
  className,
  ...props
}: StatusBadgeProps) {
  return (
    <Badge
      variant={variant}
      className={cn(
        "font-mono font-semibold h-auto px-2.5 py-0.5 gap-1.5 transition-all duration-150 ease-out hover:scale-[1.02]",
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      {children}
    </Badge>
  );
}

