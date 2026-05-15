import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ApplicationForm } from "@/components/careers/application-form";
import { getCareerBySlug } from "@/lib/data/queries";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const career = await getCareerBySlug(params.slug);
  if (!career) return { title: "Apply — JIN Legal Counsel" };
  return {
    title: `Apply — ${career.title} — JIN Legal Counsel`,
    description: `Submit your application for ${career.title} at JIN Legal Counsel.`,
  };
}

export default async function ApplyPage({
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
        <section className="bg-forest-deep pt-[100px] pb-10 px-5 md:pt-[120px] md:pb-12 md:px-[72px]">
          <div className="max-w-[760px] mx-auto">
            <nav className="flex items-center gap-3 font-sans text-[10px] tracking-[2px] uppercase text-white/40 mb-8 flex-wrap">
              <Link href="/careers" className="hover:text-gold transition-colors">
                Careers
              </Link>
              <span className="text-gold/50">/</span>
              <Link
                href={`/careers/${career.slug}`}
                className="hover:text-gold transition-colors"
              >
                {career.title}
              </Link>
              <span className="text-gold/50">/</span>
              <span className="text-gold">Apply</span>
            </nav>
            <Eyebrow withLine className="mb-6">
              Apply Now
            </Eyebrow>
            <h1 className="font-serif text-[clamp(28px,4vw,42px)] font-light text-white leading-[1.15] tracking-tight mb-4">
              {career.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-gold bg-gold/10 px-3 py-1.5">
                {career.type}
              </span>
              {career.location && (
                <span className="font-sans text-[12px] text-white/50">{career.location}</span>
              )}
            </div>
          </div>
        </section>

        <section className="bg-ivory px-5 py-12 md:px-[72px] md:py-20">
          <div className="max-w-[760px] mx-auto">
            <Eyebrow className="mb-4">Application Form</Eyebrow>
            <h2 className="font-serif text-[28px] font-light text-forest leading-tight mb-3">
              Tell us about yourself
            </h2>
            <p className="font-sans text-[13px] font-light text-ink-muted leading-[1.7] mb-10">
              Required fields marked with *. Your CV will be sent securely to our
              recruitment team. We respond within 1–2 weeks.
            </p>
            <ApplicationForm slug={career.slug} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
