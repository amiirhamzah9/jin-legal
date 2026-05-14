import Image from "next/image";
import type { Database } from "@/lib/supabase/types";

type TeamMember = Database["public"]["Tables"]["team_members"]["Row"];

export function FullTeamGrid({ partners }: { partners: TeamMember[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[3px] max-w-[1400px] mx-auto">
      {partners.map((partner) => (
        <div key={partner.id} className="relative overflow-hidden group cursor-pointer">
          {partner.photo_url ? (
            <Image
              src={partner.photo_url}
              alt={partner.name}
              width={600}
              height={720}
              className="w-full aspect-[5/6] object-cover object-top transition-all duration-[550ms] grayscale-[40%] brightness-[.85] saturate-[.9] group-hover:grayscale-0 group-hover:brightness-100 group-hover:saturate-100 group-hover:scale-[1.04]"
            />
          ) : (
            <div
              className="w-full aspect-[5/6] overflow-hidden"
              aria-label={`${partner.name} photo placeholder`}
            >
              <svg
                viewBox="0 0 800 960"
                preserveAspectRatio="xMidYMin slice"
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id={`phbg-${partner.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#E5E9EC" />
                    <stop offset="1" stopColor="#BDC4C9" />
                  </linearGradient>
                </defs>
                <rect width="800" height="960" fill={`url(#phbg-${partner.id})`} />
                {/* Head — round, slightly elongated */}
                <ellipse cx="400" cy="340" rx="130" ry="145" fill="#1a1d22" />
                {/* Suit body — wide curved shoulders sloping to frame */}
                <path
                  d="M 80 960 C 80 660, 230 510, 400 510 C 570 510, 720 660, 720 960 Z"
                  fill="#1a1d22"
                />
                {/* Shirt V (white collar peeking) */}
                <polygon points="358,520 442,520 410,650 390,650" fill="#EDEDED" />
                {/* Tie */}
                <polygon points="385,540 415,540 428,790 372,790" fill="#0a0d12" />
                {/* Lapel separation lines */}
                <path
                  d="M 360 530 L 280 820"
                  stroke="#0a0d12"
                  strokeWidth="3"
                  fill="none"
                />
                <path
                  d="M 440 530 L 520 820"
                  stroke="#0a0d12"
                  strokeWidth="3"
                  fill="none"
                />
              </svg>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 px-5 pt-10 pb-5 [background:linear-gradient(0deg,rgba(10,24,18,.97)_0%,transparent_100%)]">
            <div className="font-sans text-[9px] tracking-[3px] text-gold font-bold uppercase mb-1.5">
              {partner.role}
            </div>
            <div className="font-serif text-[22px] text-white font-medium mb-0.5 leading-tight">
              {partner.name}
            </div>
            <div className="font-sans text-[10px] text-white/45">{partner.credentials}</div>
            {partner.bio && (
              <p className="font-sans text-[11px] font-light text-white/55 leading-[1.6] max-h-0 opacity-0 overflow-hidden group-hover:max-h-40 group-hover:opacity-100 group-hover:mt-3 transition-all duration-400">
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
