"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTransition } from "react";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher() {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleChange(nextLocale: string) {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale as (typeof routing.locales)[number] });
    });
  }

  return (
    <div className="flex items-center gap-1.5" aria-label={t("label")}>
      {routing.locales.map((loc) => {
        const isActive = loc === locale;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => !isActive && handleChange(loc)}
            disabled={isActive || isPending}
            className={`font-sans text-[10px] font-bold tracking-[2px] uppercase px-2 py-1 transition-colors ${
              isActive
                ? "text-gold cursor-default"
                : "text-white/45 hover:text-white/80 cursor-pointer"
            }`}
          >
            {loc.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
