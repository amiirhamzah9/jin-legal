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
  {
    num: "01",
    title: "Business & Corporate Law",
    slug: "business-corporate-law",
    icon: "briefcase",
    description:
      "Corporate transactions, M&A, governance, and commercial contracts — the legal backbone of growing businesses.",
    fullContent:
      "We advise corporations, foreign investors, and entrepreneurs across the full lifecycle of corporate matters — from entity structuring and shareholder agreements to mergers, acquisitions, joint ventures, and complex commercial transactions. Our team has handled deals across multiple sectors including manufacturing, technology, energy, and consumer goods.",
    services: [
      "Mergers & Acquisitions",
      "Corporate Restructuring",
      "Shareholder Agreements",
      "Joint Ventures",
      "Foreign Direct Investment",
      "Corporate Governance",
    ],
  },
  {
    num: "02",
    title: "Litigation & Dispute Resolution",
    slug: "litigation-dispute-resolution",
    icon: "scales",
    description:
      "Strategic representation in commercial disputes, arbitration, and trial advocacy across all levels of Indonesian courts.",
    fullContent:
      "When disputes arise, our litigation team delivers focused, results-driven advocacy. We handle commercial disputes, contract enforcement, debt collection, and shareholder conflicts before all levels of Indonesian courts, as well as in BANI and SIAC arbitration. Our approach combines rigorous legal preparation with strategic communication.",
    services: [
      "Commercial Litigation",
      "Domestic & International Arbitration",
      "Mediation & Alternative Dispute Resolution",
      "Contract Disputes",
      "Shareholder Disputes",
      "Enforcement of Judgments",
    ],
  },
  {
    num: "03",
    title: "Employment Law",
    slug: "employment-law",
    icon: "people",
    description:
      "Workforce strategy, labor disputes, and HR compliance for employers operating in Indonesia.",
    fullContent:
      "We help employers navigate Indonesia's complex labor regulations — including the Omnibus Law, BPJS requirements, and industry-specific mandates. Whether you're scaling a workforce, restructuring operations, or facing a labor dispute, we provide practical counsel that balances legal risk with operational goals.",
    services: [
      "Employment Agreements",
      "Workforce Restructuring",
      "Labor Disputes & PHI Mediation",
      "Employment Compliance Audits",
      "HR Policy Development",
      "Termination & Severance",
    ],
  },
  {
    num: "04",
    title: "Advisory & Regulatory Compliance",
    slug: "advisory-regulatory-compliance",
    icon: "shield-check",
    description:
      "Regulatory navigation and ongoing compliance counsel across regulated industries.",
    fullContent:
      "Our advisory practice helps companies anticipate, interpret, and comply with the regulatory environment they operate in. We provide ongoing counsel, regulatory filings, licensing support, and compliance program design across financial services, healthcare, consumer goods, and other regulated sectors.",
    services: [
      "Regulatory Strategy",
      "Licensing & Permits",
      "Compliance Audits",
      "Government Relations",
      "Industry-Specific Regulatory Advice",
      "Risk Assessment",
    ],
  },
  {
    num: "05",
    title: "Insolvency, Restructuring & PKPU",
    slug: "insolvency-restructuring-pkpu",
    icon: "refresh",
    description:
      "Restructuring, insolvency, and PKPU (suspension of debt payment) proceedings for creditors and debtors alike.",
    fullContent:
      "Financial distress requires specialized expertise. We represent both creditors seeking to recover claims and debtors seeking to restructure obligations through Indonesia's PKPU and bankruptcy frameworks. Our team has extensive experience drafting restructuring proposals, negotiating with creditors, and managing court-supervised processes.",
    services: [
      "PKPU Filings & Defense",
      "Bankruptcy Proceedings",
      "Debt Restructuring",
      "Creditor Representation",
      "Out-of-Court Workouts",
      "Asset Recovery",
    ],
  },
  {
    num: "06",
    title: "Technology, Media & Telecommunications",
    slug: "technology-media-telecommunications",
    icon: "screen",
    description:
      "TMT regulation, platform compliance, and digital strategy for technology-driven businesses.",
    fullContent:
      "Indonesia's digital economy operates under a fast-evolving regulatory framework — from PSE registration to data privacy under UU PDP. We help startups, platforms, and established TMT companies navigate licensing, content moderation, telecommunications regulation, and cross-border data flows.",
    services: [
      "PSE Registration & Compliance",
      "Data Privacy (UU PDP)",
      "Content Moderation Frameworks",
      "Telecommunications Licensing",
      "Platform Terms & Conditions",
      "Digital Advertising Compliance",
    ],
  },
  {
    num: "07",
    title: "Intellectual Property",
    slug: "intellectual-property",
    icon: "lightbulb",
    description:
      "Patents, trademarks, copyrights, and IP enforcement — protecting innovation and brand value.",
    fullContent:
      "Your ideas, brand, and creative work deserve robust protection. Our IP team handles trademark registration and disputes, patent filings, copyright matters, and IP enforcement — including takedowns, anti-counterfeiting actions, and infringement litigation. We work with both creators and rights-holders across industries.",
    services: [
      "Trademark Registration & Disputes",
      "Patent Filings",
      "Copyright Protection",
      "IP Licensing",
      "Anti-Counterfeiting",
      "IP Litigation",
    ],
  },
  {
    num: "08",
    title: "Consumer Protection",
    slug: "consumer-protection",
    icon: "shield-user",
    description:
      "Consumer rights advocacy, compliance counsel, and product liability defense.",
    fullContent:
      "We represent both consumers asserting their rights and businesses ensuring compliance with Indonesia's Consumer Protection Law (UU Perlindungan Konsumen). Our work includes BPKN proceedings, product liability matters, marketing compliance, and consumer-facing contract review.",
    services: [
      "Consumer Dispute Resolution",
      "BPKN/BPSK Proceedings",
      "Product Liability",
      "Marketing & Advertising Compliance",
      "Consumer Contract Review",
      "Class Action Representation",
    ],
  },
  {
    num: "09",
    title: "Criminal Defense & White Collar Crime",
    slug: "criminal-defense-white-collar",
    icon: "lock",
    description:
      "Rigorous criminal defense across general and special crimes — including corruption, fraud, and corporate offenses.",
    fullContent:
      "When facing criminal allegations, the stakes are personal and professional. Our criminal practice handles both general criminal matters and complex white collar cases — including corruption, money laundering, tax crimes, and corporate fraud. We provide vigorous defense at every stage, from investigation to appeal.",
    services: [
      "White Collar Defense",
      "Anti-Corruption (Tipikor)",
      "Money Laundering Defense",
      "Tax Crimes",
      "Corporate Internal Investigations",
      "General Criminal Defense",
    ],
  },
  {
    num: "10",
    title: "Sport & Entertainment",
    slug: "sport-entertainment",
    icon: "trophy",
    description:
      "Sports law, entertainment contracts, and talent representation in a fast-growing industry.",
    fullContent:
      "Indonesia's sports and entertainment industries are professionalizing rapidly — and the legal frameworks are evolving with them. We represent athletes, clubs, federations, artists, agencies, and brands in contract negotiations, image rights, sponsorship deals, broadcasting agreements, and dispute resolution.",
    services: [
      "Athlete & Talent Representation",
      "Sponsorship Agreements",
      "Image Rights & Endorsements",
      "Broadcasting Rights",
      "Player Transfers",
      "Sports Disciplinary Proceedings",
    ],
  },
  {
    num: "11",
    title: "Banking, Finance & FinTech",
    slug: "banking-finance-fintech",
    icon: "bank",
    description:
      "Banking regulation, FinTech licensing, digital assets, and complex financing transactions.",
    fullContent:
      "We advise banks, FinTech startups, payment providers, and digital asset platforms on OJK regulation, licensing requirements, and transactional matters. From P2P lending to digital banking to crypto assets, we help clients move quickly while staying compliant in one of the most regulated sectors of the economy.",
    services: [
      "OJK Licensing & Compliance",
      "FinTech P2P Lending",
      "Digital Banking",
      "Payment Systems Regulation",
      "Digital Asset & Crypto",
      "Project Finance",
    ],
  },
] as const;

export type PracticeArea = (typeof PRACTICE_AREAS)[number];

export type IconName = (typeof PRACTICE_AREAS)[number]["icon"];

export const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/practice-areas", label: "Practice Areas" },
  { href: "/team", label: "Our Team" },
  { href: "/insights", label: "Insights" },
  { href: "/careers", label: "Careers" },
] as const;
