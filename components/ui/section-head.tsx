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
    <div className="flex justify-between items-end mb-12">
      <div>
        <Eyebrow className="mb-2.5">{eyebrow}</Eyebrow>
        <h2 className="font-serif text-4xl font-normal text-forest">{title}</h2>
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
