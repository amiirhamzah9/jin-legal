import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "gold" | "ghost" | "white";

const variantClasses: Record<Variant, string> = {
  gold: "bg-gold text-forest-deep hover:bg-gold-light",
  ghost: "bg-transparent border border-white/20 text-white/70 hover:border-gold hover:text-gold",
  white: "bg-white text-forest hover:bg-forest hover:text-white",
};

const baseClasses =
  "inline-block font-sans text-[10px] font-bold tracking-[2.5px] uppercase no-underline px-8 py-3.5 transition-all duration-200";

export function Button({
  variant,
  href,
  children,
  className = "",
}: {
  variant: Variant;
  href?: string;
  children: ReactNode;
  className?: string;
}) {
  const cls = `${baseClasses} ${variantClasses[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return <button className={cls}>{children}</button>;
}
