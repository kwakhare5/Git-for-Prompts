import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gitforprompts.vercel.app"),
  title: {
    default: 'Git for Prompts',
    template: '%s · Git for Prompts',
  },
  description: 'Version control for AI prompts.',
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
};

import { Navbar } from "@/components/website/Navbar";
import { auth } from "@clerk/nextjs/server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let userId: string | null = null;
  try {
    const authState = await auth();
    userId = authState.userId;
  } catch {
    userId = null;
  }

  const content = (
    <>
      <Navbar userId={userId} />
      {children}
      <Toaster position="bottom-right" />
      <Analytics />
    </>
  );

  return (
    <html lang="en" className={`${instrumentSerif.variable} ${plusJakartaSans.variable}`}>
      <body className="min-h-screen bg-[#121214] text-zinc-100 font-sans selection:bg-blue-500/20 selection:text-blue-200">
        {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
          <ClerkProvider>{content}</ClerkProvider>
        ) : (
          content
        )}
      </body>
    </html>
  );
}
