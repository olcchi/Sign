import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ui/layout/theme-provider";
import {
  Noto_Sans,
  Noto_Sans_Mono,
  Noto_Serif,
  Noto_Sans_SC, // chinese font
} from "next/font/google";
import "./globals.css";

// Font configurations with CSS variable assignments for consistent typography
const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: "variable",
  axes: ["wdth"],
});
const notoSansMono = Noto_Sans_Mono({
  variable: "--font-noto-sans-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
        className={`${notoSans.variable} ${notoSansMono.variable} ${notoSerif.variable} ${notoSansSC.variable} antialiased`}
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
