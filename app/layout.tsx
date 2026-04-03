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
  title: "knightkun",
  description: "explore my space or visit my portfolio",
  keywords: ["developer", "portfolio", "3D", "interactive", "three.js", "react", "open source"],
  authors: [{ name: "Pranav Ray" }],
  openGraph: {
    title: "knightkun",
    description: "explore my space or visit my portfolio",
    type: "website",
    url: "https://knightkun.codes",
    siteName: "knightkun",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "knightkun - personal space",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "knightkun",
    description: "explore my space or visit my portfolio",
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
      <body className={`${geistMono.variable} ${dancingScript.variable} antialiased`}>
        
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ClientCursorProvider />
        </ThemeProvider>

      </body>
    </html>
  );
}