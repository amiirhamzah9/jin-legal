import { routing, type Locale } from "@/i18n/routing";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jin-legal.com";

function localePath(locale: Locale, path: string): string {
  const normalized = path === "" || path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  if (locale === routing.defaultLocale) return normalized || "/";
  return `/${locale}${normalized}` || `/${locale}`;
}

export function localeUrl(locale: Locale, path: string): string {
  return `${SITE_URL}${localePath(locale, path)}`;
}

/**
 * Build the `alternates` object for a page's metadata.
 * Yields a canonical URL for the active locale plus `languages` entries for
 * every supported locale (including `x-default`).
 */
export function buildAlternates(locale: Locale, path: string) {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = localePath(l, path);
  }
  languages["x-default"] = localePath(routing.defaultLocale, path);

  return {
    canonical: localePath(locale, path),
    languages,
  };
}

/**
 * Build sitemap entries for a single logical URL — one per locale, each with
 * `alternates.languages` listing the other locale equivalents.
 */
export function localizedSitemapEntries(
  path: string,
  options: {
    lastModified?: Date | string;
    changeFrequency?:
      | "always"
      | "hourly"
      | "daily"
      | "weekly"
      | "monthly"
      | "yearly"
      | "never";
    priority?: number;
  } = {}
) {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = localeUrl(l, path);
  }

  return routing.locales.map((locale) => ({
    url: localeUrl(locale, path),
    lastModified: options.lastModified,
    changeFrequency: options.changeFrequency,
    priority: options.priority,
    alternates: { languages },
  }));
}
