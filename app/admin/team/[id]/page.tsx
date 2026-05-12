import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { TeamForm } from "@/components/admin/team-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteTeamMember } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditTeamMemberPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin();
  const supabase = createClient();
  const { data: member } = await supabase
    .from("team_members")
    .select("*")
    .eq("id", params.id)
    .single();
  if (!member) notFound();

  return (
    <div>
      <Link
        href="/admin/team"
        className="inline-flex items-center gap-2 font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted hover:text-gold transition-colors mb-8"
      >
        ← Back to Team
      </Link>
      <div className="flex items-start justify-between mb-10">
        <div>
          <div className="font-sans text-[10px] font-bold tracking-[2.5px] uppercase text-gold mb-2">
            Edit Member
          </div>
          <h1 className="font-serif text-[28px] font-light text-forest leading-tight">
            {member.name}{" "}
            {member.credentials && (
              <span className="text-ink-muted">{member.credentials}</span>
            )}
          </h1>
        </div>
        <DeleteButton
          label="Delete Member"
          onConfirm={async () => {
            "use server";
            await deleteTeamMember(member.id);
          }}
        />
      </div>
      <TeamForm mode="edit" member={member} />
    </div>
  );
}
