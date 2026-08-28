import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import TitleBlock from "../components/TitleBlock";

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
        <meta name="theme-color" content="#e6dbc4" />
      </head>
      <body suppressHydrationWarning={true}>
        <div className="ps-sheet">
          <nav className="ps-nav">
            <div className="ps-nav-crumbs">
              <Link href="/" style={{ color: "var(--copper)" }}>
                A. Margetts
              </Link>
              <Link href="/about">About</Link>
              <Link href="/projects">Projects</Link>
            </div>
            <span className="ps-nav-note">Sheet 1 of 1</span>
          </nav>
          <div className="ps-canvas">{children}</div>
          <TitleBlock />
        </div>
      </body>
    </html>
  );
}
