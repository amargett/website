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
  description: "Mechanical Engineering Graduate Student @ MIT - Robotics | Research | Design | Industry | Coursework | Activities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="w-full flex justify-between items-center border-b border-gray-200 dark:border-gray-700 bg-[#f5f3f0] dark:bg-[#2d3748] py-4 px-6 mb-8 sticky top-0 z-50 shadow-sm">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-[#d2691e] dark:text-[#e67e22] hover:text-[#b85a1a] dark:hover:text-[#d35400] transition-colors">
              AM
            </Link>
          </div>
          <div className="flex gap-4 sm:gap-6">
            <Link 
              href="/about" 
              className="px-3 sm:px-4 py-2 bg-[#4a7c59] dark:bg-[#68d391] text-white dark:text-gray-900 rounded-lg hover:bg-[#3d6b4a] dark:hover:bg-[#48bb78] transition-colors text-sm font-medium"
            >
              About Me
            </Link>
            <Link 
              href="/featured-projects" 
              className="px-3 sm:px-4 py-2 bg-[#d2691e] dark:bg-[#e67e22] text-white rounded-lg hover:bg-[#b85a1a] dark:hover:bg-[#d35400] transition-colors text-sm font-medium"
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
