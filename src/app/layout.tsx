import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Roboto_Mono } from "next/font/google";
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

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
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
        <meta name="theme-color" content="#161210" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${robotoMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <nav className="tg-mono w-full flex justify-between items-center border-b border-[var(--tg-border)] bg-[var(--tg-bg-2)]/85 py-4 px-6 sticky top-0 z-40 backdrop-blur-md">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-base font-semibold text-[var(--tg-fg)] hover:text-[var(--tg-green)] transition-colors">
              <span className="text-[var(--tg-green)]">~/</span>ashley
            </Link>
          </div>
          <div className="flex gap-6 sm:gap-8 text-sm sm:text-base">
            <Link
              href="/about"
              className="text-[var(--tg-dim)] hover:text-[var(--tg-green)] transition-colors font-medium"
            >
              about
            </Link>
            <Link
              href="/projects"
              className="text-[var(--tg-dim)] hover:text-[var(--tg-green)] transition-colors font-medium"
            >
              projects
            </Link>
          </div>
        </nav>
        {children}
        <Footer />
      </body>
    </html>
  );
}
