import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { ArrowRight, Lock } from "lucide-react";

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
      <div className="w-full max-w-md mx-auto p-8 rounded-3xl border border-zinc-800/90 bg-bg-card shadow-2xl font-sans space-y-6">
        {/* Embedded Logo Header */}
        <div className="flex flex-col items-center text-center space-y-3 font-mono">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt="Git for Prompts Logo"
              width={36}
              height={36}
              className="w-9 h-9 rounded-xl shrink-0 shadow-md group-hover:scale-105 transition-transform"
            />
            <div className="flex items-center gap-2 font-mono">
              <span className="font-bold text-lg tracking-tight text-zinc-100">
                Git for Prompts
              </span>
              <span className="text-[10px] font-bold bg-zinc-100/10 text-zinc-100 px-2 py-0.5 rounded-md border border-zinc-700/80">
                LOCAL-FIRST VCS
              </span>
            </div>
          </Link>
          <div className="space-y-1 pt-1">
            <h1 className="text-xl font-bold text-zinc-100 font-mono tracking-tight">
              Create Your Account
            </h1>
            <p className="text-xs text-zinc-400 font-sans max-w-xs mx-auto leading-relaxed">
              Local-first prompt package manager for AI engineering.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Link href="/dashboard" className="w-full block">
            <button className="w-full flex items-center justify-center px-4 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl text-xs font-mono font-bold shadow-xs active:scale-97 transition-all cursor-pointer h-11">
              <GoogleIcon />
              Continue with Google
            </button>
          </Link>

          <div className="relative my-2 text-center text-[11px] text-zinc-500 font-mono flex items-center gap-3">
            <div className="h-px bg-zinc-800 flex-1" />
            <span>Or email</span>
            <div className="h-px bg-zinc-800 flex-1" />
          </div>

          <div className="space-y-1.5 text-left">
            <label htmlFor="email" className="text-xs font-mono font-bold text-zinc-300 block">Email</label>
            <input
              id="email"
              type="email"
              placeholder="developer@example.com"
              className="w-full rounded-xl border border-zinc-800 bg-bg-page px-3.5 py-2.5 text-xs text-zinc-100 outline-none font-mono focus:border-zinc-600 shadow-inner"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label htmlFor="password" className="text-xs font-mono font-bold text-zinc-300 block">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Create a strong password..."
              className="w-full rounded-xl border border-zinc-800 bg-bg-page px-3.5 py-2.5 text-xs text-zinc-100 outline-none font-mono focus:border-zinc-600 shadow-inner"
            />
          </div>

          <Link href="/dashboard" className="w-full block">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#202024] hover:bg-[#28282D] text-zinc-100 border border-zinc-700/80 rounded-xl text-xs font-mono font-bold shadow-xs active:scale-97 transition-all cursor-pointer h-11">
              <span>Create Account &amp; Enter Workspace</span>
              <ArrowRight className="w-4 h-4 text-zinc-400" />
            </button>
          </Link>

          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300 flex items-start gap-2 font-mono">
            <Lock className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <strong>Local Dev Mode:</strong> Add Clerk keys to <code className="font-mono bg-bg-page px-1 border border-zinc-800 rounded">.env.local</code>.
            </div>
          </div>

          <p className="text-xs text-zinc-400 text-center pt-2 font-sans">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-blue-300 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SignUp appearance={clerkAppearance} path="/sign-up" routing="path" />
      <p className="text-xs font-sans text-zinc-400 mt-4 text-center">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-blue-300 hover:underline font-semibold">
          Sign in
        </Link>
      </p>
    </>
  );
}
