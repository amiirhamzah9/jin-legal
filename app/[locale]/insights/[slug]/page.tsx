import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { CtaBanner } from "@/components/homepage/cta-banner";
import { MarkdownContent } from "@/components/insights/markdown-content";
import { Eyebrow } from "@/components/ui/eyebrow";
import { setRequestLocale } from "next-intl/server";
import { getBlogPostBySlug, getAllPublishedSlugs } from "@/lib/data/queries";
import { routing, type Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/i18n/alternates";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; locale: Locale };
}): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug, params.locale);
  if (!post) return { title: "Not Found — JIN Legal Counsel" };
  const ogImage = post.cover_image_url ?? "/og-image.png";
  return {
    title: `${post.title} — JIN Legal Counsel`,
    description: post.excerpt ?? undefined,
    keywords: post.category
      ? [post.category, "Indonesia", "Jin Legal", "JIN Legal Counsel", "legal insights"]
      : undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      siteName: "JIN Legal Counsel",
      images: [{ url: ogImage, width: 1200, height: 675, alt: post.title }],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt ?? undefined,
      images: [ogImage],
    },
    alternates: buildAlternates(params.locale, `/insights/${post.slug}`),
  };
}

function formatDate(iso: string | null, locale: Locale): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function InsightDetailPage({
  params,
}: {
  params: { slug: string; locale: Locale };
}) {
  setRequestLocale(params.locale);
  const post = await getBlogPostBySlug(params.slug, params.locale);
  if (!post) notFound();

  return (
    <>
      <Nav />
      <main>
        <section className="bg-forest-deep pt-[100px] pb-12 px-5 md:pt-[120px] md:pb-16 md:px-[72px]">
          <div className="max-w-[800px] mx-auto">
            {post.category && (
              <Eyebrow withLine className="mb-6">
                {post.category}
              </Eyebrow>
            )}
            <h1 className="font-serif text-[clamp(34px,4.5vw,52px)] font-light text-white leading-[1.15] tracking-tight mb-6">
              {post.title}
            </h1>
            <div className="font-sans text-[12px] text-white/40 tracking-wide">
              {formatDate(post.published_at, params.locale)}
            </div>
          </div>
        </section>
        {post.cover_image_url && (
          <div className="bg-forest-deep">
            <div className="max-w-[1100px] mx-auto px-5 md:px-[72px] -mb-12 md:-mb-20 relative z-10">
              <Image
                src={post.cover_image_url}
                alt={post.title}
                width={1200}
                height={675}
                className="w-full aspect-video object-cover"
              />
            </div>
          </div>
        )}
        <section className="bg-ivory pt-20 pb-16 px-5 md:pt-32 md:pb-24 md:px-[72px]">
          <div className="max-w-[760px] mx-auto">
            <MarkdownContent source={post.content} />
          </div>
        </section>
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
