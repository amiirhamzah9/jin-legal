import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";

type Variant = "gold" | "ghost" | "white";

const variantClasses: Record<Variant, string> = {
  gold: "bg-gold text-forest-deep hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gold",
  ghost: "bg-transparent border border-white/20 text-white/70 hover:border-gold hover:text-gold",
  white: "bg-white text-forest hover:bg-forest hover:text-white",
};

const baseClasses =
  "inline-block font-sans text-[10px] font-bold tracking-[2.5px] uppercase no-underline px-8 py-3.5 transition-all duration-200";

type ButtonProps = {
  variant: Variant;
  children: ReactNode;
  className?: string;
} & (
  | { href: string; type?: never; disabled?: never; onClick?: never }
  | { href?: undefined; type?: "button" | "submit"; disabled?: boolean; onClick?: () => void }
);

export function Button(props: ButtonProps) {
  const { variant, children, className = "" } = props;
  const cls = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (props.href) {
    return (
      <Link href={props.href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      disabled={props.disabled}
      onClick={props.onClick}
      className={cls}
    >
      {children}
    </button>
  );
}
