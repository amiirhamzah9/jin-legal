import Link from "next/link";
import type { Database } from "@/lib/supabase/types";

type Career = Database["public"]["Tables"]["careers"]["Row"];

export function CareerTable({ careers }: { careers: Career[] }) {
  if (careers.length === 0) {
    return (
      <div className="bg-white py-16 text-center">
        <p className="font-sans text-[14px] font-light text-ink-muted">
          No careers posted. Create one above.
        </p>
      </div>
    );
  }
  return (
    <table className="w-full bg-white">
      <thead>
        <tr className="border-b border-ivory-dark">
          <th className="text-left font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted px-6 py-4">
            Title
          </th>
          <th className="text-left font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted px-4 py-4">
            Type
          </th>
          <th className="text-left font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted px-4 py-4">
            Location
          </th>
          <th className="text-left font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted px-4 py-4">
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        {careers.map((career) => (
          <tr
            key={career.id}
            className="border-b border-ivory-dark hover:bg-gold/5 transition-colors"
          >
            <td className="px-6 py-4">
              <Link
                href={`/admin/careers/${career.id}`}
                className="font-serif text-[16px] font-medium text-forest hover:text-gold transition-colors"
              >
                {career.title}
              </Link>
            </td>
            <td className="px-4 py-4 font-sans text-[12px] text-ink-muted">
              {career.type}
            </td>
            <td className="px-4 py-4 font-sans text-[12px] text-ink-muted">
              {career.location ?? "—"}
            </td>
            <td className="px-4 py-4">
              <span
                className={`font-sans text-[9px] font-bold tracking-[2px] uppercase px-2 py-1 ${
                  career.is_active
                    ? "bg-gold/10 text-gold"
                    : "bg-ivory-dark text-ink-muted"
                }`}
              >
                {career.is_active ? "Active" : "Inactive"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
