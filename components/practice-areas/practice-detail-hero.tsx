import Link from "next/link";
import { PracticeIcon } from "@/components/icons/practice-icons";
import type { Database } from "@/lib/supabase/types";
import type { IconName } from "@/lib/constants";

type PracticeArea = Database["public"]["Tables"]["practice_areas"]["Row"];

function formatNum(order: number): string {
  return String(order).padStart(2, "0");
}

export function PracticeDetailHero({ area }: { area: PracticeArea }) {
  const num = formatNum(area.display_order);
  return (
    <section className="bg-forest-deep pt-[100px] pb-12 px-5 md:pt-[120px] md:pb-20 md:px-[72px] relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,168,76,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,.04) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      />
      <div className="relative z-10 max-w-[1100px] mx-auto">
        <nav className="flex items-center gap-3 font-sans text-[10px] tracking-[2px] uppercase text-white/40 mb-10">
          <Link href="/practice-areas" className="hover:text-gold transition-colors">
            Practice Areas
          </Link>
          <span className="text-gold/50">/</span>
          <span className="text-gold">{area.title}</span>
        </nav>
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-8 items-start">
          <div className="border border-gold/30 p-5">
            <PracticeIcon name={area.icon_name as IconName} className="w-12 h-12 text-gold" />
          </div>
          <div>
            <div className="font-serif text-[28px] text-gold font-light mb-3">{num}</div>
            <h1 className="font-serif text-[clamp(36px,4.8vw,56px)] font-light text-white leading-[1.15] tracking-tight mb-6">
              {area.title}
            </h1>
            <p className="font-sans text-[15px] font-light text-white/55 leading-[1.85] max-w-[640px]">
              {area.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
