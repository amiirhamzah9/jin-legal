import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PracticeDetailHero } from "@/components/practice-areas/practice-detail-hero";
import { PracticeDetailContent } from "@/components/practice-areas/practice-detail-content";
import { RelatedPartners } from "@/components/practice-areas/related-partners";
import { CtaBanner } from "@/components/homepage/cta-banner";
import { PRACTICE_AREAS } from "@/lib/constants";

export function generateStaticParams() {
  return PRACTICE_AREAS.map((area) => ({ slug: area.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const area = PRACTICE_AREAS.find((a) => a.slug === params.slug);
  if (!area) return { title: "Not Found — Jin Legal" };
  return {
    title: `${area.title} — Jin Legal | PT Juris International Network`,
    description: area.description,
  };
}

export default function PracticeAreaDetailPage({ params }: { params: { slug: string } }) {
  const area = PRACTICE_AREAS.find((a) => a.slug === params.slug);
  if (!area) notFound();

  return (
    <>
      <Nav />
      <main>
        <PracticeDetailHero area={area} />
        <PracticeDetailContent area={area} />
        <RelatedPartners practiceSlug={area.slug} />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
