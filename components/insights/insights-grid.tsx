import { InsightCard } from "./insight-card";
import type { Database } from "@/lib/supabase/types";

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];

export function InsightsGrid({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-sans text-[14px] font-light text-ink-muted">
          No insights published yet — check back soon.
        </p>
      </div>
    );
  }

  if (posts.length < 3) {
    return (
      <div className="grid grid-cols-2 gap-6">
        {posts.map((post) => (
          <InsightCard key={post.id} post={post} featured />
        ))}
      </div>
    );
  }

  const [featured, ...rest] = posts;
  return (
    <div className="grid grid-cols-[2fr_1fr_1fr] gap-6">
      <InsightCard post={featured} featured />
      {rest.slice(0, 2).map((post) => (
        <InsightCard key={post.id} post={post} />
      ))}
    </div>
  );
}
