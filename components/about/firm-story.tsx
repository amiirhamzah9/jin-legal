import { Eyebrow } from "@/components/ui/eyebrow";
import { VALUES } from "@/lib/constants";

export function FirmStory() {
  return (
    <section className="bg-ivory px-[72px] py-24">
      <div className="max-w-[1100px] mx-auto">
        <Eyebrow className="mb-5">Who We Are</Eyebrow>
        <h2 className="font-serif text-[42px] font-light text-forest leading-tight mb-12">
          Our Story
        </h2>

        <div className="grid grid-cols-[1fr_1fr] gap-20 mb-20">
          <div className="space-y-5">
            <p className="font-sans text-[15px] font-light text-ink leading-[1.85]">
              Jin Legal — the practice of <strong className="font-semibold">PT Juris International Network</strong> — was founded on a simple principle: exceptional legal counsel must be both strategically sharp and deeply human.
            </p>
            <p className="font-sans text-[15px] font-light text-ink-muted leading-[1.85]">
              We bring together six partners with deep expertise across corporate law, dispute resolution, emerging technologies, and specialized practice areas that define today&apos;s business landscape in Indonesia. Our team has advised clients ranging from venture-backed startups to established multinationals.
            </p>
            <p className="font-sans text-[15px] font-light text-ink-muted leading-[1.85]">
              What sets us apart isn&apos;t just our technical expertise — it&apos;s our commitment to understanding each client&apos;s commercial reality before we ever open a statute book. We measure success by the outcomes we achieve, not the hours we bill.
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
                Years of Excellence
              </div>
            </div>
          </div>
        </div>

        <div>
          <Eyebrow className="mb-5">What We Stand For</Eyebrow>
          <h3 className="font-serif text-[28px] font-light text-forest leading-tight mb-10">
            Our Core Values
          </h3>
          <div className="grid grid-cols-4 gap-5">
            {VALUES.map((val) => (
              <div
                key={val.title}
                className="bg-white border-t-2 border-gold p-7 hover:shadow-[0_12px_36px_rgba(26,64,53,.08)] transition-shadow"
              >
                <h4 className="font-sans text-[11px] font-bold tracking-[2px] uppercase text-gold mb-3">
                  {val.title}
                </h4>
                <p className="font-sans text-[13px] font-light text-ink-muted leading-[1.7]">
                  {val.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
