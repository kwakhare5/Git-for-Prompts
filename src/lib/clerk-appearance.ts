import { dark } from "@clerk/themes";

/**
 * Single source of truth for Clerk component appearance.
 * Used by both <SignIn /> and <SignUp /> to ensure identical dark-theme styling.
 */
export const clerkAppearance = {
  baseTheme: dark,
  elements: {
    rootBox: "w-full flex justify-center",
    card: "bg-zinc-900 border border-zinc-800 shadow-2xl rounded-xl",
    headerTitle: "text-zinc-50 font-semibold",
    headerSubtitle: "text-zinc-400",
    formButtonPrimary:
      "bg-zinc-50 text-zinc-950 hover:bg-zinc-200 font-medium transition-colors",
    formFieldInput:
      "bg-zinc-950 border-zinc-700 text-zinc-50 placeholder:text-zinc-600 focus:border-zinc-500",
    formFieldLabel: "text-zinc-300",
    footerActionLink: "text-zinc-300 hover:text-zinc-50",
    identityPreviewText: "text-zinc-300",
    identityPreviewEditButton: "text-zinc-400 hover:text-zinc-200",
    dividerLine: "bg-zinc-800",
    dividerText: "text-zinc-500",
    socialButtonsBlockButton:
      "border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 transition-colors",
    socialButtonsBlockButtonText: "text-zinc-300",
    alternativeMethodsBlockButton:
      "border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800",
  },
} as const;
