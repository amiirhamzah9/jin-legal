import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/ui/page-hero";
import { CareersList } from "@/components/careers/careers-list";
import { CtaBanner } from "@/components/homepage/cta-banner";
import { getActiveCareers } from "@/lib/data/queries";
import type { Locale } from "@/i18n/routing";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "Careers" });
  return {
    title: `${t("heroTitle")} — JIN Legal Counsel`,
    description: t("heroSubtitle"),
  };
}

export default async function CareersPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations("Careers");
  const careers = await getActiveCareers(params.locale);

  return (
    <>
      <Nav />
      <main>
        <PageHero
          eyebrow={t("heroEyebrow")}
          title={t("heroTitle")}
          subtitle={t("heroSubtitle")}
        />
        <section className="bg-ivory px-5 py-12 md:px-[72px] md:py-20">
          <CareersList careers={careers} />
        </section>
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
