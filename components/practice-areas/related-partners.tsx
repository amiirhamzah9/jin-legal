import Image from "next/image";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PARTNERS } from "@/lib/constants";

export function RelatedPartners({ practiceSlug }: { practiceSlug: string }) {
  const relevant = PARTNERS.filter((p) =>
    (p.practiceAreas as readonly string[]).includes(practiceSlug)
  );
  if (relevant.length === 0) return null;

  return (
    <section className="bg-forest-deep px-5 py-12 md:px-[72px] md:py-20">
      <div className="max-w-[1100px] mx-auto">
        <Eyebrow className="mb-5">Our People</Eyebrow>
        <h2 className="font-serif text-[32px] font-light text-white leading-tight mb-12">
          Partners in This Practice
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[3px]">
          {relevant.map((partner) => (
            <div key={partner.slug} className="relative overflow-hidden group">
              <Image
                src={partner.photo}
                alt={partner.name}
                width={500}
                height={600}
                className="w-full h-[300px] md:h-[340px] object-cover object-top grayscale-[40%] brightness-[.85] saturate-[.9] transition-all duration-500 group-hover:grayscale-0 group-hover:brightness-100 group-hover:saturate-100 group-hover:scale-[1.04]"
              />
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
