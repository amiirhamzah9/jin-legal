import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin";
import { CareerForm } from "@/components/admin/career-form";

export const dynamic = "force-dynamic";

export default async function NewCareerPage() {
  await requireAdmin();
  return (
    <div>
      <Link
        href="/admin/careers"
        className="inline-flex items-center gap-2 font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted hover:text-gold transition-colors mb-8"
      >
        ← Kembali ke Karier
      </Link>
      <div className="mb-10">
        <div className="font-sans text-[10px] font-bold tracking-[2.5px] uppercase text-gold mb-2">
          Lowongan Baru
        </div>
        <h1 className="font-serif text-[34px] font-light text-forest leading-tight">
          Posting Lowongan
        </h1>
      </div>
      <CareerForm mode="create" />
    </div>
  );
}
