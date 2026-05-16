import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { TeamTable } from "@/components/admin/team-table";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  await requireAdmin();
  const supabase = createClient();
  const { data: members } = await supabase
    .from("team_members")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <div>
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="font-sans text-[10px] font-bold tracking-[2.5px] uppercase text-gold mb-2">
            Personalia
          </div>
          <h1 className="font-serif text-[34px] font-light text-forest leading-tight">
            Anggota Tim
          </h1>
        </div>
        <Link
          href="/admin/team/new"
          className="bg-gold text-forest-deep font-sans text-[10px] font-bold tracking-[2.5px] uppercase px-7 py-3.5 hover:bg-gold-light transition-colors"
        >
          Anggota Baru
        </Link>
      </div>
      <TeamTable members={members ?? []} />
    </div>
  );
}
