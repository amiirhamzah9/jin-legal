import type { Metadata } from "next";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/ui/page-hero";
import { TeamPageBody } from "@/components/team/team-filter-tabs";
import { CtaBanner } from "@/components/homepage/cta-banner";

export const metadata: Metadata = {
  title: "Our Team — Jin Legal | PT Juris International Network",
  description:
    "Six partners with deep expertise across corporate law, litigation, and specialized practice areas in Indonesia.",
};

export default function TeamPage() {
  return (
    <>
      <Nav />
      <main>
        <PageHero
          eyebrow="Our People"
          title="The Partners Behind Jin Legal"
          subtitle="Six dedicated legal professionals committed to delivering sharp, strategic counsel for every client — from startups to corporations."
        />
        <TeamPageBody />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
