import Link from "next/link";
import Image from "next/image";
import { Eyebrow } from "@/components/ui/eyebrow";

const FEATURED = [
  {
    name: "Muhammad Subuh Rezki",
    credentials: "S.H.",
    role: "Managing Partner",
    photo: "https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?w=600&h=720&fit=crop&q=80",
  },
  {
    name: "Ryan Tampubolon",
    credentials: "S.H.",
    role: "Partner",
    photo: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=600&h=720&fit=crop&q=80",
  },
  {
    name: "Abi Rafdi",
    credentials: "S.H.",
    role: "Partner",
    photo: "https://images.unsplash.com/photo-1629425733761-caae3b5f2e50?w=600&h=720&fit=crop&q=80",
  },
] as const;

export function TeamPreview() {
  return (
    <section className="bg-forest-deep px-5 py-16 md:px-[72px] md:py-24">
      <Eyebrow className="mb-2.5">Our People</Eyebrow>
      <h2 className="font-serif text-[28px] md:text-[40px] font-light text-white mb-12">
        Meet the <em className="italic text-gold">Partners</em>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[3px] mb-8">
        {FEATURED.map((partner) => (
          <div key={partner.name} className="relative overflow-hidden group">
            <Image
              src={partner.photo}
              alt={partner.name}
              width={600}
              height={720}
              className="w-full h-[320px] md:h-[360px] object-cover object-top transition-all duration-[550ms] grayscale-[30%] brightness-[.85] saturate-[.9] group-hover:grayscale-0 group-hover:brightness-100 group-hover:saturate-100 group-hover:scale-[1.04]"
            />
            <div className="absolute bottom-0 left-0 right-0 px-5 pt-14 pb-5 [background:linear-gradient(0deg,rgba(10,24,18,.97)_0%,transparent_100%)] translate-y-5 group-hover:translate-y-0 transition-transform duration-400">
              <div className="font-sans text-[9px] tracking-[3px] text-gold font-bold uppercase mb-1">
                {partner.role}
              </div>
              <div className="font-serif text-xl text-white font-medium mb-0.5">{partner.name}</div>
              <div className="font-sans text-[10px] text-white/35">{partner.credentials}</div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-[450ms]" />
          </div>
        ))}
      </div>
      <div className="text-center">
        <Link
          href="/team"
          className="inline-flex items-center gap-2.5 font-sans text-[10px] font-semibold tracking-[2px] uppercase text-gold border border-gold/30 px-8 py-3.5 no-underline hover:bg-gold hover:text-forest-deep transition-all"
        >
          View All Partners →
        </Link>
      </div>
    </section>
  );
}
