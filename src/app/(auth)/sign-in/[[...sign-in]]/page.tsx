import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { clerkAppearance } from "@/lib/clerk-appearance";

export const metadata = { title: "Sign In" };

export default function SignInPage() {
  return (
    <>
      <SignIn appearance={clerkAppearance} />
      <p className="text-sm text-zinc-600">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="text-zinc-300 hover:text-zinc-50 transition-colors">
          Get started for free
        </Link>
      </p>
    </>
  );
}
