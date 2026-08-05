import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { clerkAppearance } from "@/lib/clerk-appearance";

export const metadata = { title: "Get Started · Git for Prompts" };

const hasClerkKeys = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

function GoogleIcon() {
  return (
    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function SignUpPage() {
  if (!hasClerkKeys) {
    return (
      <div className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl border border-white/[0.08] bg-[#161616] text-center space-y-5 max-w-md w-full font-sans select-none shadow-2xl">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[#f5f0eb] tracking-tight">Create your account</h2>
          <p className="text-xs text-zinc-400">Welcome! Create an account to get started.</p>
        </div>

        {/* Google OAuth Button */}
        <Link
          href="/dashboard"
          className="w-full py-2.5 px-4 rounded-xl border border-white/[0.08] bg-[#111111] hover:bg-white/[0.04] text-[#f5f0eb] text-xs font-semibold flex items-center justify-center transition-all active:scale-[0.98] shadow-sm"
        >
          <GoogleIcon />
          Continue with Google
        </Link>

        <div className="w-full flex items-center gap-3">
          <div className="flex-1 h-px bg-white/[0.08]" />
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-white/[0.08]" />
        </div>

        {/* Direct Local Dev Access */}
        <Link
          href="/dashboard"
          className="w-full py-2.5 rounded-xl bg-[#f5f0eb] text-zinc-950 font-semibold text-xs hover:bg-white transition-all active:scale-[0.98] shadow-sm"
        >
          Enter Workspace →
        </Link>

        <div className="pt-2 border-t border-white/[0.08] w-full text-[11px] text-zinc-500 font-mono">
          Local Dev Mode · Add Clerk keys to <code className="text-zinc-300">.env.local</code> for live OAuth
        </div>
      </div>
    );
  }

  return (
    <>
      <SignUp appearance={clerkAppearance} />
      <p className="text-xs font-mono text-zinc-400 mt-2">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-[#f5f0eb] hover:text-white font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </>
  );
}
