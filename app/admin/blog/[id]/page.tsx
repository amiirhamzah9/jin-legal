import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { BlogForm } from "@/components/admin/blog-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { deletePost } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin();
  const supabase = createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!post) notFound();

  return (
    <div>
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-2 font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted hover:text-gold transition-colors mb-8"
      >
        ← Kembali ke Artikel
      </Link>
      <div className="flex items-start justify-between mb-10">
        <div>
          <div className="font-sans text-[10px] font-bold tracking-[2.5px] uppercase text-gold mb-2">
            Sunting Artikel
          </div>
          <h1 className="font-serif text-[28px] font-light text-forest leading-tight">
            {post.title}
          </h1>
        </div>
        <DeleteButton
          label="Hapus Artikel"
          onConfirm={async () => {
            "use server";
            await deletePost(post.id);
          }}
        />
      </div>
      <BlogForm mode="edit" post={post} />
    </div>
  );
}
