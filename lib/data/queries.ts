import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
type Career = Database["public"]["Tables"]["careers"]["Row"];

/**
 * Get published blog posts, newest first.
 * @param limit Max number of posts to return (default 12)
 */
export async function getRecentBlogPosts(limit = 12): Promise<BlogPost[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getRecentBlogPosts error:", error);
    return [];
  }
  return data ?? [];
}

/**
 * Get a single published post by slug. Returns null if not found.
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("getBlogPostBySlug error:", error);
    }
    return null;
  }
  return data;
}

/**
 * Get all published blog post slugs (for generateStaticParams).
 */
export async function getAllPublishedSlugs(): Promise<string[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("is_published", true)
    .returns<Pick<BlogPost, "slug">[]>();

  if (error) {
    console.error("getAllPublishedSlugs error:", error);
    return [];
  }
  return (data ?? []).map((r) => r.slug);
}

/**
 * Get all active careers, newest first.
 */
export async function getActiveCareers(): Promise<Career[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("careers")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getActiveCareers error:", error);
    return [];
  }
  return data ?? [];
}
