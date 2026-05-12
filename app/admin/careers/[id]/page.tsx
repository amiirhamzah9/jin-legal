import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { CareerForm } from "@/components/admin/career-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteCareer } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditCareerPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin();
  const supabase = createClient();
  const { data: career } = await supabase
    .from("careers")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!career) notFound();

  return (
    <div>
      <Link
        href="/admin/careers"
        className="inline-flex items-center gap-2 font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted hover:text-gold transition-colors mb-8"
      >
        ← Back to Careers
      </Link>
      <div className="flex items-start justify-between mb-10">
        <div>
          <div className="font-sans text-[10px] font-bold tracking-[2.5px] uppercase text-gold mb-2">
            Edit Career
          </div>
          <h1 className="font-serif text-[28px] font-light text-forest leading-tight">
            {career.title}
          </h1>
        </div>
        <DeleteButton
          label="Delete Career"
          onConfirm={async () => {
            "use server";
            await deleteCareer(career.id);
          }}
        />
      </div>
      <CareerForm mode="edit" career={career} />
    </div>
  );
}
