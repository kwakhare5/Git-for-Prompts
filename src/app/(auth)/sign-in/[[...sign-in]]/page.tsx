import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { ArrowRight, Lock } from "lucide-react";

export const metadata = { title: "Sign In · Git for Prompts" };

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

export default function SignInPage() {
  if (!hasClerkKeys) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-xl font-sans border-border bg-card">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground font-sans">
            Sign in to Git for Prompts
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground font-sans">
            Welcome back! Enter your credentials to access your prompt bundles.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 font-sans">
          {/* Email input field */}
          <div className="grid gap-2 text-left">
            <Label htmlFor="email">Work Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="developer@company.com"
              defaultValue="developer@gitforprompts.com"
              className="h-9 text-sm font-sans"
            />
          </div>

          {/* Password input field */}
          <div className="grid gap-2 text-left">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <span className="text-xs text-muted-foreground hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
            <Input
              id="password"
              type="password"
              defaultValue="••••••••••••"
              className="h-9 text-sm font-sans"
            />
          </div>

          {/* Enter Workspace Primary Action */}
          <Link href="/dashboard" className="w-full block mt-1">
            <Button variant="default" size="default" className="w-full justify-center">
              Enter Workspace
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2.5 text-muted-foreground font-medium">Or continue with</span>
            </div>
          </div>

          {/* Google OAuth Button */}
          <Link href="/dashboard" className="w-full block">
            <Button variant="outline" size="default" className="w-full justify-center">
              <GoogleIcon />
              Continue with Google
            </Button>
          </Link>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 font-sans border-t border-border pt-4 mt-2">
          <div className="rounded-lg border border-border bg-muted/50 p-3 text-xs text-muted-foreground font-sans leading-relaxed text-left flex items-start gap-2.5 w-full">
            <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="text-foreground font-semibold">Local Dev Mode:</strong> Add Clerk keys to{" "}
              <code className="font-mono text-foreground bg-background px-1.5 py-0.5 rounded border border-border">.env.local</code>{" "}
              for live OAuth.
            </div>
          </div>
          <p className="text-xs font-sans text-muted-foreground text-center">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-foreground hover:underline font-semibold transition-colors">
              Get started for free
            </Link>
          </p>
        </CardFooter>
      </Card>
    );
  }

  return (
    <>
      <SignIn appearance={clerkAppearance} path="/sign-in" routing="path" />
      <p className="text-xs font-sans text-muted-foreground mt-3 text-center">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="text-foreground hover:underline font-medium transition-colors">
          Get started for free
        </Link>
      </p>
    </>
  );
}
