import { SectionHead } from "@/components/ui/section-head";
import { InsightsGrid } from "@/components/insights/insights-grid";
import { getRecentBlogPosts } from "@/lib/data/queries";

export async function Insights() {
  const posts = await getRecentBlogPosts(3);

  return (
    <section className="bg-white px-[72px] py-24">
      <SectionHead
        eyebrow="Latest Insights"
        title="Legal Perspectives"
        viewAllHref="/insights"
        viewAllLabel="All Articles"
      />
      <InsightsGrid posts={posts} />
    </section>
  );
}
