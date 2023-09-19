import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "D3JS Scattered Plot",
  description: "Scattered Plot to deal with mega data",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <Script src="https://unpkg.com/smiles-drawer@1.0.10/dist/smiles-drawer.min.js" />
    </html>
  );
}
