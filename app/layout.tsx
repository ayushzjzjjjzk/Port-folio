import ThemeProvider from "@/components/ThemeProvider";
import ClientCursorProvider from "@/components/ClientCursorProvider";
import type { Metadata } from "next";
import { Dancing_Script, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://port-folio.vercel.app"),

  title: {
    default: "Ayush Ramola",
    template: "%s | Ayush Ramola",
  },

  description: "Explore my space or visit my portfolio",
  keywords: [
    "developer",
    "portfolio",
    "3D",
    "interactive",
    "three.js",
    "react",
    "open source",
  ],

  authors: [{ name: "Ayush Ramola" }],

  openGraph: {
    title: "Ayush Ramola",
    description: "Explore my space or visit my portfolio",
    type: "website",
    url: "/",
    siteName: "Ayush Ramola",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ayush Ramola - Portfolio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Ayush Ramola",
    description: "Explore my space or visit my portfolio",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistMono.variable} ${dancingScript.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
          <ClientCursorProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}