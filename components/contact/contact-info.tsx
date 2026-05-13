import { Eyebrow } from "@/components/ui/eyebrow";

const INFO_BLOCKS = [
  {
    label: "Office",
    lines: ["Jakarta, Indonesia", "PT Juris International Network"],
  },
  {
    label: "Email",
    lines: ["center@jin-legal.com"],
  },
  {
    label: "Phone",
    lines: ["+62 811-8780-078"],
  },
  {
    label: "Working Hours",
    lines: ["Monday — Friday", "09:00 — 18:00 WIB"],
  },
];

export function ContactInfo() {
  return (
    <div>
      <Eyebrow className="mb-5">Reach Us</Eyebrow>
      <h2 className="font-serif text-[28px] font-light text-forest leading-tight mb-10">
        Get in Touch
      </h2>
      <div className="space-y-7">
        {INFO_BLOCKS.map((block) => (
          <div key={block.label} className="border-l-2 border-gold pl-5">
            <div className="font-sans text-[9px] font-bold tracking-[2.5px] uppercase text-gold mb-2">
              {block.label}
            </div>
            {block.lines.map((line) => (
              <div
                key={line}
                className="font-sans text-[13px] font-light text-ink leading-[1.6]"
              >
                {line}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
