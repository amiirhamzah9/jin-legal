import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { cormorant, jost } from "./fonts";
import "./globals.css";
import { FirebaseAnalytics } from "@/components/analytics/firebase-analytics";

export const metadata: Metadata = {
  title: "JIN Legal Counsel",
  description:
    "A full-service legal consultancy serving corporations, institutions, and individuals across 12 practice areas throughout Indonesia.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://jin-legal.vercel.app"
  ),
  openGraph: {
    title: "JIN Legal Counsel — Legal Excellence, Strategic Results",
    description: "Strategic legal counsel across 12 practice areas in Indonesia.",
    type: "website",
    locale: "en_US",
    siteName: "JIN Legal Counsel",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JIN Legal Counsel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JIN Legal Counsel — Legal Excellence, Strategic Results",
    description: "Strategic legal counsel across 12 practice areas in Indonesia.",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="grain-overlay">
        {children}
        <Analytics />
        <SpeedInsights />
        <FirebaseAnalytics />
      </body>
    </html>
  );
}
