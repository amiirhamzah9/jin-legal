import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { AdminNavLink } from "./admin-nav-link";
import { SignOutButton } from "./sign-out-button";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/blog", label: "Blog Posts" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/practice-areas", label: "Practice Areas" },
  { href: "/admin/careers", label: "Careers" },
];

export function AdminShell({
  children,
  userEmail,
}: {
  children: ReactNode;
  userEmail: string;
}) {
  return (
    <div className="min-h-screen flex bg-ivory">
      <aside className="w-48 md:w-64 bg-forest-deep flex flex-col">
        <div className="px-6 py-7 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Image
              src="/logo/jin-logo.png"
              alt="JIN Legal Counsel"
              width={86}
              height={28}
              priority
              className="h-6 w-auto brightness-0 invert"
            />
            <span className="font-sans text-[10px] font-bold tracking-[2.5px] uppercase text-gold/70">
              Admin
            </span>
          </Link>
        </div>
        <nav className="flex-1 py-6 px-2 space-y-1">
          {NAV_ITEMS.map((item) => (
            <AdminNavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>
        <div className="px-6 py-5 border-t border-white/5">
          <div className="font-sans text-[10px] text-white/35 mb-2">
            Signed in as
          </div>
          <div className="font-sans text-[10px] md:text-[12px] text-white/70 mb-4 break-all">
            {userEmail}
          </div>
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 px-5 py-8 md:px-12 md:py-10 overflow-x-hidden">{children}</main>
    </div>
  );
}
