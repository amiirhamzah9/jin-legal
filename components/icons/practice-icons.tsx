import type { IconName } from "@/lib/constants";

const baseProps = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function PracticeIcon({ name, className }: { name: IconName; className?: string }) {
  switch (name) {
    case "briefcase":
      return (
        <svg {...baseProps} className={className}>
          <rect x="2" y="7" width="20" height="14" rx="1.5" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          <path d="M2 12h20M12 12v3" />
        </svg>
      );
    case "scales":
      return (
        <svg {...baseProps} className={className}>
          <path d="M12 3v18M5 9l-3 6h6L5 9zM19 9l-3 6h6L19 9zM3 15a3 3 0 0 0 6 0M15 15a3 3 0 0 0 6 0M6 21h12" />
        </svg>
      );
    case "people":
      return (
        <svg {...baseProps} className={className}>
          <circle cx="9" cy="7" r="3" />
          <circle cx="15" cy="7" r="3" />
          <path d="M3 21v-2a5 5 0 0 1 5-5h1M16 14l2 2 4-4" />
        </svg>
      );
    case "shield-check":
      return (
        <svg {...baseProps} className={className}>
          <path d="M12 2L3 7v5c0 5 3.8 9.7 9 11 5.2-1.3 9-6 9-11V7L12 2zM9 12l2 2 4-4" />
        </svg>
      );
    case "refresh":
      return (
        <svg {...baseProps} className={className}>
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5" />
        </svg>
      );
    case "screen":
      return (
        <svg {...baseProps} className={className}>
          <rect x="2" y="3" width="20" height="13" rx="1.5" />
          <path d="M8 21h8M12 17v4M7 8h.01M10 8h4M17 8h.01M7 11h10" />
        </svg>
      );
    case "lightbulb":
      return (
        <svg {...baseProps} className={className}>
          <path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.2 6H8.2A7 7 0 0 1 12 2zM8.8 15h6.4" />
        </svg>
      );
    case "shield-user":
      return (
        <svg {...baseProps} className={className}>
          <path d="M12 2c-4 2.5-7 3-7 3v7c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V5s-3-.5-7-3z" />
          <circle cx="12" cy="10" r="2" />
          <path d="M9 16c.5-1.5 1.5-2.5 3-2.5s2.5 1 3 2.5" />
        </svg>
      );
    case "lock":
      return (
        <svg {...baseProps} className={className}>
          <rect x="3" y="11" width="18" height="11" rx="1.5" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          <circle cx="12" cy="16" r="1.5" fill="currentColor" />
          <path d="M12 17.5v2" />
        </svg>
      );
    case "trophy":
      return (
        <svg {...baseProps} className={className}>
          <path d="M6 9H4.5a2.5 2.5 0 0 0 0 5H6M18 9h1.5a2.5 2.5 0 0 1 0 5H18M8 9h8M8 15h8M9 9v6M15 9v6M12 19v2M10 21h4" />
        </svg>
      );
    case "bank":
      return (
        <svg {...baseProps} className={className}>
          <path d="M3 10h18M3 6l9-3 9 3M5 10v4M9 10v4M13 10v4M17 10v4M3 18h18" />
        </svg>
      );
  }
}
