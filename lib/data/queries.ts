import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import type { Locale } from "@/i18n/routing";
import {
  localizePracticeArea,
  localizeTeamMember,
  localizeBlogPost,
  localizeCareer,
} from "./localize";

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
type Career = Database["public"]["Tables"]["careers"]["Row"];
type TeamMember = Database["public"]["Tables"]["team_members"]["Row"];
type PracticeArea = Database["public"]["Tables"]["practice_areas"]["Row"];

const DEFAULT_LOCALE: Locale = "en";

// ─── Blog Posts ────────────────────────────────────────────────────────────

export async function getRecentBlogPosts(
  limit = 12,
  locale: Locale = DEFAULT_LOCALE
): Promise<BlogPost[]> {
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
  return (data ?? []).map((p) => localizeBlogPost(p, locale));
}

export async function getBlogPostBySlug(
  slug: string,
  locale: Locale = DEFAULT_LOCALE
): Promise<BlogPost | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) {
    if (error.code !== "PGRST116") console.error("getBlogPostBySlug error:", error);
    return null;
  }
  return localizeBlogPost(data, locale);
}

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

// ─── Careers ───────────────────────────────────────────────────────────────

export async function getActiveCareers(
  locale: Locale = DEFAULT_LOCALE
): Promise<Career[]> {
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
  return (data ?? []).map((c) => localizeCareer(c, locale));
}

export async function getCareerBySlug(
  slug: string,
  locale: Locale = DEFAULT_LOCALE
): Promise<Career | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("careers")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  if (error) return null;
  return localizeCareer(data, locale);
}

export async function getAllCareerSlugs(): Promise<string[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("careers")
    .select("slug")
    .eq("is_active", true)
    .returns<Pick<Career, "slug">[]>();
  if (error) {
    console.error("getAllCareerSlugs error:", error);
    return [];
  }
  return (data ?? []).map((r) => r.slug);
}

// ─── Team Members ──────────────────────────────────────────────────────────

export async function getActiveTeamMembers(
  limit?: number,
  locale: Locale = DEFAULT_LOCALE
): Promise<TeamMember[]> {
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
  return (data ?? []).map((m) => localizeTeamMember(m, locale));
}

export async function getTeamMembersByGroup(
  group: string,
  locale: Locale = DEFAULT_LOCALE
): Promise<TeamMember[]> {
  if (group === "all") return getActiveTeamMembers(undefined, locale);
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
  return (data ?? []).map((m) => localizeTeamMember(m, locale));
}

export async function getTeamMemberBySlug(
  slug: string,
  locale: Locale = DEFAULT_LOCALE
): Promise<TeamMember | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  if (error) return null;
  return localizeTeamMember(data, locale);
}

export async function getTeamMembersForPracticeArea(
  practiceSlug: string,
  locale: Locale = DEFAULT_LOCALE
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
  return (data ?? []).map((m) => localizeTeamMember(m, locale));
}

// ─── Practice Areas ────────────────────────────────────────────────────────

export async function getAllPracticeAreas(
  locale: Locale = DEFAULT_LOCALE
): Promise<PracticeArea[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("practice_areas")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) {
    console.error("getAllPracticeAreas error:", error);
    return [];
  }
  return (data ?? []).map((a) => localizePracticeArea(a, locale));
}

export async function getPracticeAreaBySlug(
  slug: string,
  locale: Locale = DEFAULT_LOCALE
): Promise<PracticeArea | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("practice_areas")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return localizePracticeArea(data, locale);
}
