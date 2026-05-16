import Link from "next/link";
import type { Database } from "@/lib/supabase/types";

type PracticeArea = Database["public"]["Tables"]["practice_areas"]["Row"];

export function PracticeAreaTable({ areas }: { areas: PracticeArea[] }) {
  if (areas.length === 0) {
    return (
      <div className="bg-white py-16 text-center">
        <p className="font-sans text-[14px] font-light text-ink-muted">
          Belum ada bidang praktik.
        </p>
      </div>
    );
  }
  return (
    <table className="w-full bg-white">
      <thead>
        <tr className="border-b border-ivory-dark">
          <th className="text-left font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted px-6 py-4 w-16">
            #
          </th>
          <th className="text-left font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted px-4 py-4">
            Judul
          </th>
          <th className="text-left font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted px-4 py-4">
            Slug
          </th>
          <th className="text-left font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted px-4 py-4">
            Layanan
          </th>
        </tr>
      </thead>
      <tbody>
        {areas.map((area) => (
          <tr
            key={area.id}
            className="border-b border-ivory-dark hover:bg-gold/5 transition-colors"
          >
            <td className="px-6 py-4 font-serif text-[14px] text-gold">
              {String(area.display_order).padStart(2, "0")}
            </td>
            <td className="px-4 py-4">
              <Link
                href={`/admin/practice-areas/${area.id}`}
                className="font-serif text-[16px] font-medium text-forest hover:text-gold transition-colors"
              >
                {area.title}
              </Link>
            </td>
            <td className="px-4 py-4 font-mono text-[12px] text-ink-muted">{area.slug}</td>
            <td className="px-4 py-4 font-sans text-[12px] text-ink-muted">
              {area.services?.length ?? 0} tercantum
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
