import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/ui/page-hero";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";
import { getAllPracticeAreas } from "@/lib/data/queries";
import type { Locale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/i18n/alternates";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "Contact" });
  return {
    title: `${t("heroTitle")} — JIN Legal Counsel`,
    description: t("heroSubtitle"),
    alternates: buildAlternates(params.locale, "/contact"),
  };
}

export default async function ContactPage({
  params,
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations("Contact");
  const areas = await getAllPracticeAreas(params.locale);
  const practiceAreaOptions = areas.map((a) => ({ slug: a.slug, title: a.title }));
  return (
    <>
      <Nav />
      <main>
        <PageHero
          eyebrow={t("heroEyebrow")}
          title={t("heroTitle")}
          subtitle={t("heroSubtitle")}
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
