

export function Logo({ className = '' }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src="/logo.svg"
      alt="Git for Prompts Logo"
      width={32}
      height={32}
      className={`h-8 w-8 select-none ${className}`}
    />
  );
}
