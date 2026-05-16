import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PracticeDetailHero } from "@/components/practice-areas/practice-detail-hero";
import { PracticeDetailContent } from "@/components/practice-areas/practice-detail-content";
import { RelatedPartners } from "@/components/practice-areas/related-partners";
import { CtaBanner } from "@/components/homepage/cta-banner";
import { getAllPracticeAreas, getPracticeAreaBySlug } from "@/lib/data/queries";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { buildAlternates } from "@/lib/i18n/alternates";

export const revalidate = 300;

export async function generateStaticParams() {
  const areas = await getAllPracticeAreas();
  return routing.locales.flatMap((locale) =>
    areas.map((area) => ({ locale, slug: area.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; locale: Locale };
}): Promise<Metadata> {
  const area = await getPracticeAreaBySlug(params.slug, params.locale);
  if (!area) return { title: "Not Found — JIN Legal Counsel" };
  return {
    title: `${area.title} — JIN Legal Counsel`,
    description: area.description,
    alternates: buildAlternates(params.locale, `/practice-areas/${params.slug}`),
  };
}

export default async function PracticeAreaDetailPage({
  params,
}: {
  params: { slug: string; locale: Locale };
}) {
  setRequestLocale(params.locale);
  const area = await getPracticeAreaBySlug(params.slug, params.locale);
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
