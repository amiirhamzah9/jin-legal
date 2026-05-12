import Link from "next/link";
import { SectionHead } from "@/components/ui/section-head";
import { PracticeIcon } from "@/components/icons/practice-icons";
import { getAllPracticeAreas } from "@/lib/data/queries";
import type { IconName } from "@/lib/constants";

function formatNum(order: number): string {
  return String(order).padStart(2, "0");
}

export async function PracticeAreas() {
  const areas = await getAllPracticeAreas();
  return (
    <section className="bg-ivory px-5 py-16 md:px-[72px] md:py-24">
      <SectionHead
        eyebrow="What We Do"
        title="Our Practice Areas"
        viewAllHref="/practice-areas"
        viewAllLabel="View All Areas"
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {areas.map((area) => (
          <Link
            key={area.slug}
            href={`/practice-areas/${area.slug}`}
            className="bg-white border-t-2 border-gold px-4 py-5 relative overflow-hidden cursor-pointer transition-all hover:shadow-[0_12px_36px_rgba(26,64,53,.10)] hover:-translate-y-0.5 group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gold-pale to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <PracticeIcon name={area.icon_name as IconName} className="w-6 h-6 text-forest mb-3 relative z-10" />
            <div className="font-serif text-[11px] text-gold mb-1 relative z-10">{formatNum(area.display_order)}</div>
            <div className="font-sans text-[11px] font-semibold text-forest leading-snug relative z-10">
              {area.title}
            </div>
          </Link>
        ))}
        <Link
          href="/practice-areas"
          className="bg-forest min-h-[120px] flex flex-col items-center justify-center gap-2 hover:bg-forest-mid transition-colors"
        >
          <div className="text-lg text-gold">→</div>
          <div className="font-sans text-[9px] font-bold tracking-[2.5px] uppercase text-gold">
            All Practice Areas
          </div>
        </Link>
      </div>
    </section>
  );
}
