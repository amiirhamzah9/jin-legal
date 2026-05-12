import Link from "next/link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { VALUES } from "@/lib/constants";

export function AboutStrip() {
  return (
    <section className="bg-forest px-[72px] py-24 grid grid-cols-2 gap-24 items-center relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-80 h-80 border border-gold/20 rounded-full pointer-events-none" />
      <div className="absolute top-5 right-5 w-44 h-44 border border-gold/10 rounded-full pointer-events-none" />

      <div>
        <Eyebrow className="mb-4">About the Firm</Eyebrow>
        <h2 className="font-serif text-[42px] font-light text-white leading-tight mb-7">
          A <strong className="font-semibold text-gold">Modern Legal Partner</strong> for a Complex World
        </h2>
        <p className="font-sans text-sm font-light text-white/50 leading-[1.9] mb-4 tracking-wide">
          Jin Legal — the practice of PT Juris International Network — was founded on the principle that exceptional legal counsel must be both strategically sharp and deeply human.
        </p>
        <p className="font-sans text-sm font-light text-white/50 leading-[1.9] mb-4 tracking-wide">
          We bring together six partners with deep expertise across corporate law, dispute resolution, emerging technologies, and specialized practice areas that define today&apos;s business landscape in Indonesia.
        </p>
        <Link
          href="/about"
          className="inline-flex items-center gap-2.5 font-sans text-[10px] font-semibold tracking-[2.5px] uppercase text-gold no-underline mt-3 hover:gap-[18px] transition-all"
        >
          Learn More About Us →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-[3px] relative">
        {VALUES.map((val) => (
          <div
            key={val.title}
            className="px-5 py-6 bg-white/[0.04] border-t-2 border-gold/25 hover:bg-gold/[0.06] hover:border-gold transition-all"
          >
            <h4 className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-gold mb-2">
              {val.title}
            </h4>
            <p className="font-sans text-xs text-white/40 leading-[1.65]">{val.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
