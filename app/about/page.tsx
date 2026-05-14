import type { Metadata } from "next";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/ui/page-hero";
import { FirmStory } from "@/components/about/firm-story";
import { Credentials } from "@/components/about/credentials";
import { CtaBanner } from "@/components/homepage/cta-banner";

export const metadata: Metadata = {
  title: "About — JIN Legal Counsel",
  description:
    "JIN Legal Counsel — seven partners delivering strategic legal counsel across 12 practice areas in Indonesia.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main>
        <PageHero
          eyebrow="About the Firm"
          title="A Modern Legal Partner for a Complex World"
          subtitle="Founded on the principle that exceptional legal counsel must be both strategically sharp and deeply human."
        />
        <FirmStory />
        <Credentials />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
