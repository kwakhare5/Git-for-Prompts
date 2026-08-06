import { BrandLogo } from '@/components/layout/brand-logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background text-foreground px-4 font-sans">
      <div className="pointer-events-none absolute w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-3xl" />

      <div className="relative z-10 flex w-full flex-col items-center gap-6 max-w-md">
        <BrandLogo href="/" />
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
