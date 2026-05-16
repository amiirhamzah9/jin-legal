import { useTranslations } from "next-intl";

const STATS = [
  { num: "12", suffix: "+", key: "practiceAreas" },
  { num: "7", suffix: "", key: "seniorPartners" },
  { num: "200", suffix: "+", key: "clientsServed" },
  { num: "10", suffix: "+", key: "yearsExcellence" },
] as const;

export function StatsBar() {
  const t = useTranslations("Stats");
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 bg-ivory-dark border-b border-ivory-dark">
      {STATS.map((stat, i) => {
        const isLast = i === STATS.length - 1;
        const mobileRightBorder = i % 2 === 0 ? "border-r" : "";
        const mobileBottomBorder = i < 2 ? "border-b" : "";
        const desktopRightBorder = !isLast ? "md:border-r" : "md:border-r-0";
        return (
          <div
            key={stat.key}
            className={`px-6 py-7 md:px-12 md:py-9 transition-colors hover:bg-gold-pale border-black/[0.07] md:border-b-0 ${mobileRightBorder} ${mobileBottomBorder} ${desktopRightBorder}`}
          >
            <div className="font-serif text-[46px] font-light text-forest leading-none">
              {stat.num}
              {stat.suffix && <sup className="text-[22px] text-gold align-super">{stat.suffix}</sup>}
            </div>
            <div className="font-sans text-[9px] tracking-[2.5px] uppercase text-ink-muted mt-2 font-medium">
              {t(stat.key)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
