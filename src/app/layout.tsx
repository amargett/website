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
        <nav className="w-full flex justify-between items-center border-b border-gray-200 bg-white py-4 px-6 mb-8 sticky top-0 z-50 shadow-sm">
          <div className="flex gap-8 text-base font-medium text-gray-800">
            <Link href="/" className="text-xl font-bold text-[#d2691e] hover:text-[#b85a1a] transition-colors">
              AM
            </Link>
            <Link href="/research" className="hover:text-[#4a7c59] transition-colors">Research</Link>
            <Link href="/industry" className="hover:text-[#4a7c59] transition-colors">Industry</Link>
            <Link href="/coursework" className="hover:text-[#4a7c59] transition-colors">Coursework</Link>
            <Link href="/activities" className="hover:text-[#4a7c59] transition-colors">Activities</Link>
          </div>
          <div className="flex gap-6">
            <Link 
              href="/about" 
              className="px-4 py-2 bg-[#4a7c59] text-white rounded-lg hover:bg-[#3d6b4a] transition-colors text-sm font-medium"
            >
              About Me
            </Link>
            <Link 
              href="/featured-projects" 
              className="px-4 py-2 bg-[#d2691e] text-white rounded-lg hover:bg-[#b85a1a] transition-colors text-sm font-medium"
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
