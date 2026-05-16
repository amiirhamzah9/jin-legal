import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const PRACTICE_LINKS = [
  { key: "practiceBusiness", slug: "business-corporate-law" },
  { key: "practiceLitigation", slug: "litigation-dispute-resolution" },
  { key: "practiceEmployment", slug: "employment-law" },
  { key: "practiceIp", slug: "intellectual-property" },
  { key: "practiceBanking", slug: "banking-finance-fintech" },
] as const;

const COMPANY_LINKS = [
  { key: "about", href: "/about" },
  { key: "ourTeam", href: "/team" },
  { key: "insights", href: "/insights" },
  { key: "careers", href: "/careers" },
] as const;

export function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Nav");
  const year = new Date().getFullYear();
  return (
    <footer className="bg-forest-deep px-5 pt-12 md:px-[72px] md:pt-[72px] pb-7 border-t border-gold/20">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 md:gap-14 mb-10 md:mb-14">
        <div>
          <Image
            src="/logo/jin-logo.png"
            alt="JIN Legal Counsel"
            width={74}
            height={24}
            className="h-6 w-auto brightness-0 invert"
          />
          <p className="font-sans text-xs font-light text-white/35 leading-[1.75] mt-4 max-w-[220px]">
            {t("tagline")}
          </p>
          <div className="text-[10px] text-gold/55 mt-3.5 tracking-wide">
            JIN Legal Counsel
          </div>
        </div>
        <div>
          <h4 className="font-sans text-[9px] tracking-[3.5px] font-bold uppercase text-gold mb-5">
            {t("practiceAreasHeading")}
          </h4>
          <ul className="list-none p-0 m-0">
            {PRACTICE_LINKS.map((link) => (
              <li key={link.slug} className="mb-2.5">
                <Link
                  href={`/practice-areas/${link.slug}`}
                  className="font-sans text-xs font-light text-white/40 hover:text-gold transition-colors"
                >
                  {t(link.key)}
                </Link>
              </li>
            ))}
            <li className="mb-2.5">
              <Link
                href="/practice-areas"
                className="font-sans text-xs font-light text-white/40 hover:text-gold transition-colors"
              >
                {t("viewAll")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-sans text-[9px] tracking-[3.5px] font-bold uppercase text-gold mb-5">
            {t("companyHeading")}
          </h4>
          <ul className="list-none p-0 m-0">
            {COMPANY_LINKS.map((link) => (
              <li key={link.href} className="mb-2.5">
                <Link
                  href={link.href}
                  className="font-sans text-xs font-light text-white/40 hover:text-gold transition-colors"
                >
                  {tNav(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-sans text-[9px] tracking-[3.5px] font-bold uppercase text-gold mb-5">
            {t("contactHeading")}
          </h4>
          <ul className="list-none p-0 m-0">
            <li className="mb-2.5">
              <span className="font-sans text-xs font-light text-white/40">{t("city")}</span>
            </li>
            <li className="mb-2.5">
              <a
                href="mailto:center@jin-legal.com"
                className="font-sans text-xs font-light text-white/40 hover:text-gold transition-colors"
              >
                center@jin-legal.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 pt-5 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <p className="font-sans text-[11px] text-white/20">
          © {year} <span className="text-gold">JIN Legal Counsel</span>. {t("rights")}
        </p>
        <p className="font-sans text-[11px] text-white/20">
          {t("privacy")} · {t("terms")}
        </p>
      </div>
    </footer>
  );
}
