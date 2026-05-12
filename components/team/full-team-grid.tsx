import Image from "next/image";
import type { Database } from "@/lib/supabase/types";

type TeamMember = Database["public"]["Tables"]["team_members"]["Row"];

export function FullTeamGrid({ partners }: { partners: TeamMember[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[3px]">
      {partners.map((partner) => (
        <div key={partner.id} className="relative overflow-hidden group cursor-pointer">
          {partner.photo_url && (
            <Image
              src={partner.photo_url}
              alt={partner.name}
              width={600}
              height={720}
              className="w-full h-[360px] md:h-[420px] object-cover object-top transition-all duration-[550ms] grayscale-[40%] brightness-[.85] saturate-[.9] group-hover:grayscale-0 group-hover:brightness-100 group-hover:saturate-100 group-hover:scale-[1.04]"
            />
          )}
          <div className="absolute bottom-0 left-0 right-0 px-5 pt-16 pb-5 [background:linear-gradient(0deg,rgba(10,24,18,.97)_0%,transparent_100%)] translate-y-7 group-hover:translate-y-0 transition-transform duration-400">
            <div className="font-sans text-[9px] tracking-[3px] text-gold font-bold uppercase mb-1.5">
              {partner.role}
            </div>
            <div className="font-serif text-[22px] text-white font-medium mb-0.5 leading-tight">
              {partner.name}
            </div>
            <div className="font-sans text-[10px] text-white/45 mb-3">{partner.credentials}</div>
            {partner.bio && (
              <p className="font-sans text-[11px] font-light text-white/55 leading-[1.6] opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                {partner.bio}
              </p>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-[450ms]" />
        </div>
      ))}
    </div>
  );
}
