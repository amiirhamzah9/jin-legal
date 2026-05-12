"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminNavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      className={`block font-sans text-[12px] font-medium tracking-wide py-2.5 px-4 border-l-2 transition-colors ${
        isActive
          ? "text-gold border-gold bg-gold/5"
          : "text-white/55 border-transparent hover:text-white/85 hover:border-white/20"
      }`}
    >
      {label}
    </Link>
  );
}
