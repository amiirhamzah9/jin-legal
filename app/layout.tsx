import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { cormorant, jost } from "./fonts";
import "./globals.css";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";

export const metadata: Metadata = {
  title: "Jin Legal — PT Juris International Network",
  description:
    "A full-service legal consultancy serving corporations, institutions, and individuals across 11 practice areas throughout Indonesia.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://jin-legal.vercel.app"
  ),
  openGraph: {
    title: "Jin Legal — Legal Excellence, Strategic Results",
    description: "Strategic legal counsel across 11 practice areas in Indonesia.",
    type: "website",
    locale: "en_US",
    siteName: "Jin Legal",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Jin Legal — PT Juris International Network",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jin Legal — Legal Excellence, Strategic Results",
    description: "Strategic legal counsel across 11 practice areas in Indonesia.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logo/jin-logo.png",
  },
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
        <WhatsAppButton />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
