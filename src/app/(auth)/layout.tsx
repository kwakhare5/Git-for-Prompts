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

      <div className="relative z-10 flex w-full flex-col items-center gap-6 max-w-md my-8">
        {/* Branded Header Badge */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#202024] border border-zinc-700/80 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
            <svg className="w-4 h-4 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex items-center gap-2 font-mono">
            <span className="font-bold text-lg tracking-tight text-zinc-100">
              Git for Prompts
            </span>
            <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/20">
              FREE
            </span>
          </div>
        </Link>

        {/* Auth Canvas Container */}
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
