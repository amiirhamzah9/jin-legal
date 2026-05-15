import Link from "next/link";
import type { Database } from "@/lib/supabase/types";

type Career = Database["public"]["Tables"]["careers"]["Row"];

export function CareerCard({ career }: { career: Career }) {
  const detailHref = `/careers/${career.slug}`;
  return (
    <article className="bg-white border-t-2 border-gold p-8 transition-all hover:shadow-[0_16px_40px_rgba(26,64,53,.08)] hover:-translate-y-0.5">
      <div className="flex items-center gap-3 mb-4">
        <span className="font-sans text-[9px] font-bold tracking-[2px] uppercase text-gold bg-gold/10 px-3 py-1">
          {career.type}
        </span>
        {career.location && (
          <span className="font-sans text-[11px] text-ink-muted">{career.location}</span>
        )}
      </div>
      <h3 className="font-serif text-[24px] font-medium text-forest leading-tight mb-4">
        {career.title}
      </h3>
      <p className="font-sans text-[13px] font-light text-ink-muted leading-[1.75] mb-6 line-clamp-3">
        {career.description.replace(/\*\*/g, "").replace(/\n+/g, " ")}
      </p>
      <Link
        href={detailHref}
        className="inline-flex items-center gap-2 font-sans text-[10px] font-bold tracking-[2px] uppercase text-gold hover:gap-3 transition-all"
      >
        View Details & Apply →
      </Link>
    </article>
  );
}
