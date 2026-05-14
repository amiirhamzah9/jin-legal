import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <div className="bg-gold px-5 py-7 md:px-[72px] md:py-9 flex flex-col md:flex-row items-start md:items-center md:justify-between gap-4 md:gap-10 relative overflow-hidden">
      <div className="hidden md:block absolute -right-14 -top-14 w-44 h-44 border border-white/15 rounded-full" />
      <div className="hidden md:block absolute right-10 top-10 w-24 h-24 border border-white/10 rounded-full" />
      <div className="relative z-10">
        <h2 className="font-serif text-[22px] md:text-[28px] font-normal text-white leading-[1.2]">
          Ready to work with us?
        </h2>
        <p className="font-sans text-[12px] font-light text-white/75 mt-1">
          Schedule a consultation with one of our partners today.
        </p>
      </div>
      <Button variant="white" href="/contact" className="whitespace-nowrap relative z-10">
        Get in Touch
      </Button>
    </div>
  );
}
