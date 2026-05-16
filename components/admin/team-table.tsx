import Image from "next/image";
import Link from "next/link";
import type { Database } from "@/lib/supabase/types";

type TeamMember = Database["public"]["Tables"]["team_members"]["Row"];

export function TeamTable({ members }: { members: TeamMember[] }) {
  if (members.length === 0) {
    return (
      <div className="bg-white py-16 text-center">
        <p className="font-sans text-[14px] font-light text-ink-muted">
          Belum ada anggota tim. Buat anggota pertama di atas.
        </p>
      </div>
    );
  }
  return (
    <table className="w-full bg-white">
      <thead>
        <tr className="border-b border-ivory-dark">
          <th className="text-left font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted px-6 py-4">
            Foto
          </th>
          <th className="text-left font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted px-4 py-4">
            Nama
          </th>
          <th className="text-left font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted px-4 py-4">
            Posisi
          </th>
          <th className="text-left font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted px-4 py-4">
            Grup
          </th>
          <th className="text-left font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted px-4 py-4">
            Urutan
          </th>
          <th className="text-left font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted px-4 py-4">
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        {members.map((m) => (
          <tr
            key={m.id}
            className="border-b border-ivory-dark hover:bg-gold/5 transition-colors"
          >
            <td className="px-6 py-3">
              {m.photo_url ? (
                <Image
                  src={m.photo_url}
                  alt={m.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 object-cover object-top rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-ivory-dark" />
              )}
            </td>
            <td className="px-4 py-4">
              <Link
                href={`/admin/team/${m.id}`}
                className="font-serif text-[15px] font-medium text-forest hover:text-gold transition-colors"
              >
                {m.name}{" "}
                {m.credentials && (
                  <span className="text-ink-muted text-[12px]">{m.credentials}</span>
                )}
              </Link>
            </td>
            <td className="px-4 py-4 font-sans text-[12px] text-ink-muted">{m.role}</td>
            <td className="px-4 py-4 font-sans text-[12px] text-ink-muted">
              {m.practice_group ?? "—"}
            </td>
            <td className="px-4 py-4 font-sans text-[12px] text-ink-muted">
              {m.display_order}
            </td>
            <td className="px-4 py-4">
              <span
                className={`font-sans text-[9px] font-bold tracking-[2px] uppercase px-2 py-1 ${
                  m.is_active ? "bg-gold/10 text-gold" : "bg-ivory-dark text-ink-muted"
                }`}
              >
                {m.is_active ? "Aktif" : "Nonaktif"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
