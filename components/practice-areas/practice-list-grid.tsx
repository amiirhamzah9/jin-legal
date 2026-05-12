import Link from "next/link";
import { PRACTICE_AREAS } from "@/lib/constants";
import { PracticeIcon } from "@/components/icons/practice-icons";

export function PracticeListGrid() {
  return (
    <section className="bg-ivory px-[72px] py-20">
      <div className="grid grid-cols-3 gap-5">
        {PRACTICE_AREAS.map((area) => (
          <Link
            key={area.slug}
            href={`/practice-areas/${area.slug}`}
            className="bg-white border-t-2 border-gold p-7 relative overflow-hidden transition-all hover:shadow-[0_16px_40px_rgba(26,64,53,.10)] hover:-translate-y-1 group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gold-pale to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <PracticeIcon name={area.icon} className="w-8 h-8 text-forest mb-5" />
              <div className="font-serif text-[14px] text-gold mb-2">{area.num}</div>
              <h3 className="font-serif text-[20px] font-medium text-forest leading-tight mb-3">
                {area.title}
              </h3>
              <p className="font-sans text-[12px] font-light text-ink-muted leading-[1.7] mb-5">
                {area.description}
              </p>
              <div className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-gold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                Learn More →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
