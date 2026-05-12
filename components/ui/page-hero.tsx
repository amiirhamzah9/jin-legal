import { Eyebrow } from "./eyebrow";

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="bg-forest-deep pt-[100px] pb-12 px-5 md:pt-[120px] md:pb-20 md:px-[72px] relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,168,76,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,.04) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      />
      <div className="relative z-10 max-w-[820px]">
        <Eyebrow withLine className="mb-6">
          {eyebrow}
        </Eyebrow>
        <h1 className="font-serif text-[clamp(40px,5.5vw,68px)] font-light text-white leading-[1.15] tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="font-sans text-[15px] font-light text-white/50 leading-[1.8] mt-7 max-w-[560px]">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
