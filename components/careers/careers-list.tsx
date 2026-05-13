import { CareerCard } from "./career-card";
import type { Database } from "@/lib/supabase/types";

type Career = Database["public"]["Tables"]["careers"]["Row"];

export function CareersList({ careers }: { careers: Career[] }) {
  if (careers.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-sans text-[14px] font-light text-ink-muted mb-3">
          No openings right now.
        </p>
        <p className="font-sans text-[12px] font-light text-ink-faint">
          Want to introduce yourself anyway? Reach out to careers@jin-legal.com.
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
