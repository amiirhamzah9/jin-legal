import type { MetadataRoute } from "next";
import { getAllPracticeAreas, getAllPublishedSlugs, getAllCareerSlugs } from "@/lib/data/queries";
import { localizedSitemapEntries } from "@/lib/i18n/alternates";

export const revalidate = 3600; // Regenerate sitemap hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    ...localizedSitemapEntries("/", {
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    }),
    ...localizedSitemapEntries("/about", {
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
    ...localizedSitemapEntries("/team", {
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
    ...localizedSitemapEntries("/practice-areas", {
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    }),
    ...localizedSitemapEntries("/insights", {
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }),
    ...localizedSitemapEntries("/careers", {
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    }),
    ...localizedSitemapEntries("/contact", {
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.7,
    }),
  ];

  // Pull practice area slugs from Supabase
  let practiceAreaRoutes: MetadataRoute.Sitemap = [];
  try {
    const areas = await getAllPracticeAreas();
    practiceAreaRoutes = areas.flatMap((area) =>
      localizedSitemapEntries(`/practice-areas/${area.slug}`, {
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
      })
    );
  } catch (err) {
    console.error("[sitemap] failed to load practice areas:", err);
  }

  // Pull blog slugs from Supabase
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const slugs = await getAllPublishedSlugs();
    blogRoutes = slugs.flatMap((slug) =>
      localizedSitemapEntries(`/insights/${slug}`, {
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      })
    );
  } catch (err) {
    console.error("[sitemap] failed to load blog slugs:", err);
  }

  // Pull career slugs from Supabase
  let careerRoutes: MetadataRoute.Sitemap = [];
  try {
    const slugs = await getAllCareerSlugs();
    careerRoutes = slugs.flatMap((slug) =>
      localizedSitemapEntries(`/careers/${slug}`, {
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.5,
      })
    );
  } catch (err) {
    console.error("[sitemap] failed to load career slugs:", err);
  }

  return [...staticEntries, ...practiceAreaRoutes, ...blogRoutes, ...careerRoutes];
}
