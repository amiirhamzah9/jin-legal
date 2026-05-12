import type { Metadata } from "next";
import { Suspense } from "react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/ui/page-hero";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";

export const metadata: Metadata = {
  title: "Contact — Jin Legal | PT Juris International Network",
  description:
    "Reach out to Jin Legal for a consultation. Office in Jakarta, Indonesia.",
};

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main>
        <PageHero
          eyebrow="Get in Touch"
          title="Let's Discuss Your Legal Needs"
          subtitle="Tell us about your matter — we typically respond within 1–2 business days."
        />
        <section className="bg-ivory px-[72px] py-20">
          <div className="max-w-[1100px] mx-auto grid grid-cols-[2fr_1fr] gap-16">
            <Suspense fallback={<div>Loading form…</div>}>
              <ContactForm />
            </Suspense>
            <ContactInfo />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
