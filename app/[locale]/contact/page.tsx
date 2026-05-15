import type { Metadata } from "next";
import { Suspense } from "react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/ui/page-hero";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";
import { getAllPracticeAreas } from "@/lib/data/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Contact — JIN Legal Counsel",
  description:
    "Reach out to JIN Legal Counsel for a consultation. Office in Jakarta, Indonesia.",
};

export default async function ContactPage() {
  const areas = await getAllPracticeAreas();
  const practiceAreaOptions = areas.map((a) => ({ slug: a.slug, title: a.title }));
  return (
    <>
      <Nav />
      <main>
        <PageHero
          eyebrow="Get in Touch"
          title="Let's Discuss Your Legal Needs"
          subtitle="Tell us about your matter — we typically respond within 1–2 business days."
        />
        <section className="bg-ivory px-5 py-12 md:px-[72px] md:py-20">
          <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-10 md:gap-16">
            <Suspense fallback={<div>Loading form…</div>}>
              <ContactForm practiceAreaOptions={practiceAreaOptions} />
            </Suspense>
            <ContactInfo />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
