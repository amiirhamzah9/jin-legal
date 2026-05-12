"use client";

import { useState, useMemo } from "react";
import { FullTeamGrid } from "./full-team-grid";
import type { Database } from "@/lib/supabase/types";

type TeamMember = Database["public"]["Tables"]["team_members"]["Row"];

const PRACTICE_GROUPS = [
  { id: "all", label: "All Partners" },
  { id: "corporate-business", label: "Corporate & Business" },
  { id: "litigation", label: "Litigation" },
  { id: "specialties", label: "Specialties" },
] as const;

export function TeamPageBody({ partners }: { partners: TeamMember[] }) {
  const [active, setActive] = useState<string>("all");

  const visible = useMemo(() => {
    if (active === "all") return partners;
    return partners.filter((p) => p.practice_group === active);
  }, [active, partners]);

  return (
    <section className="bg-forest-deep px-5 py-12 md:px-[72px] md:py-20">
      <div className="flex gap-1 mb-8 md:mb-12 border-b border-white/10 overflow-x-auto">
        {PRACTICE_GROUPS.map((group) => {
          const isActive = group.id === active;
          return (
            <button
              key={group.id}
              type="button"
              onClick={() => setActive(group.id)}
              className={`font-sans text-[11px] font-semibold tracking-[2px] uppercase px-6 py-4 border-b-2 -mb-px transition-colors whitespace-nowrap ${
                isActive
                  ? "text-gold border-gold"
                  : "text-white/40 border-transparent hover:text-white/70"
              }`}
            >
              {group.label}
            </button>
          );
        })}
      </div>
      <FullTeamGrid partners={visible} />
    </section>
  );
}
