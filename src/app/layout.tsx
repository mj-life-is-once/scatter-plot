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
      {/* include polyfills for custom event, Symbol and Custom Elements */}
      <Script src="//unpkg.com/babel-polyfill@6.26.0/dist/polyfill.js" />
      <Script src="//unpkg.com/custom-event-polyfill@0.3.0/custom-event-polyfill.js" />
      <Script src="//cdnjs.cloudflare.com/ajax/libs/document-register-element/1.8.0/document-register-element.js" />
      <body className={inter.className}>{children}</body>
      {/* <Script src="https://unpkg.com/smiles-drawer@1.0.10/dist/smiles-drawer.min.js" /> */}
    </html>
  );
}
