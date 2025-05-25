import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
// import { Metadata, Viewport } from "next";
import type { Metadata, Viewport } from "next/types";
// import { AppErrorBoundary } from "@/components/ErrorBoundary";

// Initialize monitoring on client side
if (typeof window !== 'undefined') {
  // Dynamic import to avoid SSR issues
  import('@/lib/monitoring').then(() => {
    console.log('Production monitoring initialized');
  });
}

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        
        {/* Performance hints for browser */}
        <link rel="preconnect" href="https://pub-7b860cf9a8554e759d05d06688f078b0.r2.dev" />
        <link rel="dns-prefetch" href="https://pub-7b860cf9a8554e759d05d06688f078b0.r2.dev" />
      </body>
    </html>
  );
}
