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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <InsightCard key={post.id} post={post} featured />
        ))}
      </div>
    );
  }

  const [featured, second, third, ...rest] = posts;
  return (
    <div className="space-y-6">
      {/* Top row: 1 featured + 2 standard */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-6">
        <InsightCard post={featured} featured />
        {second && <InsightCard post={second} />}
        {third && <InsightCard post={third} />}
      </div>
      {/* Remaining posts in 3-column grid */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-4">
          {rest.map((post) => (
            <InsightCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
