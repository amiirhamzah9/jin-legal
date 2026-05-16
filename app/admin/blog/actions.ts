"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/admin";

export type BlogFormState = {
  status: "idle" | "error" | "success";
  message?: string;
};

/**
 * Convert "Some Title!" → "some-title". Basic slug helper for new posts.
 */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 80);
}

function getCommonFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim() || null,
    content: String(formData.get("content") ?? "").trim(),
    cover_image_url: String(formData.get("cover_image_url") ?? "").trim() || null,
    category: String(formData.get("category") ?? "").trim() || null,
    is_published: formData.get("is_published") === "on",
    title_id: String(formData.get("title_id") ?? "").trim() || null,
    excerpt_id: String(formData.get("excerpt_id") ?? "").trim() || null,
    content_id: String(formData.get("content_id") ?? "").trim() || null,
    category_indo: String(formData.get("category_indo") ?? "").trim() || null,
  };
}

export async function createPost(
  _prev: BlogFormState,
  formData: FormData
): Promise<BlogFormState> {
  await requireAdmin();
  const fields = getCommonFields(formData);

  if (!fields.title || !fields.content) {
    return { status: "error", message: "Judul dan konten wajib diisi." };
  }
  const slug = fields.slug || slugify(fields.title);
  if (!slug) {
    return { status: "error", message: "Slug tidak dapat dibuat." };
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      title: fields.title,
      slug,
      excerpt: fields.excerpt,
      content: fields.content,
      cover_image_url: fields.cover_image_url,
      category: fields.category,
      author_id: null,
      is_published: fields.is_published,
      published_at: fields.is_published ? new Date().toISOString() : null,
      title_id: fields.title_id,
      excerpt_id: fields.excerpt_id,
      content_id: fields.content_id,
      category_indo: fields.category_indo,
    })
    .select("id")
    .single();

  if (error) {
    return {
      status: "error",
      message: error.code === "23505" ? "Slug sudah digunakan." : error.message,
    };
  }

  revalidatePath("/admin/blog");
  revalidatePath("/insights");
  redirect(`/admin/blog/${data!.id}`);
}

export async function updatePost(
  postId: string,
  _prev: BlogFormState,
  formData: FormData
): Promise<BlogFormState> {
  await requireAdmin();
  const fields = getCommonFields(formData);
  if (!fields.title || !fields.content) {
    return { status: "error", message: "Judul dan konten wajib diisi." };
  }
  const slug = fields.slug || slugify(fields.title);

  const supabase = createClient();
  const { error } = await supabase
    .from("blog_posts")
    .update({
      title: fields.title,
      slug,
      excerpt: fields.excerpt,
      content: fields.content,
      cover_image_url: fields.cover_image_url,
      category: fields.category,
      is_published: fields.is_published,
      published_at: fields.is_published ? new Date().toISOString() : null,
      title_id: fields.title_id,
      excerpt_id: fields.excerpt_id,
      content_id: fields.content_id,
      category_indo: fields.category_indo,
    })
    .eq("id", postId);

  if (error) {
    return {
      status: "error",
      message: error.code === "23505" ? "Slug sudah digunakan." : error.message,
    };
  }

  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${postId}`);
  revalidatePath("/insights");
  revalidatePath(`/insights/${slug}`);
  return { status: "success", message: "Artikel tersimpan." };
}

export async function deletePost(postId: string) {
  await requireAdmin();
  const supabase = createClient();
  await supabase.from("blog_posts").delete().eq("id", postId);
  revalidatePath("/admin/blog");
  revalidatePath("/insights");
  redirect("/admin/blog");
}

export async function togglePublished(postId: string, currentlyPublished: boolean) {
  await requireAdmin();
  const supabase = createClient();
  await supabase
    .from("blog_posts")
    .update({
      is_published: !currentlyPublished,
      published_at: !currentlyPublished ? new Date().toISOString() : null,
    })
    .eq("id", postId);
  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${postId}`);
  revalidatePath("/insights");
}
