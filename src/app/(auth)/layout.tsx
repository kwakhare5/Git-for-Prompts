import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      {/* Subtle dot-grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 flex w-full flex-col items-center gap-8">
        {/* Shared branding header */}
        <div className="text-center space-y-1">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-zinc-50 hover:text-zinc-300 transition-colors"
          >
            Git for Prompts
          </Link>
        </div>

        {/* Page-specific content (Clerk card + footer link) */}
        {children}
      </div>
    </div>
  );
}
