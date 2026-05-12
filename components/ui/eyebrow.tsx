import type { ReactNode } from "react";

export function Eyebrow({
  children,
  withLine = false,
  className = "",
}: {
  children: ReactNode;
  withLine?: boolean;
  className?: string;
}) {
  return (
    <div className={`inline-flex items-center gap-3 font-sans text-[10px] font-semibold tracking-[0.25em] uppercase text-gold ${className}`}>
      {withLine && <span className="w-9 h-px bg-gold" />}
      {children}
    </div>
  );
}
