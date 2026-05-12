import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { MarkReadButton } from "@/components/admin/mark-read-button";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteLead, markLeadRead } from "../actions";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin();
  const supabase = createClient();
  const { data: lead } = await supabase
    .from("contact_leads")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!lead) notFound();

  // Auto-mark-as-read on first view
  if (!lead.is_read) {
    await markLeadRead(lead.id);
  }

  return (
    <div className="max-w-[800px]">
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-2 font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted hover:text-gold transition-colors mb-8"
      >
        ← Back to Inbox
      </Link>

      <div className="font-sans text-[10px] font-bold tracking-[2.5px] uppercase text-gold mb-3">
        {lead.subject ?? "General Inquiry"}
      </div>
      <h1 className="font-serif text-[34px] font-light text-forest leading-tight mb-2">
        {lead.name}
      </h1>
      <div className="font-sans text-[13px] text-ink-muted mb-1">
        <a href={`mailto:${lead.email}`} className="hover:text-gold transition-colors">
          {lead.email}
        </a>
      </div>
      {lead.phone && (
        <div className="font-sans text-[13px] text-ink-muted mb-1">{lead.phone}</div>
      )}
      {lead.company && (
        <div className="font-sans text-[13px] text-ink-muted mb-1">{lead.company}</div>
      )}
      <div className="font-sans text-[11px] text-ink-faint mt-3">
        Received {new Date(lead.created_at).toLocaleString("en-US")}
      </div>

      <div className="my-8 bg-white p-8 border-l-2 border-gold">
        <div className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-gold mb-4">
          Message
        </div>
        <p className="font-sans text-[15px] font-light text-ink leading-[1.85] whitespace-pre-wrap">
          {lead.message}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <MarkReadButton leadId={lead.id} isRead={lead.is_read} />
        <DeleteButton
          label="Delete Lead"
          onConfirm={async () => {
            "use server";
            await deleteLead(lead.id);
          }}
        />
      </div>
    </div>
  );
}
