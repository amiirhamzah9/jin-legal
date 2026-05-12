import Link from "next/link";
import type { Database } from "@/lib/supabase/types";

type Lead = Database["public"]["Tables"]["contact_leads"]["Row"];

function formatRelative(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function LeadRow({ lead }: { lead: Lead }) {
  const unreadAccent = !lead.is_read ? "border-l-2 border-l-gold" : "border-l-2 border-l-transparent";
  return (
    <Link
      href={`/admin/leads/${lead.id}`}
      className={`block bg-white px-6 py-5 hover:bg-gold/5 transition-colors ${unreadAccent}`}
    >
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-center gap-3">
          <span
            className={`font-serif text-[18px] ${
              lead.is_read ? "text-ink-muted font-light" : "text-forest font-medium"
            }`}
          >
            {lead.name}
          </span>
          {!lead.is_read && (
            <span className="font-sans text-[8px] font-bold tracking-[2px] uppercase text-gold bg-gold/10 px-2 py-0.5">
              New
            </span>
          )}
        </div>
        <span className="font-sans text-[11px] text-ink-faint">
          {formatRelative(lead.created_at)}
        </span>
      </div>
      <div className="font-sans text-[12px] text-ink-muted mb-1">
        {lead.email}
        {lead.subject && <span className="text-ink-faint"> · {lead.subject}</span>}
      </div>
      <div className="font-sans text-[13px] font-light text-ink leading-[1.6] line-clamp-2">
        {lead.message}
      </div>
    </Link>
  );
}
