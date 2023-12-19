"use client";

import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <Providers>
        <body className={inter.className}>{children}</body>
      </Providers>
    </html>
  );
}
