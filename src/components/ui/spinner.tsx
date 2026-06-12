import { cn } from '@/lib/utils';

interface SpinnerProps {
  /** Tailwind size classes — defaults to 3×3 (12px) */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'h-3 w-3 border-2',
  md: 'h-4 w-4 border-2',
  lg: 'h-6 w-6 border-2',
};

/**
 * Inline CSS-only loading spinner.
 * Uses animate-spin with a transparent top border on a zinc border ring.
 */
export function Spinner({ size = 'sm', className }: SpinnerProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-block rounded-full border-zinc-600 border-t-transparent animate-spin',
        sizeMap[size],
        className
      )}
    />
  );
}
