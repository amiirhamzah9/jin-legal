import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/ui/page-hero";
import { TeamPageBody } from "@/components/team/team-filter-tabs";
import { CtaBanner } from "@/components/homepage/cta-banner";
import { getActiveTeamMembers } from "@/lib/data/queries";
import type { Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/i18n/alternates";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "Team" });
  return {
    title: `${t("heroTitle")} — JIN Legal Counsel`,
    description: t("heroSubtitle"),
    alternates: buildAlternates(params.locale, "/team"),
  };
}

export default async function TeamPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations("Team");
  const partners = await getActiveTeamMembers(undefined, params.locale);
  return (
    <>
      <Nav />
      <main>
        <PageHero
          eyebrow={t("heroEyebrow")}
          title={t("heroTitle")}
          subtitle={t("heroSubtitle")}
        />
        <TeamPageBody partners={partners} />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
