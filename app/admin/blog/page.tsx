import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { BlogTable } from "@/components/admin/blog-table";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  await requireAdmin();
  const supabase = createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="font-sans text-[10px] font-bold tracking-[2.5px] uppercase text-gold mb-2">
            Content
          </div>
          <h1 className="font-serif text-[34px] font-light text-forest leading-tight">
            Blog Posts
          </h1>
        </div>
        <Link
          href="/admin/blog/new"
          className="bg-gold text-forest-deep font-sans text-[10px] font-bold tracking-[2.5px] uppercase px-7 py-3.5 hover:bg-gold-light transition-colors"
        >
          New Post
        </Link>
      </div>
      <BlogTable posts={posts ?? []} />
    </div>
  );
}
