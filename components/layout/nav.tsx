"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[70px] px-[72px] flex items-center justify-between bg-forest-deep/96 backdrop-blur-xl border-b border-gold/20">
      <Link href="/" className="block">
        <Image
          src="/logo/jin-logo.png"
          alt="JIN Legal"
          width={86}
          height={28}
          priority
          className="h-7 w-auto brightness-0 invert"
        />
      </Link>
      <div className="flex gap-10 items-center">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative font-sans text-[11px] font-medium tracking-[2px] uppercase transition-colors ${
                isActive ? "text-gold" : "text-white/55 hover:text-white/90"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
      <Link
        href="/contact"
        className="font-sans text-[10px] font-semibold tracking-[2px] uppercase text-forest-deep bg-gold hover:bg-gold-light px-6 py-2.5 transition-colors"
      >
        Consult With Us
      </Link>
    </nav>
  );
}
