import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/ui/page-hero";
import { InsightsGrid } from "@/components/insights/insights-grid";
import { CtaBanner } from "@/components/homepage/cta-banner";
import { getRecentBlogPosts } from "@/lib/data/queries";
import type { Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/i18n/alternates";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "Insights" });
  return {
    title: `${t("heroTitle")} — JIN Legal Counsel`,
    description: t("heroSubtitle"),
    alternates: buildAlternates(params.locale, "/insights"),
  };
}

export default async function InsightsPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations("Insights");
  const posts = await getRecentBlogPosts(12, params.locale);

  return (
    <>
      <Nav />
      <main>
        <PageHero
          eyebrow={t("heroEyebrow")}
          title={t("heroTitle")}
          subtitle={t("heroSubtitle")}
        />
        <section className="bg-white px-5 py-12 md:px-[72px] md:py-20">
          <InsightsGrid posts={posts} />
        </section>
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
