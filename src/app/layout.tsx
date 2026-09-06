import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  preload: true,
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://gitforprompts.vercel.app"),
  title: {
    default: "Git for Prompts · Local-First Prompt Version Control",
    template: "%s · Git for Prompts",
  },
  description: "Local-first prompt package manager and version control for AI engineering. Treat your prompts like production code.",
  keywords: [
    "Git for Prompts",
    "Prompt Engineering",
    "Prompt Version Control",
    "AI Engineering",
    "LLM Prompts",
    "Local-First VCS",
  ],
  authors: [{ name: "Git for Prompts Team" }],
  creator: "Git for Prompts",
  publisher: "Git for Prompts",
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/logo.svg", sizes: "any", type: "image/svg+xml" }],
  },
  alternates: {
    canonical: "https://gitforprompts.vercel.app",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gitforprompts.vercel.app",
    siteName: "Git for Prompts",
    title: "Git for Prompts · Local-First Prompt Version Control",
    description: "Local-first prompt package manager and version control for AI engineering. Treat your prompts like production code.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Git for Prompts — Local-First VCS for AI Prompts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Git for Prompts · Local-First Prompt Version Control",
    description: "Local-first prompt package manager and version control for AI engineering. Treat your prompts like production code.",
    images: ["/opengraph-image"],
    creator: "@gitforprompts",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "XSkLpDVzfOoqfrH0Te2qtiwn9hcFgkre7xwviSaDWKY",
  },
};

import { Navbar } from "@/components/website/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <>
      <Navbar />
      {children}
      <Toaster position="bottom-right" />
      <Analytics />
      <SpeedInsights />
    </>
  );

  return (
    <html lang="en" className={`${instrumentSerif.variable} ${plusJakartaSans.variable}`}>
      <body className="min-h-screen bg-bg-page text-zinc-100 font-sans selection:bg-zinc-100/20 selection:text-zinc-100">
        {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
          <ClerkProvider>{content}</ClerkProvider>
        ) : (
          content
        )}
      </body>
    </html>
  );
}
