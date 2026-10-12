import type { Metadata, Viewport } from "next";
import { Nunito, Quicksand, Press_Start_2P } from "next/font/google";
import { TimezoneSync } from "@/components/app/TimezoneSync";
import { SiteFooter } from "@/components/legal/SiteFooter";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
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
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} ♡ ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} ♡ ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} ♡ ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  appleWebApp: { capable: true, title: SITE_NAME, statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#7b5bc7",
  width: "device-width",
  initialScale: 1,
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
        <SiteFooter />
      </body>
    </html>
  );
}
