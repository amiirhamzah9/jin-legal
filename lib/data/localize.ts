import type { Database } from "@/lib/supabase/types";
import type { Locale } from "@/i18n/routing";

type PracticeArea = Database["public"]["Tables"]["practice_areas"]["Row"];
type TeamMember = Database["public"]["Tables"]["team_members"]["Row"];
type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
type Career = Database["public"]["Tables"]["careers"]["Row"];

/**
 * Pick localized field if locale is "id" and translation exists, else fallback to base.
 * Used by row-level localizers below.
 */
function pick<T>(localeId: T | null | undefined, base: T): T {
  return localeId ?? base;
}

export function localizePracticeArea(
  area: PracticeArea,
  locale: Locale
): PracticeArea {
  if (locale !== "id") return area;
  return {
    ...area,
    title: pick(area.title_id, area.title),
    description: pick(area.description_id, area.description),
    full_content: pick(area.full_content_id, area.full_content),
    services: pick(area.services_id, area.services),
  };
}

export function localizeTeamMember(member: TeamMember, locale: Locale): TeamMember {
  if (locale !== "id") return member;
  return {
    ...member,
    bio: pick(member.bio_id, member.bio),
    role: pick(member.role_id, member.role),
  };
}

export function localizeBlogPost(post: BlogPost, locale: Locale): BlogPost {
  if (locale !== "id") return post;
  return {
    ...post,
    title: pick(post.title_id, post.title),
    excerpt: pick(post.excerpt_id, post.excerpt),
    content: pick(post.content_id, post.content),
    category: pick(post.category_indo, post.category),
  };
}

export function localizeCareer(career: Career, locale: Locale): Career {
  if (locale !== "id") return career;
  return {
    ...career,
    title: pick(career.title_id, career.title),
    description: pick(career.description_id, career.description),
  };
}
