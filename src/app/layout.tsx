import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ui/layout/theme-provider";
import {
  Geist,
  Geist_Mono,
  DM_Serif_Text,
  DM_Sans,
  Kolker_Brush,
  Noto_Sans_SC, // chinese font
} from "next/font/google";
import "./globals.css";

// Font configurations with CSS variable assignments for consistent typography
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
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

// Chinese font configuration for consistent Chinese text rendering
const notoSansSC = Noto_Sans_SC({
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans-sc",
  subsets: ["latin"],
});

// SEO and site metadata configuration
export const metadata: Metadata = {
  title: "Sign ",
  description: "Generate your electronic cheering sign",
  icons: [
    {
      url: "/sign-light.svg",
      media: "(prefers-color-scheme: light)",
    },
    {
      url: "/sign-dark.svg",
      media: "(prefers-color-scheme: dark)",
    },
  ],
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
        className={`${geistSans.variable} ${geistMono.variable} ${dmSerifText.variable} ${KolkerBrush.variable} ${dmSans.variable} ${notoSansSC.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          // enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
