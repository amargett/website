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
              <span className="flex items-center justify-center w-7 h-7 rounded-md ring-1 ring-[var(--tg-border)] bg-[var(--tg-bg)]">
                <svg width="20" height="20" viewBox="0 0 32 32" aria-hidden="true">
                  <g fill="none" stroke="#7f9a52" strokeLinecap="round" strokeLinejoin="round">
                    <path strokeWidth="1.7" d="M16 31 V20" />
                    <path strokeWidth="1.6" d="M16 20 C16 16 16 11 16 6" />
                    <path strokeWidth="1.6" d="M16 20 C13.5 18 12 16 11 14" />
                    <path strokeWidth="1.6" d="M16 20 C18.5 18 20 16 21 14" />
                    <path strokeWidth="1.2" d="M11 14 C10.5 11.5 10.5 9 10 7" />
                    <path strokeWidth="1.2" d="M11 14 C9 13 7 12 5 11" />
                    <path strokeWidth="1.2" d="M21 14 C21.5 11.5 21.5 9 22 7" />
                    <path strokeWidth="1.2" d="M21 14 C23 13 25 12 27 11" />
                  </g>
                  <g stroke="#161210" strokeWidth="0.6">
                    <circle cx="16" cy="5.5" r="2.4" fill="#e2983f" />
                    <circle cx="10" cy="6.5" r="1.9" fill="#cf6a34" />
                    <circle cx="22" cy="6.5" r="1.9" fill="#96b85f" />
                    <circle cx="5" cy="11" r="1.9" fill="#57a99b" />
                    <circle cx="27" cy="11" r="1.9" fill="#57a99b" />
                    <circle cx="11" cy="14" r="1.4" fill="#96b85f" />
                    <circle cx="21" cy="14" r="1.4" fill="#96b85f" />
                  </g>
                </svg>
              </span>
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
