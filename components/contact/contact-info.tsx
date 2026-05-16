import { useTranslations } from "next-intl";
import { Eyebrow } from "@/components/ui/eyebrow";

export function ContactInfo() {
  const t = useTranslations("Contact");
  const tFooter = useTranslations("Footer");

  const INFO_BLOCKS = [
    {
      label: t("office"),
      lines: [tFooter("city"), "JIN Legal Counsel"],
    },
    {
      label: t("emailLabel"),
      lines: ["center@jin-legal.com"],
    },
    {
      label: t("workingHours"),
      lines: [t("workingDays"), t("workingTime")],
    },
  ];

  return (
    <div>
      <Eyebrow className="mb-5">{t("reachUsEyebrow")}</Eyebrow>
      <h2 className="font-serif text-[28px] font-light text-forest leading-tight mb-10">
        {t("getInTouch")}
      </h2>
      <div className="space-y-7">
        {INFO_BLOCKS.map((block) => (
          <div key={block.label} className="border-l-2 border-gold pl-5">
            <div className="font-sans text-[9px] font-bold tracking-[2.5px] uppercase text-gold mb-2">
              {block.label}
            </div>
            {block.lines.map((line) => (
              <div
                key={line}
                className="font-sans text-[13px] font-light text-ink leading-[1.6]"
              >
                {line}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
