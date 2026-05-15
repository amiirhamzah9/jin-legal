import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { CtaBanner } from "@/components/homepage/cta-banner";
import { MarkdownContent } from "@/components/insights/markdown-content";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";
import { getCareerBySlug, getAllCareerSlugs } from "@/lib/data/queries";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getAllCareerSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const career = await getCareerBySlug(params.slug);
  if (!career) return { title: "Position Not Found — JIN Legal Counsel" };
  return {
    title: `${career.title} — Careers — JIN Legal Counsel`,
    description: `Open position at JIN Legal Counsel: ${career.title} (${career.type}, ${career.location ?? "Indonesia"}).`,
  };
}

export default async function CareerDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const career = await getCareerBySlug(params.slug);
  if (!career) notFound();

  return (
    <>
      <Nav />
      <main>
        <section className="bg-forest-deep pt-[100px] pb-12 px-5 md:pt-[120px] md:pb-16 md:px-[72px]">
          <div className="max-w-[900px] mx-auto">
            <nav className="flex items-center gap-3 font-sans text-[10px] tracking-[2px] uppercase text-white/40 mb-8">
              <Link href="/careers" className="hover:text-gold transition-colors">
                Careers
              </Link>
              <span className="text-gold/50">/</span>
              <span className="text-gold">{career.title}</span>
            </nav>
            <Eyebrow withLine className="mb-6">
              Open Position
            </Eyebrow>
            <h1 className="font-serif text-[clamp(34px,4.5vw,52px)] font-light text-white leading-[1.15] tracking-tight mb-6">
              {career.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-gold bg-gold/10 px-3 py-1.5">
                {career.type}
              </span>
              {career.location && (
                <span className="font-sans text-[12px] text-white/50">{career.location}</span>
              )}
            </div>
            <Button variant="gold" href={`/careers/${career.slug}/apply`}>
              Apply for this Position
            </Button>
          </div>
        </section>

        <section className="bg-ivory px-5 py-16 md:px-[72px] md:py-24">
          <div className="max-w-[760px] mx-auto">
            <MarkdownContent source={career.description} />
            <div className="mt-12 pt-10 border-t border-ivory-dark">
              <Eyebrow className="mb-4">Ready to Apply?</Eyebrow>
              <h3 className="font-serif text-[24px] font-light text-forest leading-tight mb-5">
                Submit your application
              </h3>
              <p className="font-sans text-[14px] font-light text-ink-muted leading-[1.7] mb-7">
                Tell us about yourself and attach your CV. We review every application
                and respond within 1–2 weeks.
              </p>
              <Button variant="gold" href={`/careers/${career.slug}/apply`}>
                Apply for this Position
              </Button>
            </div>
          </div>
        </section>

        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
