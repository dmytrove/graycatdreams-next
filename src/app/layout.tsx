import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import type { Metadata, Viewport } from "next/types";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GrayCAT Dreams - 3D Image Animations",
  description: "Create beautiful 3D animations with your images using WebGL and Three.js",
  keywords: ["3D animation", "image gallery", "WebGL", "Three.js", "interactive art"],
  authors: [{ name: "GrayCAT Dreams" }],
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111111",
};

import Link from 'next/link';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#111111" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div id="root">
          {children}
        </div>
        
        {/* Small admin link in the footer */}
        <div style={{ 
          position: 'fixed', 
          bottom: '10px', 
          right: '10px', 
          fontSize: '12px', 
          opacity: 0.3 
        }}>
          <Link href="/admin" title="Admin Access" style={{ color: 'inherit', textDecoration: 'none' }}>
            •••
          </Link>
        </div>
      </body>
    </html>
  );
}
