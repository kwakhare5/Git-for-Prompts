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

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://gitforprompts.vercel.app';
const VALID_BASE_URL = BASE_URL.startsWith('http') ? BASE_URL : `https://${BASE_URL}`;


export const viewport: Viewport = {
  themeColor: '#09090b',
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  metadataBase: new URL(VALID_BASE_URL),
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
    url: BASE_URL,
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
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

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
        <ClerkProvider appearance={clerkAppearance}>
          <TooltipProvider>{children}</TooltipProvider>
          <Analytics />
        </ClerkProvider>
      </body>
    </html>
  );
}
