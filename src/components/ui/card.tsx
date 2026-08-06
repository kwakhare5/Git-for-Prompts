import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverEffect = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-white/[0.08] bg-[#161616] text-white shadow-xl transition-all duration-200",
        hoverEffect && "hover:border-white/[0.14] hover:bg-[#1a1a1a]",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export { Card };

