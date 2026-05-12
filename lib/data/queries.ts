import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
type Career = Database["public"]["Tables"]["careers"]["Row"];
type TeamMember = Database["public"]["Tables"]["team_members"]["Row"];
type PracticeArea = Database["public"]["Tables"]["practice_areas"]["Row"];

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

/**
 * Get all active team members, ordered by display_order.
 */
export async function getActiveTeamMembers(limit?: number): Promise<TeamMember[]> {
  const supabase = createClient();
  let query = supabase
    .from("team_members")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) {
    console.error("getActiveTeamMembers error:", error);
    return [];
  }
  return data ?? [];
}

/**
 * Get team members in a specific practice group (or all if 'all'). Active only.
 */
export async function getTeamMembersByGroup(group: string): Promise<TeamMember[]> {
  if (group === "all") return getActiveTeamMembers();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("is_active", true)
    .eq("practice_group", group)
    .order("display_order", { ascending: true });
  if (error) {
    console.error("getTeamMembersByGroup error:", error);
    return [];
  }
  return data ?? [];
}

/**
 * Get a team member by slug. Returns null if not found.
 */
export async function getTeamMemberBySlug(slug: string): Promise<TeamMember | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  if (error) return null;
  return data;
}

/**
 * Get all team members assigned to a given practice area slug.
 */
export async function getTeamMembersForPracticeArea(
  practiceSlug: string
): Promise<TeamMember[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("is_active", true)
    .contains("practice_areas", [practiceSlug])
    .order("display_order", { ascending: true });
  if (error) {
    console.error("getTeamMembersForPracticeArea error:", error);
    return [];
  }
  return data ?? [];
}

/**
 * Get all practice areas, ordered by display_order.
 */
export async function getAllPracticeAreas(): Promise<PracticeArea[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("practice_areas")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) {
    console.error("getAllPracticeAreas error:", error);
    return [];
  }
  return data ?? [];
}

/**
 * Get a practice area by slug. Returns null if not found.
 */
export async function getPracticeAreaBySlug(slug: string): Promise<PracticeArea | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("practice_areas")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data;
}
