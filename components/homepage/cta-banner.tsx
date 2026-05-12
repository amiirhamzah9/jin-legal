import Link from "next/link";

export function CtaBanner() {
  return (
    <div className="bg-gold px-[72px] py-[72px] flex items-center justify-between gap-10 relative overflow-hidden">
      <div className="absolute -right-14 -top-14 w-60 h-60 border border-white/15 rounded-full" />
      <div className="absolute right-10 top-10 w-32 h-32 border border-white/10 rounded-full" />
      <div className="relative z-10">
        <h2 className="font-serif text-[38px] font-normal text-white leading-[1.15]">
          Ready to work <em className="italic font-light">with us?</em>
        </h2>
        <p className="font-sans text-[13px] font-light text-white/75 mt-2">
          Schedule a consultation with one of our partners today.
        </p>
      </div>
      <Link
        href="/contact"
        className="bg-white text-forest font-sans text-[10px] font-bold tracking-[2.5px] uppercase no-underline px-9 py-4 whitespace-nowrap hover:bg-forest hover:text-white transition-all relative z-10"
      >
        Get in Touch
      </Link>
    </div>
  );
}
