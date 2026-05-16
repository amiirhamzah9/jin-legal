import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { PracticeAreaTable } from "@/components/admin/practice-area-table";

export const dynamic = "force-dynamic";

export default async function AdminPracticeAreasPage() {
  await requireAdmin();
  const supabase = createClient();
  const { data: areas } = await supabase
    .from("practice_areas")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <div>
      <div className="mb-10">
        <div className="font-sans text-[10px] font-bold tracking-[2.5px] uppercase text-gold mb-2">
          Konten
        </div>
        <h1 className="font-serif text-[34px] font-light text-forest leading-tight">
          Bidang Praktik
        </h1>
        <p className="font-sans text-[13px] font-light text-ink-muted mt-3 max-w-[700px]">
          Sunting deskripsi, konten, dan layanan untuk setiap bidang praktik. Slug
          bersifat tetap — terhubung dengan URL publik (mis.{" "}
          <code className="text-forest">/practice-areas/business-corporate-law</code>).
        </p>
      </div>
      <PracticeAreaTable areas={areas ?? []} />
    </div>
  );
}
