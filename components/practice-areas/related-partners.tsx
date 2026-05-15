import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Eyebrow } from "@/components/ui/eyebrow";
import { getTeamMembersForPracticeArea } from "@/lib/data/queries";
import type { Locale } from "@/i18n/routing";

export async function RelatedPartners({ practiceSlug }: { practiceSlug: string }) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("PracticeAreas");
  const tHome = await getTranslations("Home");
  const relevant = await getTeamMembersForPracticeArea(practiceSlug, locale);
  if (relevant.length === 0) return null;

  return (
    <section className="bg-forest-deep px-5 py-12 md:px-[72px] md:py-20">
      <div className="max-w-[1100px] mx-auto">
        <Eyebrow className="mb-5">{tHome("teamEyebrow")}</Eyebrow>
        <h2 className="font-serif text-[32px] font-light text-white leading-tight mb-12">
          {t("relatedPartners")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[3px]">
          {relevant.map((partner) => (
            <div key={partner.id} className="relative overflow-hidden group">
              {partner.photo_url && (
                <Image
                  src={partner.photo_url}
                  alt={partner.name}
                  width={500}
                  height={600}
                  className="w-full h-[300px] md:h-[340px] object-cover object-top grayscale-[40%] brightness-[.85] saturate-[.9] transition-all duration-500 group-hover:grayscale-0 group-hover:brightness-100 group-hover:saturate-100 group-hover:scale-[1.04]"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 px-5 pt-12 pb-5 [background:linear-gradient(0deg,rgba(10,24,18,.96)_0%,transparent_100%)]">
                <div className="font-sans text-[9px] tracking-[3px] text-gold font-bold uppercase mb-1">
                  {partner.role}
                </div>
                <div className="font-serif text-[18px] text-white font-medium">{partner.name}</div>
                <div className="font-sans text-[10px] text-white/35">{partner.credentials}</div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-[450ms]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
