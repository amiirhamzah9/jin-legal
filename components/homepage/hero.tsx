import Link from "next/link";
import { Eyebrow } from "@/components/ui/eyebrow";

export function Hero() {
  return (
    <section className="min-h-screen bg-forest-deep relative overflow-hidden flex items-center px-5 md:px-[72px]">
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1800&q=70&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_70%_50%,rgba(26,64,53,.5)_0%,transparent_60%)]" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,168,76,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,.05) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      />
      <div className="relative z-10 max-w-[740px]">
        <Eyebrow withLine className="mb-8">PT Juris International Network</Eyebrow>
        <h1 className="font-serif text-[clamp(36px,8vw,82px)] font-light text-white leading-[1.18] tracking-tight mb-7">
          Legal Excellence,
          <em className="block not-italic">
            <span
              className="italic font-normal bg-clip-text text-transparent pt-1.5 inline-block"
              style={{
                backgroundImage: "linear-gradient(135deg, #c9a84c 0%, #e2c97e 100%)",
              }}
            >
              Strategic Results.
            </span>
          </em>
        </h1>
        <p className="text-[15px] font-light text-white/50 leading-[1.8] max-w-[480px] mb-11 tracking-[0.3px]">
          A full-service legal consultancy serving corporations, institutions, and individuals across 11 practice areas throughout Indonesia and beyond.
        </p>
        <div className="flex gap-3.5 flex-wrap">
          <Link
            href="/contact"
            className="bg-gold text-forest-deep font-sans text-[10px] font-bold tracking-[2.5px] uppercase no-underline px-[34px] py-3.5 hover:bg-gold-light transition-colors"
          >
            Consult With Us
          </Link>
          <Link
            href="/practice-areas"
            className="bg-transparent border border-white/20 text-white/65 font-sans text-[10px] font-medium tracking-[2px] uppercase no-underline px-[34px] py-3.5 hover:border-gold hover:text-gold transition-colors"
          >
            Explore Practice Areas
          </Link>
        </div>
      </div>
      <div className="hidden md:block absolute right-[72px] bottom-[52px] z-10 border border-gold/20 px-7 py-5 text-right bg-forest-deep/60 backdrop-blur">
        <div className="font-serif text-[44px] font-light text-white leading-none">11</div>
        <div className="font-sans text-[9px] tracking-[3px] text-gold uppercase mt-1.5">Practice Areas</div>
      </div>
    </section>
  );
}
