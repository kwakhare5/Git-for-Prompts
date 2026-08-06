import { dark } from "@clerk/themes";

/**
 * Single source of truth for Clerk component appearance.
 * Aligned with Git for Prompts design system tokens (#111111, #161616, #f5f0eb).
 */
export const clerkAppearance = {
  baseTheme: dark,
  elements: {
    rootBox: "w-full flex justify-center",
    card: "bg-card border border-border shadow-sm rounded-xl p-6 font-sans text-card-foreground w-full",
    headerTitle: "text-foreground font-bold tracking-tight text-xl font-sans",
    headerSubtitle: "text-muted-foreground text-sm font-sans",
    formButtonPrimary:
      "bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-all shadow-xs text-sm py-2 px-4 rounded-md font-sans h-9 cursor-pointer",
    formFieldInput:
      "bg-transparent border border-input text-foreground placeholder:text-muted-foreground focus:border-ring rounded-md text-sm font-sans h-9 px-3",
    formFieldLabel: "text-foreground text-sm font-medium font-sans",
    footerActionLink: "text-foreground hover:underline font-medium transition-colors font-sans text-sm",
    identityPreviewText: "text-foreground text-sm font-sans",
    identityPreviewEditButton: "text-muted-foreground hover:text-foreground text-sm font-sans",
    dividerLine: "bg-border",
    dividerText: "text-muted-foreground text-xs font-sans uppercase font-medium",
    socialButtonsBlockButton:
      "border border-border bg-background text-foreground hover:bg-accent transition-all rounded-md text-sm font-medium font-sans h-9 px-4 cursor-pointer",
    socialButtonsBlockButtonText: "text-foreground font-medium text-sm font-sans",
    alternativeMethodsBlockButton:
      "border border-border bg-background text-foreground hover:bg-accent rounded-md text-sm font-sans h-9 cursor-pointer",
  },
} as const;
