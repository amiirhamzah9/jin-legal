import { getTranslations } from "next-intl/server";
import { CareerCard } from "./career-card";
import type { Database } from "@/lib/supabase/types";

type Career = Database["public"]["Tables"]["careers"]["Row"];

export async function CareersList({ careers }: { careers: Career[] }) {
  const t = await getTranslations("Careers");
  if (careers.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-sans text-[14px] font-light text-ink-muted mb-3">
          {t("noOpenings")}
        </p>
        <p className="font-sans text-[12px] font-light text-ink-faint">
          {t("noOpeningsIntro")}
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {careers.map((career) => (
        <CareerCard key={career.id} career={career} />
      ))}
    </div>
  );
}
