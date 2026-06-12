import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { clerkAppearance } from "@/lib/clerk-appearance";

export const metadata = { title: "Get Started" };

export default function SignUpPage() {
  return (
    <>
      <SignUp appearance={clerkAppearance} />
      <p className="text-sm text-zinc-600">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-zinc-300 hover:text-zinc-50 transition-colors">
          Sign in
        </Link>
      </p>
    </>
  );
}
