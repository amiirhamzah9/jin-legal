export const STATS = [
  { num: "11", suffix: "+", label: "Practice Areas" },
  { num: "6", suffix: "", label: "Senior Partners" },
  { num: "200", suffix: "+", label: "Clients Served" },
  { num: "10", suffix: "+", label: "Years of Excellence" },
] as const;

export const VALUES = [
  { title: "Integrity", body: "Every engagement guided by unwavering ethical standards and transparent communication." },
  { title: "Precision", body: "Legal strategies crafted with the thoroughness your interests demand." },
  { title: "Innovation", body: "Combining deep expertise with forward-thinking approaches to emerging challenges." },
  { title: "Results", body: "We measure success entirely by the outcomes we achieve for our clients." },
] as const;

export const PARTNERS = [
  { name: "Muhammad Subuh Rezki", credentials: "S.H.", role: "Managing Partner" },
  { name: "Ryan Tampubolon", credentials: "S.H.", role: "Partner" },
  { name: "Abi Rafdi", credentials: "S.H.", role: "Partner" },
  { name: "Achmad Firmansyah", credentials: "S.H.", role: "Partner" },
  { name: "Amir Hamzah", credentials: "S.H.", role: "Partner" },
  { name: "Aditya Muriza", credentials: "S.H.", role: "Partner" },
] as const;

export const PRACTICE_AREAS = [
  { num: "01", title: "Business & Corporate Law", slug: "business-corporate-law", icon: "briefcase" },
  { num: "02", title: "Litigation & Dispute Resolution", slug: "litigation-dispute-resolution", icon: "scales" },
  { num: "03", title: "Employment Law", slug: "employment-law", icon: "people" },
  { num: "04", title: "Advisory & Regulatory Compliance", slug: "advisory-regulatory-compliance", icon: "shield-check" },
  { num: "05", title: "Insolvency, Restructuring & PKPU", slug: "insolvency-restructuring-pkpu", icon: "refresh" },
  { num: "06", title: "Technology, Media & Telecommunications", slug: "technology-media-telecommunications", icon: "screen" },
  { num: "07", title: "Intellectual Property", slug: "intellectual-property", icon: "lightbulb" },
  { num: "08", title: "Consumer Protection", slug: "consumer-protection", icon: "shield-user" },
  { num: "09", title: "Criminal Defense & White Collar Crime", slug: "criminal-defense-white-collar", icon: "lock" },
  { num: "10", title: "Sport & Entertainment", slug: "sport-entertainment", icon: "trophy" },
  { num: "11", title: "Banking, Finance & FinTech", slug: "banking-finance-fintech", icon: "bank" },
] as const;

export type IconName = (typeof PRACTICE_AREAS)[number]["icon"];

export const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/practice-areas", label: "Practice Areas" },
  { href: "/team", label: "Our Team" },
  { href: "/insights", label: "Insights" },
  { href: "/careers", label: "Careers" },
] as const;
