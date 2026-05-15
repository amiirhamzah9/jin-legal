import { useTranslations } from "next-intl";
import { Eyebrow } from "@/components/ui/eyebrow";

const VALUE_KEYS = ["integrity", "precision", "innovation", "results"] as const;

export function FirmStory() {
  const t = useTranslations("About");
  const tValues = useTranslations("Values");

  return (
    <section className="bg-ivory px-5 py-12 md:px-[72px] md:py-24">
      <div className="max-w-[1100px] mx-auto">
        <Eyebrow className="mb-5">{t("whoEyebrow")}</Eyebrow>
        <h2 className="font-serif text-[32px] md:text-[42px] font-light text-forest leading-tight mb-12">
          {t("ourStory")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-10 md:gap-20 mb-12 md:mb-20">
          <div className="space-y-5">
            <p className="font-sans text-[15px] font-light text-ink leading-[1.85]">
              <strong className="font-semibold">JIN Legal Counsel</strong>{" "}
              {t("story1").replace("JIN Legal Counsel ", "")}
            </p>
            <p className="font-sans text-[15px] font-light text-ink-muted leading-[1.85]">
              {t("story2")}
            </p>
            <p className="font-sans text-[15px] font-light text-ink-muted leading-[1.85]">
              {t("story3")}
            </p>
          </div>
          <div className="relative">
            <div
              className="aspect-[4/5] bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&h=1125&fit=crop&q=85')",
              }}
            />
            <div className="absolute -bottom-6 -left-6 bg-gold px-7 py-5 text-forest-deep">
              <div className="font-serif text-[32px] font-light leading-none">10+</div>
              <div className="font-sans text-[9px] tracking-[2.5px] uppercase mt-1 font-bold">
                {t("yearsExcellence")}
              </div>
            </div>
          </div>
        </div>

        <div>
          <Eyebrow className="mb-5">{t("valuesEyebrow")}</Eyebrow>
          <h3 className="font-serif text-[22px] md:text-[28px] font-light text-forest leading-tight mb-10">
            {t("ourCoreValues")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {VALUE_KEYS.map((key) => (
              <div
                key={key}
                className="bg-white border-t-2 border-gold p-7 hover:shadow-[0_12px_36px_rgba(26,64,53,.08)] transition-shadow"
              >
                <h4 className="font-sans text-[11px] font-bold tracking-[2px] uppercase text-gold mb-3">
                  {tValues(`${key}Title`)}
                </h4>
                <p className="font-sans text-[13px] font-light text-ink-muted leading-[1.7]">
                  {tValues(`${key}Body`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
