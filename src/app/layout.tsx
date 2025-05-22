import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ui/layout/themeProvider";
import {
  Geist,
  Geist_Mono,
  DM_Serif_Text,
  Kolker_Brush,
} from "next/font/google";
import "./globals.css";

// Font configurations with CSS variable assignments for consistent typography
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSerifText = DM_Serif_Text({
  weight: "400",
  variable: "--font-dm-serif-text",
  subsets: ["latin"],
});

const KolkerBrush = Kolker_Brush({
  weight: "400",
  variable: "--font-kolker-brush",
  subsets: ["latin"],
});

// SEO and site metadata configuration
export const metadata: Metadata = {
  title: "Soul Sign ",
  icons: {
    icon: "/sign.svg",
  },
  description: "Generate your electronic cheering sign",
};

// Root layout component that wraps all pages with common configuration
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dmSerifText.variable} ${KolkerBrush.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
