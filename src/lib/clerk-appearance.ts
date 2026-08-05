import { dark } from "@clerk/themes";

/**
 * Single source of truth for Clerk component appearance.
 * Aligned with Git for Prompts design system tokens (#111111, #161616, #f5f0eb).
 */
export const clerkAppearance = {
  baseTheme: dark,
  elements: {
    rootBox: "w-full flex justify-center",
    card: "bg-[#161616] border border-white/[0.08] shadow-2xl rounded-2xl p-6 font-sans",
    headerTitle: "text-[#f5f0eb] font-bold tracking-tight text-lg",
    headerSubtitle: "text-zinc-400 text-xs font-normal",
    formButtonPrimary:
      "bg-[#f5f0eb] text-zinc-950 hover:bg-white font-semibold transition-all active:scale-[0.98] shadow-sm text-xs py-2.5 rounded-xl",
    formFieldInput:
      "bg-[#0e0e0e] border-white/[0.08] text-[#f5f0eb] placeholder:text-zinc-600 focus:border-white/20 rounded-xl text-xs font-mono",
    formFieldLabel: "text-zinc-300 text-xs font-medium",
    footerActionLink: "text-zinc-300 hover:text-white font-medium transition-colors",
    identityPreviewText: "text-zinc-300 text-xs font-mono",
    identityPreviewEditButton: "text-zinc-400 hover:text-zinc-200 text-xs",
    dividerLine: "bg-white/[0.08]",
    dividerText: "text-zinc-500 text-[11px] font-mono uppercase tracking-widest",
    socialButtonsBlockButton:
      "border-white/[0.08] bg-[#111111] text-[#f5f0eb] hover:bg-white/[0.04] transition-all rounded-xl text-xs font-medium",
    socialButtonsBlockButtonText: "text-zinc-200 font-medium text-xs",
    alternativeMethodsBlockButton:
      "border-white/[0.08] bg-[#111111] text-[#f5f0eb] hover:bg-white/[0.04] rounded-xl text-xs",
  },
} as const;
