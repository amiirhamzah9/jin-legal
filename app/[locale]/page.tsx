import type { Metadata } from "next";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/homepage/hero";
import { StatsBar } from "@/components/homepage/stats-bar";
import { AboutStrip } from "@/components/homepage/about-strip";
import { PracticeAreas } from "@/components/homepage/practice-areas";
import { TeamPreview } from "@/components/homepage/team-preview";
import { Insights } from "@/components/homepage/insights";
import { CtaBanner } from "@/components/homepage/cta-banner";
import type { Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/i18n/alternates";

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  return {
    alternates: buildAlternates(params.locale, "/"),
  };
}

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <StatsBar />
        <AboutStrip />
        <PracticeAreas />
        <TeamPreview />
        <Insights />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
