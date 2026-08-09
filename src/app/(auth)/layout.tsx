import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#121214] text-zinc-100 px-4 font-sans selection:bg-blue-500/20 selection:text-blue-200">
      {/* Glow Ambient Blur */}
      <div className="pointer-events-none absolute w-[450px] h-[450px] bg-blue-500/5 rounded-full blur-3xl -z-0" />

      <div className="relative z-10 flex w-full flex-col items-center gap-4 max-w-md my-8">
        {/* Navigation Back Link */}
        <Link
          href="/"
          className="text-xs font-mono text-zinc-400 hover:text-zinc-100 transition-colors flex items-center gap-1.5 self-start px-1"
        >
          <span>←</span>
          <span>Back to Home</span>
        </Link>

        {/* Auth Canvas Container */}
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
