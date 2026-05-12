import type { Metadata } from "next";
import { cormorant, jost } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jin Legal — PT Juris International Network",
  description:
    "A full-service legal consultancy serving corporations, institutions, and individuals across 11 practice areas throughout Indonesia.",
  metadataBase: new URL("https://jinlegal.co.id"),
  openGraph: {
    title: "Jin Legal — Legal Excellence, Strategic Results",
    description: "Strategic legal counsel across 11 practice areas.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="grain-overlay">{children}</body>
    </html>
  );
}
