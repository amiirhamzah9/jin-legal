import Link from "next/link";
import { PracticeIcon } from "@/components/icons/practice-icons";
import type { PracticeArea } from "@/lib/constants";

export function PracticeDetailHero({ area }: { area: PracticeArea }) {
  return (
    <section className="bg-forest-deep pt-[120px] pb-20 px-[72px] relative overflow-hidden">
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
        <div className="grid grid-cols-[auto_1fr] gap-8 items-start">
          <div className="border border-gold/30 p-5">
            <PracticeIcon name={area.icon} className="w-12 h-12 text-gold" />
          </div>
          <div>
            <div className="font-serif text-[28px] text-gold font-light mb-3">
              {area.num}
            </div>
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
