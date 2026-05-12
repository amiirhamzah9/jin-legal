import Image from "next/image";
import Link from "next/link";
import type { Database } from "@/lib/supabase/types";

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function InsightCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return (
    <Link href={`/insights/${post.slug}`} className="cursor-pointer group block">
      {post.cover_image_url && (
        <div className="overflow-hidden mb-[18px]">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            width={900}
            height={506}
            className="w-full aspect-video object-cover brightness-95 saturate-95 transition-all duration-500 group-hover:scale-[1.04] group-hover:brightness-100 group-hover:saturate-100"
          />
        </div>
      )}
      {post.category && (
        <div className="font-sans text-[9px] tracking-[3px] text-gold font-bold uppercase mb-2">
          {post.category}
        </div>
      )}
      <h3
        className={`font-serif font-medium text-forest leading-[1.35] mb-2.5 ${
          featured ? "text-[26px]" : "text-xl"
        }`}
      >
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="font-sans text-[13px] font-light text-ink-muted leading-[1.7] mb-3">
          {post.excerpt}
        </p>
      )}
      <div className="font-sans text-[10px] text-ink-faint tracking-wide">
        {formatDate(post.published_at)}
      </div>
    </Link>
  );
}
