import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/ui/page-hero";
import { FirmStory } from "@/components/about/firm-story";
// import { Credentials } from "@/components/about/credentials"; // hidden temporarily
import { CtaBanner } from "@/components/homepage/cta-banner";
import type { Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/i18n/alternates";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "About" });
  return {
    title: `${t("heroTitle")} — JIN Legal Counsel`,
    description: t("heroSubtitle"),
    alternates: buildAlternates(params.locale, "/about"),
  };
}

export default async function AboutPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations("About");
  return (
    <>
      <Nav />
      <main>
        <PageHero
          eyebrow={t("heroEyebrow")}
          title={t("heroTitle")}
          subtitle={t("heroSubtitle")}
        />
        <FirmStory />
        {/* <Credentials /> */}
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
