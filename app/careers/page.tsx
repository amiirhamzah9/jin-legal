import type { Metadata } from "next";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/ui/page-hero";
import { CareersList } from "@/components/careers/careers-list";
import { CtaBanner } from "@/components/homepage/cta-banner";
import { getActiveCareers } from "@/lib/data/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Careers — Jin Legal | PT Juris International Network",
  description: "Join Jin Legal — open positions and internship opportunities.",
};

export default async function CareersPage() {
  const careers = await getActiveCareers();

  return (
    <>
      <Nav />
      <main>
        <PageHero
          eyebrow="Join Our Team"
          title="Build a Career at Jin Legal"
          subtitle="We're looking for sharp, strategic, and curious legal professionals who want to do meaningful work."
        />
        <section className="bg-ivory px-[72px] py-20">
          <CareersList careers={careers} />
        </section>
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
