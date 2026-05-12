import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { PracticeAreaForm } from "@/components/admin/practice-area-form";

export const dynamic = "force-dynamic";

export default async function EditPracticeAreaPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin();
  const supabase = createClient();
  const { data: area } = await supabase
    .from("practice_areas")
    .select("*")
    .eq("id", params.id)
    .single();
  if (!area) notFound();

  return (
    <div>
      <Link
        href="/admin/practice-areas"
        className="inline-flex items-center gap-2 font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted hover:text-gold transition-colors mb-8"
      >
        ← Back to Practice Areas
      </Link>
      <div className="mb-10">
        <div className="font-sans text-[10px] font-bold tracking-[2.5px] uppercase text-gold mb-2">
          Edit Practice Area
        </div>
        <h1 className="font-serif text-[28px] font-light text-forest leading-tight">
          {area.title}
        </h1>
      </div>
      <PracticeAreaForm area={area} />
    </div>
  );
}
