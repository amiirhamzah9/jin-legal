import { useTranslations } from "next-intl";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Link } from "@/i18n/navigation";

const VALUE_KEYS = ["integrity", "precision", "innovation", "results"] as const;

export function AboutStrip() {
  const t = useTranslations("Home");
  const tValues = useTranslations("Values");

  return (
    <section className="bg-forest px-5 py-16 md:px-[72px] md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center relative overflow-hidden">
      <div className="hidden md:block absolute -top-20 -right-20 w-80 h-80 border border-gold/20 rounded-full pointer-events-none" />
      <div className="hidden md:block absolute top-5 right-5 w-44 h-44 border border-gold/10 rounded-full pointer-events-none" />

      <div>
        <Eyebrow className="mb-4">{t("aboutEyebrow")}</Eyebrow>
        <h2 className="font-serif text-[32px] md:text-[42px] font-light text-white leading-tight mb-7">
          {t("aboutTitle")}
        </h2>
        <p className="font-sans text-sm font-light text-white/50 leading-[1.9] mb-4 tracking-wide">
          {t("aboutBody")}
        </p>
        <p className="font-sans text-sm font-light text-white/50 leading-[1.9] mb-4 tracking-wide">
          {t("aboutBody2")}
        </p>
        <Link
          href="/about"
          className="inline-flex items-center gap-2.5 font-sans text-[10px] font-semibold tracking-[2.5px] uppercase text-gold no-underline mt-3 hover:gap-[18px] transition-all"
        >
          {t("learnMore")}
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-[3px] relative">
        {VALUE_KEYS.map((key) => (
          <div
            key={key}
            className="px-5 py-6 bg-white/[0.04] border-t-2 border-gold/25 hover:bg-gold/[0.06] hover:border-gold transition-all"
          >
            <h4 className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-gold mb-2">
              {tValues(`${key}Title`)}
            </h4>
            <p className="font-sans text-xs text-white/40 leading-[1.65]">
              {tValues(`${key}Body`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
