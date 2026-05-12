export function StatCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: number | string;
  helper?: string;
}) {
  return (
    <div className="bg-white border-t-2 border-gold p-7">
      <div className="font-sans text-[9px] font-bold tracking-[2.5px] uppercase text-gold mb-3">
        {label}
      </div>
      <div className="font-serif text-[44px] font-light text-forest leading-none mb-2">
        {value}
      </div>
      {helper && (
        <div className="font-sans text-[12px] font-light text-ink-muted">
          {helper}
        </div>
      )}
    </div>
  );
}
