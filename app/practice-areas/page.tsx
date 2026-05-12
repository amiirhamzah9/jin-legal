import type { Metadata } from "next";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/ui/page-hero";
import { PracticeListGrid } from "@/components/practice-areas/practice-list-grid";
import { CtaBanner } from "@/components/homepage/cta-banner";

export const metadata: Metadata = {
  title: "Practice Areas — Jin Legal | PT Juris International Network",
  description:
    "Eleven practice areas spanning corporate law, litigation, regulatory advisory, intellectual property, and specialized domains.",
};

export default function PracticeAreasPage() {
  return (
    <>
      <Nav />
      <main>
        <PageHero
          eyebrow="What We Do"
          title="Our Practice Areas"
          subtitle="Eleven focused practice areas spanning corporate transactions, dispute resolution, regulatory advisory, and specialized industry expertise."
        />
        <PracticeListGrid />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
