import Link from 'next/link';

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
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 py-24 text-center">
      <div aria-hidden="true" className="font-mono text-4xl text-zinc-700 mb-4">
        {icon}
      </div>
      <h2 className="text-lg font-semibold text-zinc-300 mb-2">{heading}</h2>
      <p className="text-sm text-zinc-500 mb-6 max-w-xs">{description}</p>
      {cta && (
        <Link
          href={cta.href}
          className="inline-flex items-center gap-2 rounded-md bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-200 transition-colors"
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}
