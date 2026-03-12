import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "@/components/ui/sonner";
import Link from "next/form";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevLog - Developer Learning Journal & Project Tracker",
  description: "Track your projects, learning entries, and resources.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 min-h-screen flex`}
      >
        <Providers>
          <Sidebar />
          <main className="flex-1 p-6 lg:p-10 ml-0 lg:ml-64 transition-all duration-300 relative">
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
