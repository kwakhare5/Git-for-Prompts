import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk-appearance";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const viewport: Viewport = {
  themeColor: '#09090b',
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  metadataBase: new URL("https://gitforprompts.vercel.app"),
  title: {
    default: 'Git for Prompts',
    template: '%s · Git for Prompts',
  },
  description:
    'Version control for AI prompts. Manage, version, diff, and test your prompts with a GitHub-inspired workflow.',
  keywords: ['prompt engineering', 'AI prompts', 'version control', 'LLM', 'prompt management'],
  authors: [{ name: 'Git for Prompts' }],
  creator: 'Git for Prompts',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: "https://gitforprompts.vercel.app",
    siteName: 'Git for Prompts',
    title: 'Git for Prompts — Version control for AI prompts',
    description:
      'Manage, version, diff, and test your AI prompts with a GitHub-inspired workflow.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Git for Prompts',
    description: 'Version control for AI prompts.',
    creator: '@gitforprompts',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

import { Toaster } from "sonner";
import { CommandMenu } from "@/components/command-menu";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      style={{ colorScheme: 'dark' }}
      suppressHydrationWarning
    >
      <body 
        className="min-h-full flex flex-col bg-zinc-950 text-zinc-50 font-sans selection:bg-zinc-800"
        suppressHydrationWarning
      >
        {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
          <ClerkProvider appearance={clerkAppearance}>
            <TooltipProvider>{children}</TooltipProvider>
            <CommandMenu />
            <Toaster position="bottom-right" theme="dark" richColors />
            <Analytics />
          </ClerkProvider>
        ) : (
          <>
            <TooltipProvider>{children}</TooltipProvider>
            <CommandMenu />
            <Toaster position="bottom-right" theme="dark" richColors />
            <Analytics />
          </>
        )}
      </body>
    </html>
  );
}
