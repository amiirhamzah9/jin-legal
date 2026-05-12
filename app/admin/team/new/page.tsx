import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin";
import { TeamForm } from "@/components/admin/team-form";

export const dynamic = "force-dynamic";

export default async function NewTeamMemberPage() {
  await requireAdmin();
  return (
    <div>
      <Link
        href="/admin/team"
        className="inline-flex items-center gap-2 font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted hover:text-gold transition-colors mb-8"
      >
        ← Back to Team
      </Link>
      <div className="mb-10">
        <div className="font-sans text-[10px] font-bold tracking-[2.5px] uppercase text-gold mb-2">
          New Member
        </div>
        <h1 className="font-serif text-[34px] font-light text-forest leading-tight">
          Add Team Member
        </h1>
      </div>
      <TeamForm mode="create" />
    </div>
  );
}
