import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/homepage/hero";
import { StatsBar } from "@/components/homepage/stats-bar";
import { AboutStrip } from "@/components/homepage/about-strip";
import { PracticeAreas } from "@/components/homepage/practice-areas";
import { TeamPreview } from "@/components/homepage/team-preview";
import { Insights } from "@/components/homepage/insights";
import { CtaBanner } from "@/components/homepage/cta-banner";

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
