import Image from "next/image";
import { SectionHead } from "@/components/ui/section-head";

const SAMPLE_POSTS = [
  {
    title: "Understanding Indonesia's New Company Law: Key Changes for Foreign Investors",
    category: "Corporate Law",
    date: "May 8, 2025 · 6 min read",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=900&h=506&fit=crop&q=80",
    featured: true,
  },
  {
    title: "OJK's New FinTech Licensing Framework Explained",
    category: "FinTech",
    date: "Apr 24, 2025",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=500&h=280&fit=crop&q=80",
  },
  {
    title: "What Employers Must Know About Indonesia's Omnibus Law Updates",
    category: "Employment",
    date: "Apr 10, 2025",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=500&h=280&fit=crop&q=80",
  },
];

export function Insights() {
  return (
    <section className="bg-white px-[72px] py-24">
      <SectionHead
        eyebrow="Latest Insights"
        title="Legal Perspectives"
        viewAllHref="/insights"
        viewAllLabel="All Articles"
      />
      <div className="grid grid-cols-[2fr_1fr_1fr] gap-6">
        {SAMPLE_POSTS.map((post) => (
          <article key={post.title} className="cursor-pointer group">
            <div className="overflow-hidden mb-[18px]">
              <Image
                src={post.image}
                alt={post.title}
                width={900}
                height={506}
                className="w-full aspect-video object-cover brightness-95 saturate-95 transition-all duration-500 group-hover:scale-[1.04] group-hover:brightness-100 group-hover:saturate-100"
              />
            </div>
            <div className="font-sans text-[9px] tracking-[3px] text-gold font-bold uppercase mb-2">
              {post.category}
            </div>
            <h3
              className={`font-serif font-medium text-forest leading-[1.35] mb-2.5 ${
                post.featured ? "text-[26px]" : "text-xl"
              }`}
            >
              {post.title}
            </h3>
            <div className="font-sans text-[10px] text-ink-faint tracking-wide">{post.date}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
