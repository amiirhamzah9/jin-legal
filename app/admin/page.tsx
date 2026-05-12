import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/admin/stat-card";

export const dynamic = "force-dynamic";

async function getCounts() {
  const supabase = createClient();
  const [postsAll, postsPublished, leadsAll, leadsUnread, careersAll] = await Promise.all([
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
  ]);
  return {
    postsTotal: postsAll.count ?? 0,
    postsPublished: postsPublished.count ?? 0,
    leadsTotal: leadsAll.count ?? 0,
    leadsUnread: leadsUnread.count ?? 0,
    careersActive: careersAll.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  await requireAdmin();
  const counts = await getCounts();

  return (
    <div>
      <div className="mb-10">
        <div className="font-sans text-[10px] font-bold tracking-[2.5px] uppercase text-gold mb-2">
          Overview
        </div>
        <h1 className="font-serif text-[34px] font-light text-forest leading-tight">
          Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-12">
        <StatCard
          label="Blog Posts"
          value={counts.postsTotal}
          helper={`${counts.postsPublished} published`}
        />
        <StatCard
          label="Contact Leads"
          value={counts.leadsTotal}
          helper={`${counts.leadsUnread} unread`}
        />
        <StatCard
          label="Active Careers"
          value={counts.careersActive}
        />
        <StatCard label="Practice Areas" value={11} helper="managed in code" />
      </div>

      <div className="grid grid-cols-3 gap-5">
        <Link
          href="/admin/blog/new"
          className="bg-forest text-white px-6 py-5 hover:bg-forest-mid transition-colors"
        >
          <div className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-gold mb-2">
            Quick Action
          </div>
          <div className="font-serif text-[18px] font-medium">
            New Blog Post →
          </div>
        </Link>
        <Link
          href="/admin/leads"
          className="bg-forest text-white px-6 py-5 hover:bg-forest-mid transition-colors"
        >
          <div className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-gold mb-2">
            Quick Action
          </div>
          <div className="font-serif text-[18px] font-medium">View Leads →</div>
        </Link>
        <Link
          href="/admin/careers/new"
          className="bg-forest text-white px-6 py-5 hover:bg-forest-mid transition-colors"
        >
          <div className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-gold mb-2">
            Quick Action
          </div>
          <div className="font-serif text-[18px] font-medium">
            Post a Job →
          </div>
        </Link>
      </div>
    </div>
  );
}
