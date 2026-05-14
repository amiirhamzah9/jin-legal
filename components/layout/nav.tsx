"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActiveHref(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-forest-deep/96 backdrop-blur-xl border-b border-gold/20">
      <div className="flex items-center justify-between h-[64px] md:h-[70px] px-5 md:px-[72px]">
        <Link href="/" className="block" onClick={() => setOpen(false)}>
          <Image
            src="/logo/jin-logo.png"
            alt="JIN Legal Counsel"
            width={86}
            height={28}
            priority
            className="h-6 md:h-7 w-auto brightness-0 invert"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex gap-7 xl:gap-10 items-center">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative font-sans text-[11px] font-medium tracking-[2px] uppercase transition-colors ${
                isActiveHref(link.href) ? "text-gold" : "text-white/55 hover:text-white/90"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <Link
          href="/contact"
          className="hidden lg:inline-block font-sans text-[10px] font-semibold tracking-[2px] uppercase text-forest-deep bg-gold hover:bg-gold-light px-6 py-2.5 transition-colors"
        >
          Consult With Us
        </Link>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="lg:hidden flex flex-col justify-center items-center w-9 h-9 -mr-2"
        >
          <span
            className={`block w-6 h-px bg-white transition-transform duration-300 ${
              open ? "rotate-45 translate-y-[3px]" : ""
            }`}
          />
          <span
            className={`block w-6 h-px bg-white mt-1 transition-opacity duration-200 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block w-6 h-px bg-white mt-1 transition-transform duration-300 ${
              open ? "-rotate-45 -translate-y-[5px]" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`lg:hidden overflow-hidden transition-[max-height] duration-300 ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-5 pb-6 pt-2 space-y-3 border-t border-white/5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block font-sans text-[13px] font-medium tracking-[1.5px] uppercase py-2 ${
                isActiveHref(link.href) ? "text-gold" : "text-white/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="block text-center font-sans text-[11px] font-semibold tracking-[2px] uppercase text-forest-deep bg-gold mt-4 py-3"
          >
            Consult With Us
          </Link>
        </div>
      </div>
    </nav>
  );
}
