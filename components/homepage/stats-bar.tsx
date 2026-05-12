import { STATS } from "@/lib/constants";

export function StatsBar() {
  return (
    <div className="grid grid-cols-4 bg-ivory-dark border-b border-ivory-dark">
      {STATS.map((stat, i) => (
        <div
          key={stat.label}
          className={`px-12 py-9 transition-colors hover:bg-gold-pale ${
            i < STATS.length - 1 ? "border-r border-black/[0.07]" : ""
          }`}
        >
          <div className="font-serif text-[46px] font-light text-forest leading-none">
            {stat.num}
            {stat.suffix && <sup className="text-[22px] text-gold align-super">{stat.suffix}</sup>}
          </div>
          <div className="font-sans text-[9px] tracking-[2.5px] uppercase text-ink-muted mt-2 font-medium">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
