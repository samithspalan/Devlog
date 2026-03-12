import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "@/components/ui/sonner";
import Sidebar from "@/components/Sidebar";
import ParticleBackground from "@/components/ParticleBackground";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevLog - Premium Developer Tracker",
  description: "Track your projects, learning entries, and resources.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased min-h-screen flex selection:bg-purple-500/30 selection:text-purple-200`}
        >
          <Providers>
            <div className="fixed inset-0 z-[-1] bg-background">
              <ParticleBackground />
            </div>

            <div className="flex w-full relative z-10 mx-auto max-w-[1920px]">
              <Sidebar />
              <main className="flex-1 p-6 lg:p-12 ml-0 lg:ml-72 transition-all duration-500 relative min-h-screen">
                {children}
              </main>
            </div>
            <Toaster
              toastOptions={{
                className: "dark:bg-zinc-900/80 dark:backdrop-blur-xl dark:border-zinc-800 dark:text-white"
              }}
            />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
