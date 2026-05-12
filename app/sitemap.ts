import type { MetadataRoute } from "next";
import { getAllPracticeAreas, getAllPublishedSlugs } from "@/lib/data/queries";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jin-legal.vercel.app";

export const revalidate = 3600; // Regenerate sitemap hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/team`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/practice-areas`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/insights`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/careers`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
  ];

  // Pull practice area slugs from Supabase
  let practiceAreaRoutes: MetadataRoute.Sitemap = [];
  try {
    const areas = await getAllPracticeAreas();
    practiceAreaRoutes = areas.map((area) => ({
      url: `${SITE_URL}/practice-areas/${area.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch (err) {
    console.error("[sitemap] failed to load practice areas:", err);
  }

  // Pull blog slugs from Supabase
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const slugs = await getAllPublishedSlugs();
    blogRoutes = slugs.map((slug) => ({
      url: `${SITE_URL}/insights/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch (err) {
    console.error("[sitemap] failed to load blog slugs:", err);
  }

  return [...staticRoutes, ...practiceAreaRoutes, ...blogRoutes];
}
