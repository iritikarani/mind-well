import type { Metadata } from "next";
import { Nunito, Quicksand, Press_Start_2P } from "next/font/google";
import { TimezoneSync } from "@/components/app/TimezoneSync";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

// Used sparingly — brand wordmark and short hero labels only. Never for
// paragraph text: an 8-bit monospace face is a readability/accessibility
// liability at body-copy length.
const pixelFont = Press_Start_2P({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Happy Space ♡ — A small place for your mental health",
  description:
    "Emotions are valued and validated. A small pixelated world for your mental health — play, reflect, and feel a little lighter.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${quicksand.variable} ${pixelFont.variable} antialiased`}
    >
      <body className="min-h-dvh flex flex-col">
        <TimezoneSync />
        {children}
      </body>
    </html>
  );
}
