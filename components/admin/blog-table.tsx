import Link from "next/link";
import type { Database } from "@/lib/supabase/types";

type Post = Database["public"]["Tables"]["blog_posts"]["Row"];

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function BlogTable({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="bg-white py-16 text-center">
        <p className="font-sans text-[14px] font-light text-ink-muted">
          Belum ada artikel. Buat artikel pertama di atas.
        </p>
      </div>
    );
  }

  return (
    <table className="w-full bg-white">
      <thead>
        <tr className="border-b border-ivory-dark">
          <th className="text-left font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted px-6 py-4">
            Judul
          </th>
          <th className="text-left font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted px-4 py-4">
            Kategori
          </th>
          <th className="text-left font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted px-4 py-4">
            Status
          </th>
          <th className="text-left font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted px-4 py-4">
            Dipublikasi
          </th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post) => (
          <tr
            key={post.id}
            className="border-b border-ivory-dark hover:bg-gold/5 transition-colors"
          >
            <td className="px-6 py-4">
              <Link
                href={`/admin/blog/${post.id}`}
                className="font-serif text-[16px] font-medium text-forest hover:text-gold transition-colors"
              >
                {post.title}
              </Link>
            </td>
            <td className="px-4 py-4 font-sans text-[12px] text-ink-muted">
              {post.category ?? "—"}
            </td>
            <td className="px-4 py-4">
              <span
                className={`font-sans text-[9px] font-bold tracking-[2px] uppercase px-2 py-1 ${
                  post.is_published
                    ? "bg-gold/10 text-gold"
                    : "bg-ivory-dark text-ink-muted"
                }`}
              >
                {post.is_published ? "Terbit" : "Draf"}
              </span>
            </td>
            <td className="px-4 py-4 font-sans text-[12px] text-ink-muted">
              {formatDate(post.published_at)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
