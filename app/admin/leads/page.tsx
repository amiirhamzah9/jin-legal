import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { LeadRow } from "@/components/admin/lead-row";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  await requireAdmin();
  const supabase = createClient();
  const { data: leads } = await supabase
    .from("contact_leads")
    .select("*")
    .order("created_at", { ascending: false });

  const list = leads ?? [];

  return (
    <div>
      <div className="mb-10">
        <div className="font-sans text-[10px] font-bold tracking-[2.5px] uppercase text-gold mb-2">
          Inbox
        </div>
        <h1 className="font-serif text-[34px] font-light text-forest leading-tight">
          Contact Leads
        </h1>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-20 bg-white">
          <p className="font-sans text-[14px] font-light text-ink-muted">
            No leads yet — when visitors submit the contact form they&apos;ll appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {list.map((lead) => (
            <LeadRow key={lead.id} lead={lead} />
          ))}
        </div>
      )}
    </div>
  );
}
