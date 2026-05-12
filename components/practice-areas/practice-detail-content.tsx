import { Eyebrow } from "@/components/ui/eyebrow";
import type { Database } from "@/lib/supabase/types";

type PracticeArea = Database["public"]["Tables"]["practice_areas"]["Row"];

export function PracticeDetailContent({ area }: { area: PracticeArea }) {
  return (
    <section className="bg-ivory px-5 py-12 md:px-[72px] md:py-20">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-10 md:gap-16">
        <div>
          <Eyebrow className="mb-5">Overview</Eyebrow>
          <h2 className="font-serif text-[24px] md:text-[32px] font-light text-forest leading-tight mb-6">
            Our Approach
          </h2>
          <p className="font-sans text-[15px] font-light text-ink leading-[1.85]">
            {area.full_content || area.description}
          </p>
        </div>
        <aside>
          <Eyebrow className="mb-5">How We Help</Eyebrow>
          <h2 className="sr-only">How We Help</h2>
          <ul className="space-y-3 list-none p-0 m-0">
            {(area.services ?? []).map((svc) => (
              <li
                key={svc}
                className="flex items-start gap-3 font-sans text-[13px] font-light text-ink-muted leading-[1.6] pb-3 border-b border-ivory-dark"
              >
                <span className="text-gold mt-1 flex-shrink-0">—</span>
                <span>{svc}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
