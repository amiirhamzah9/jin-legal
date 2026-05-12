import { Eyebrow } from "@/components/ui/eyebrow";

const ITEMS = [
  {
    label: "Business Identification Number",
    code: "NIB",
    description: "Officially registered business entity under PT Juris International Network.",
  },
  {
    label: "Tax Registration",
    code: "NPWP",
    description: "Compliant with Indonesian tax administration requirements.",
  },
  {
    label: "Standard Certificate",
    code: "Sertifikat Standar 82301",
    description: "Authorized to provide legal consulting services nationwide.",
  },
  {
    label: "Registered Practice",
    code: "PERADI Members",
    description: "All partners are licensed advocates registered with PERADI.",
  },
] as const;

export function Credentials() {
  return (
    <section className="bg-forest-deep px-[72px] py-24">
      <div className="max-w-[1100px] mx-auto">
        <Eyebrow className="mb-5">Trusted & Verified</Eyebrow>
        <h2 className="font-serif text-[42px] font-light text-white leading-tight mb-3">
          Credentials & Registrations
        </h2>
        <p className="font-sans text-[14px] font-light text-white/50 leading-[1.8] max-w-[600px] mb-14">
          Fully registered and licensed to practice law in Indonesia, with all
          required regulatory clearances and active professional memberships.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {ITEMS.map((item) => (
            <div
              key={item.code}
              className="bg-white/[0.03] border-l-2 border-gold/40 p-7 hover:bg-white/[0.06] hover:border-gold transition-all"
            >
              <div className="font-sans text-[9px] tracking-[2.5px] uppercase text-gold font-bold mb-2">
                {item.label}
              </div>
              <div className="font-serif text-[22px] text-white font-medium mb-2">
                {item.code}
              </div>
              <p className="font-sans text-[12px] font-light text-white/45 leading-[1.7]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
