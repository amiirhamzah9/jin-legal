import { getLocale, getTranslations } from "next-intl/server";
import { SectionHead } from "@/components/ui/section-head";
import { InsightsGrid } from "@/components/insights/insights-grid";
import { getRecentBlogPosts } from "@/lib/data/queries";
import type { Locale } from "@/i18n/routing";

export async function Insights() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("Insights");
  const posts = await getRecentBlogPosts(3, locale);

  return (
    <section className="bg-white px-5 py-16 md:px-[72px] md:py-24">
      <SectionHead
        eyebrow={t("heroEyebrow")}
        title={t("heroTitle")}
        viewAllHref="/insights"
        viewAllLabel={t("heroEyebrow")}
      />
      <InsightsGrid posts={posts} />
    </section>
  );
}
