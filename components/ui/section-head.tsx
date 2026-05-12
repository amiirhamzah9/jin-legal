import Link from "next/link";
import { Eyebrow } from "./eyebrow";

export function SectionHead({
  eyebrow,
  title,
  viewAllHref,
  viewAllLabel,
}: {
  eyebrow: string;
  title: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}) {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 md:gap-0 mb-8 md:mb-12">
      <div>
        <Eyebrow className="mb-2.5">{eyebrow}</Eyebrow>
        <h2 className="font-serif text-3xl md:text-4xl font-normal text-forest">{title}</h2>
      </div>
      {viewAllHref && viewAllLabel && (
        <Link
          href={viewAllHref}
          className="font-sans text-[10px] font-semibold tracking-[2px] uppercase text-forest border-b border-gold pb-0.5 hover:text-gold transition-colors"
        >
          {viewAllLabel}
        </Link>
      )}
    </div>
  );
}
