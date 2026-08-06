import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

interface EmptyStateCta {
  href: string;
  label: string;
}

interface EmptyStateProps {
  /** Mono-font decorative icon/word shown at the top, e.g. "git init" or "v0" */
  icon: string;
  heading: string;
  description: string;
  cta?: EmptyStateCta;
}

/**
 * Standardised dashed-border empty state used across the dashboard.
 * Server component — no client interactivity.
 */
export function EmptyState({ icon, heading, description, cta }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 py-24 text-center font-sans">
      <div aria-hidden="true" className="font-mono text-4xl text-muted-foreground mb-4">
        {icon}
      </div>
      <h2 className="text-lg font-semibold text-foreground mb-2 font-sans">{heading}</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs font-sans">{description}</p>
      {cta && (
        <Link
          href={cta.href}
          className={buttonVariants({ size: 'sm', variant: 'default', className: 'shadow-sm font-sans cursor-pointer font-semibold' })}
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}
