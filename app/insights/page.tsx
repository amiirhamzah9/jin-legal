import type { Metadata } from "next";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/ui/page-hero";
import { InsightsGrid } from "@/components/insights/insights-grid";
import { CtaBanner } from "@/components/homepage/cta-banner";
import { getRecentBlogPosts } from "@/lib/data/queries";

export const revalidate = 300; // 5-minute ISR

export const metadata: Metadata = {
  title: "Insights — Jin Legal | PT Juris International Network",
  description:
    "Legal perspectives, regulatory updates, and analysis from Jin Legal's practice areas.",
};

export default async function InsightsPage() {
  const posts = await getRecentBlogPosts(12);

  return (
    <>
      <Nav />
      <main>
        <PageHero
          eyebrow="Latest Insights"
          title="Legal Perspectives"
          subtitle="Analysis, regulatory updates, and practical guidance from our practice areas across Indonesian law."
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
