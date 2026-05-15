import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/ui/page-hero";
import { PracticeListGrid } from "@/components/practice-areas/practice-list-grid";
import { CtaBanner } from "@/components/homepage/cta-banner";
import { getAllPracticeAreas } from "@/lib/data/queries";
import type { Locale } from "@/i18n/routing";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "PracticeAreas" });
  return {
    title: `${t("heroTitle")} — JIN Legal Counsel`,
    description: t("heroSubtitle"),
  };
}

export default async function PracticeAreasPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations("PracticeAreas");
  const areas = await getAllPracticeAreas(params.locale);
  return (
    <>
      <Nav />
      <main>
        <PageHero
          eyebrow={t("heroEyebrow")}
          title={t("heroTitle")}
          subtitle={t("heroSubtitle")}
        />
        <PracticeListGrid areas={areas} />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
