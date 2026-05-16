import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/admin/stat-card";

export const dynamic = "force-dynamic";

async function getCounts() {
  const supabase = createClient();
  const [postsAll, postsPublished, leadsAll, leadsUnread, careersAll, teamAll, practiceAll] = await Promise.all([
    supabase.from("blog_posts").select("id", { count: "exact", head: true }),
    supabase
      .from("blog_posts")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true),
    supabase.from("contact_leads").select("id", { count: "exact", head: true }),
    supabase
      .from("contact_leads")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false),
    supabase
      .from("careers")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("team_members")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    supabase.from("practice_areas").select("id", { count: "exact", head: true }),
  ]);
  return {
    postsTotal: postsAll.count ?? 0,
    postsPublished: postsPublished.count ?? 0,
    leadsTotal: leadsAll.count ?? 0,
    leadsUnread: leadsUnread.count ?? 0,
    careersActive: careersAll.count ?? 0,
    teamActive: teamAll.count ?? 0,
    practiceAreas: practiceAll.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  await requireAdmin();
  const counts = await getCounts();

  return (
    <div>
      <div className="mb-10">
        <div className="font-sans text-[10px] font-bold tracking-[2.5px] uppercase text-gold mb-2">
          Ringkasan
        </div>
        <h1 className="font-serif text-[34px] font-light text-forest leading-tight">
          Dasbor
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5 mb-12">
        <StatCard
          label="Artikel Blog"
          value={counts.postsTotal}
          helper={`${counts.postsPublished} dipublikasi`}
        />
        <StatCard
          label="Lead Kontak"
          value={counts.leadsTotal}
          helper={`${counts.leadsUnread} belum dibaca`}
        />
        <StatCard
          label="Anggota Tim"
          value={counts.teamActive}
          helper="aktif"
        />
        <StatCard
          label="Lowongan Aktif"
          value={counts.careersActive}
        />
        <StatCard label="Bidang Praktik" value={counts.practiceAreas} />
      </div>

      <div className="grid grid-cols-3 gap-5">
        <Link
          href="/admin/blog/new"
          className="bg-forest text-white px-6 py-5 hover:bg-forest-mid transition-colors"
        >
          <div className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-gold mb-2">
            Aksi Cepat
          </div>
          <div className="font-serif text-[18px] font-medium">
            Artikel Baru →
          </div>
        </Link>
        <Link
          href="/admin/leads"
          className="bg-forest text-white px-6 py-5 hover:bg-forest-mid transition-colors"
        >
          <div className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-gold mb-2">
            Aksi Cepat
          </div>
          <div className="font-serif text-[18px] font-medium">Lihat Lead →</div>
        </Link>
        <Link
          href="/admin/careers/new"
          className="bg-forest text-white px-6 py-5 hover:bg-forest-mid transition-colors"
        >
          <div className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-gold mb-2">
            Aksi Cepat
          </div>
          <div className="font-serif text-[18px] font-medium">
            Posting Lowongan →
          </div>
        </Link>
      </div>
    </div>
  );
}
