import type { Metadata } from "next";
import { Nunito, Quicksand } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Mind Well — A quiet corner for your mind",
  description:
    "Ease your mind and reflect through short therapeutic games and light journaling.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${quicksand.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TimezoneSync />
        {children}
      </body>
    </html>
  );
}
