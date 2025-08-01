import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ashley Margetts",
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
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <nav className="w-full flex justify-between items-center border-b border-[#475569]/10 bg-white dark:bg-white py-4 px-6 sticky top-0 z-40 backdrop-blur-md">
          <div className="flex items-center">
            <Link href="/" className="flex items-center text-base font-semibold text-[#475569] hover:text-[#3b82f6] transition-colors">
              <div 
                className="mr-2 w-6 h-6 rounded-lg"
                style={{
                  background: 'radial-gradient(circle at top right, #ea580c 0%, #f97316 15%, #fb923c 30%, #e0f2fe 30%, #e0f2fe 50%, #0a4a5a 100%)'
                }}
              />
              AM
            </Link>
          </div>
          <div className="flex gap-6 sm:gap-8">
            <Link 
              href="/about" 
              className="text-[#374151] dark:text-[#374151] hover:text-[#3b82f6] transition-colors text-base font-medium"
            >
              About
            </Link>
            <Link 
              href="/projects" 
              className="text-[#374151] dark:text-[#374151] hover:text-[#3b82f6] transition-colors text-base font-medium"
            >
              Projects
            </Link>
          </div>
        </nav>
        {children}
        <Footer />
      </body>
    </html>
  );
}
