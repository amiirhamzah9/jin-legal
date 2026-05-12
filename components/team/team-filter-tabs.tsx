"use client";

import { useState } from "react";
import { FullTeamGrid } from "./full-team-grid";
import { PRACTICE_GROUPS, type PracticeGroup } from "@/lib/constants";

export function TeamPageBody() {
  const [active, setActive] = useState<PracticeGroup>("all");

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
      <FullTeamGrid filter={active} />
    </section>
  );
}
