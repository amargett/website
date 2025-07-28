import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ashley Margetts - Portfolio",
  description: "Mechanical Engineering Graduate Student @ MIT - Robotics | Research | Design | Industry | Coursework | Extracurricular",
  // icons metadata removed to let icon.tsx handle it
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#475569" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="w-full flex justify-between items-center border-b border-[#475569]/10 bg-white/80 dark:bg-[#0f172a]/80 py-4 px-6 mb-8 sticky top-0 z-40 backdrop-blur-md cosmic-surface">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-[#475569] hover:text-[#3b82f6] transition-colors">
              AM
            </Link>
          </div>
          <div className="flex gap-6 sm:gap-8">
            <Link 
              href="/about" 
              className="text-[#374151] dark:text-[#e5e7eb] hover:text-[#3b82f6] transition-colors text-sm font-medium"
            >
              About Me
            </Link>
            <Link 
              href="/projects" 
              className="text-[#374151] dark:text-[#e5e7eb] hover:text-[#3b82f6] transition-colors text-sm font-medium"
            >
              Projects
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
