import type { Metadata } from "next";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/ui/page-hero";
import { TeamPageBody } from "@/components/team/team-filter-tabs";
import { CtaBanner } from "@/components/homepage/cta-banner";
import { getActiveTeamMembers } from "@/lib/data/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Our Team — JIN Legal Counsel",
  description:
    "Seven partners with deep expertise across corporate law, litigation, and specialized practice areas in Indonesia.",
};

export default async function TeamPage() {
  const partners = await getActiveTeamMembers();
  return (
    <>
      <Nav />
      <main>
        <PageHero
          eyebrow="Our People"
          title="The Partners Behind JIN Legal Counsel"
          subtitle="Seven dedicated legal professionals delivering sharp, strategic counsel — from individuals and entrepreneurs to startups, institutions, and multinational corporations."
        />
        <TeamPageBody partners={partners} />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
