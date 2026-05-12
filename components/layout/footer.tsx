import Link from "next/link";
import Image from "next/image";

const PRACTICE_LINKS = [
  { label: "Business & Corporate", slug: "business-corporate-law" },
  { label: "Litigation", slug: "litigation-dispute-resolution" },
  { label: "Employment Law", slug: "employment-law" },
  { label: "Intellectual Property", slug: "intellectual-property" },
  { label: "Banking & FinTech", slug: "banking-finance-fintech" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Our Team", href: "/team" },
  { label: "Insights", href: "/insights" },
  { label: "Careers", href: "/careers" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-forest-deep px-[72px] pt-[72px] pb-7 border-t border-gold/20">
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-14 mb-14">
        <div>
          <Image
            src="/logo/jin-logo.png"
            alt="JIN Legal"
            width={74}
            height={24}
            className="h-6 w-auto brightness-0 invert"
          />
          <p className="font-sans text-xs font-light text-white/35 leading-[1.75] mt-4 max-w-[220px]">
            Strategic legal counsel for the modern world — delivered with precision, integrity, and results.
          </p>
          <div className="text-[10px] text-gold/55 mt-3.5 tracking-wide">
            PT Juris International Network
          </div>
        </div>
        <div>
          <h4 className="font-sans text-[9px] tracking-[3.5px] font-bold uppercase text-gold mb-5">
            Practice Areas
          </h4>
          <ul className="list-none p-0 m-0">
            {PRACTICE_LINKS.map((link) => (
              <li key={link.slug} className="mb-2.5">
                <Link
                  href={`/practice-areas/${link.slug}`}
                  className="font-sans text-xs font-light text-white/40 hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mb-2.5">
              <Link href="/practice-areas" className="font-sans text-xs font-light text-white/40 hover:text-gold transition-colors">
                View All →
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-sans text-[9px] tracking-[3.5px] font-bold uppercase text-gold mb-5">
            Company
          </h4>
          <ul className="list-none p-0 m-0">
            {COMPANY_LINKS.map((link) => (
              <li key={link.href} className="mb-2.5">
                <Link href={link.href} className="font-sans text-xs font-light text-white/40 hover:text-gold transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-sans text-[9px] tracking-[3.5px] font-bold uppercase text-gold mb-5">
            Contact
          </h4>
          <ul className="list-none p-0 m-0">
            <li className="mb-2.5"><span className="font-sans text-xs font-light text-white/40">Jakarta, Indonesia</span></li>
            <li className="mb-2.5"><a href="mailto:hamzah@jin-legal.com" className="font-sans text-xs font-light text-white/40 hover:text-gold transition-colors">hamzah@jin-legal.com</a></li>
            <li className="mb-2.5"><a href="tel:+6281187800078" className="font-sans text-xs font-light text-white/40 hover:text-gold transition-colors">+62 811-8780-078</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 pt-5 flex justify-between items-center">
        <p className="font-sans text-[11px] text-white/20">
          © {year} <span className="text-gold">PT Juris International Network</span>. All rights reserved.
        </p>
        <p className="font-sans text-[11px] text-white/20">Privacy Policy · Terms of Use</p>
      </div>
    </footer>
  );
}
