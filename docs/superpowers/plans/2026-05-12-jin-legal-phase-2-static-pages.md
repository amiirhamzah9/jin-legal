# Jin Legal — Phase 2: Static Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the About, Team, Practice Areas listing, and 11 Practice Area detail pages — completing all static routes on the Jin Legal site. Each page uses the design system from Phase 1 and reads from the static constants in `lib/constants.ts`.

**Architecture:** All pages are statically rendered (no Supabase reads in Phase 2). The Team page uses one Client Component (`TeamFilterTabs`) for tab-based filtering; everything else is server-rendered. Practice Area detail pages use `generateStaticParams` to pre-render one route per slug at build time. A shared `PageHero` primitive provides a consistent header treatment across all four page types.

**Tech Stack:**
- Next.js 14 App Router (Server Components by default, Client Components only where state is needed)
- TypeScript
- Tailwind CSS with the forest/gold/ivory design tokens
- next/font (Cormorant Garamond + Jost — already loaded)
- next/image for all photos
- Vitest + React Testing Library

**Out of Phase 2 (deferred to Phase 3):**
- Insights blog (listing + detail) — requires Supabase reads
- Careers page — requires Supabase reads
- Contact page + form — requires Supabase writes
- Admin dashboard — requires Supabase Auth

---

## File Structure

```
app/
  about/
    page.tsx                            About page route
  team/
    page.tsx                            Team page route
  practice-areas/
    page.tsx                            Practice areas listing route
    [slug]/
      page.tsx                          Practice area detail route (11 slugs)

components/
  ui/
    page-hero.tsx                       Shared page header (eyebrow + title + subtitle)
  about/
    firm-story.tsx                      Founding story + mission
    credentials.tsx                     Licenses / business credentials
  team/
    full-team-grid.tsx                  6-partner cinematic grid
    team-filter-tabs.tsx                Client component — filter tabs
  practice-areas/
    practice-list-grid.tsx              Listing page 4-col grid
    practice-detail-hero.tsx            Detail page hero (icon + title + summary)
    practice-detail-content.tsx         Detail body (description + key services)
    related-partners.tsx                Detail page partner mini-grid

lib/
  constants.ts                          EXTEND: add descriptions, bios, photos, practiceAreas to existing exports
```

---

## Task 1: Extend `lib/constants.ts` with Practice Area Descriptions

**Files:**
- Modify: `lib/constants.ts`

- [ ] **Step 1: Open `/Users/amirhamzah/Github/jin-legal/lib/constants.ts` and replace the `PRACTICE_AREAS` block**

Find the existing `PRACTICE_AREAS` export and replace it with:

```typescript
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
```

- [ ] **Step 2: Run build to verify the type system handles the extended shape**

```bash
npm run build
```

Expected: success. No type errors.

- [ ] **Step 3: Run existing tests — they should still pass since they don't depend on the new fields**

```bash
npm test -- --run
```

Expected: 27/27 still passing.

- [ ] **Step 4: Commit**

```bash
git add lib/constants.ts
git commit -m "feat: extend PRACTICE_AREAS with descriptions, full content, and services"
```

---

## Task 2: Extend `lib/constants.ts` with Partner Bios + Photos

**Files:**
- Modify: `lib/constants.ts`

- [ ] **Step 1: Open `/Users/amirhamzah/Github/jin-legal/lib/constants.ts` and replace the `PARTNERS` block**

Find the existing `PARTNERS` export and replace with:

```typescript
export const PARTNERS = [
  {
    name: "Muhammad Subuh Rezki",
    credentials: "S.H.",
    role: "Managing Partner",
    slug: "muhammad-subuh-rezki",
    photo: "https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?w=800&h=960&fit=crop&q=85",
    bio: "Managing Partner with extensive experience in corporate transactions, restructuring, and cross-border deals. Leads the firm's strategic direction.",
    practiceGroup: "corporate-business",
    practiceAreas: ["business-corporate-law", "insolvency-restructuring-pkpu", "advisory-regulatory-compliance"],
  },
  {
    name: "Ryan Tampubolon",
    credentials: "S.H.",
    role: "Partner",
    slug: "ryan-tampubolon",
    photo: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=800&h=960&fit=crop&q=85",
    bio: "Head of Litigation with a proven track record in commercial disputes, arbitration, and complex criminal defense matters.",
    practiceGroup: "litigation",
    practiceAreas: ["litigation-dispute-resolution", "criminal-defense-white-collar"],
  },
  {
    name: "Abi Rafdi",
    credentials: "S.H.",
    role: "Partner",
    slug: "abi-rafdi",
    photo: "https://images.unsplash.com/photo-1629425733761-caae3b5f2e50?w=800&h=960&fit=crop&q=85",
    bio: "Leads the firm's IP and TMT practice. Advises on patents, trademarks, digital platform regulation, and emerging technology.",
    practiceGroup: "specialties",
    practiceAreas: ["intellectual-property", "technology-media-telecommunications"],
  },
  {
    name: "Achmad Firmansyah",
    credentials: "S.H.",
    role: "Partner",
    slug: "achmad-firmansyah",
    photo: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=800&h=960&fit=crop&q=85",
    bio: "Banking, finance, and FinTech specialist. Advises financial institutions, payment providers, and digital asset platforms.",
    practiceGroup: "corporate-business",
    practiceAreas: ["banking-finance-fintech", "business-corporate-law"],
  },
  {
    name: "Amir Hamzah",
    credentials: "S.H.",
    role: "Partner",
    slug: "amir-hamzah",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=960&fit=crop&q=85",
    bio: "Employment law counsel serving major corporations on workforce restructuring, labor disputes, and HR compliance.",
    practiceGroup: "litigation",
    practiceAreas: ["employment-law", "consumer-protection"],
  },
  {
    name: "Aditya Muriza",
    credentials: "S.H.",
    role: "Partner",
    slug: "aditya-muriza",
    photo: "https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=800&h=960&fit=crop&q=85",
    bio: "Regulatory advisory and compliance specialist across financial services, sports, and consumer industries.",
    practiceGroup: "specialties",
    practiceAreas: ["advisory-regulatory-compliance", "sport-entertainment"],
  },
] as const;

export type Partner = (typeof PARTNERS)[number];

export const PRACTICE_GROUPS = [
  { id: "all", label: "All Partners" },
  { id: "corporate-business", label: "Corporate & Business" },
  { id: "litigation", label: "Litigation" },
  { id: "specialties", label: "Specialties" },
] as const;

export type PracticeGroup = (typeof PRACTICE_GROUPS)[number]["id"];
```

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Run tests**

```bash
npm test -- --run
```

Expected: 27/27 still passing.

- [ ] **Step 4: Commit**

```bash
git add lib/constants.ts
git commit -m "feat: extend PARTNERS with photos, bios, slugs, and practice groups"
```

---

## Task 3: Build the Shared `PageHero` Component

**Files:**
- Create: `tests/components/page-hero.test.tsx`
- Create: `components/ui/page-hero.tsx`

- [ ] **Step 1: Write failing test** at `/Users/amirhamzah/Github/jin-legal/tests/components/page-hero.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageHero } from "@/components/ui/page-hero";

describe("PageHero", () => {
  it("renders eyebrow and title", () => {
    render(<PageHero eyebrow="About the Firm" title="A Modern Legal Partner" />);
    expect(screen.getByText("About the Firm")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /a modern legal partner/i })).toBeInTheDocument();
  });

  it("renders optional subtitle when provided", () => {
    render(
      <PageHero
        eyebrow="Our People"
        title="Meet the Partners"
        subtitle="Six dedicated professionals committed to delivering strategic counsel."
      />
    );
    expect(screen.getByText(/six dedicated professionals/i)).toBeInTheDocument();
  });

  it("omits subtitle when not provided", () => {
    const { container } = render(<PageHero eyebrow="X" title="Y" />);
    expect(container.querySelector("p")).toBeNull();
  });
});
```

- [ ] **Step 2: Run test, verify fail**

```bash
npm test -- --run page-hero.test
```

Expected: FAIL — `PageHero` cannot be imported.

- [ ] **Step 3: Create `/Users/amirhamzah/Github/jin-legal/components/ui/page-hero.tsx`**

```tsx
import { Eyebrow } from "./eyebrow";

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="bg-forest-deep pt-[120px] pb-20 px-[72px] relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,168,76,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,.04) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      />
      <div className="relative z-10 max-w-[820px]">
        <Eyebrow withLine className="mb-6">
          {eyebrow}
        </Eyebrow>
        <h1 className="font-serif text-[clamp(40px,5.5vw,68px)] font-light text-white leading-[1.15] tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="font-sans text-[15px] font-light text-white/50 leading-[1.8] mt-7 max-w-[560px]">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test, verify pass**

```bash
npm test -- --run page-hero.test
```

Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add tests/components/page-hero.test.tsx components/ui/page-hero.tsx
git commit -m "feat: add shared PageHero component"
```

---

## Task 4: Build About `FirmStory` Section

**Files:**
- Create: `tests/components/firm-story.test.tsx`
- Create: `components/about/firm-story.tsx`

- [ ] **Step 1: Write failing test** at `/Users/amirhamzah/Github/jin-legal/tests/components/firm-story.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FirmStory } from "@/components/about/firm-story";

describe("FirmStory", () => {
  it("renders the firm story heading", () => {
    render(<FirmStory />);
    expect(screen.getByRole("heading", { name: /our story/i })).toBeInTheDocument();
  });

  it("renders the four firm values", () => {
    render(<FirmStory />);
    expect(screen.getByText("Integrity")).toBeInTheDocument();
    expect(screen.getByText("Precision")).toBeInTheDocument();
    expect(screen.getByText("Innovation")).toBeInTheDocument();
    expect(screen.getByText("Results")).toBeInTheDocument();
  });

  it("mentions the full legal name", () => {
    render(<FirmStory />);
    expect(screen.getByText(/PT Juris International Network/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test, verify fail**

```bash
npm test -- --run firm-story.test
```

Expected: FAIL.

- [ ] **Step 3: Create `/Users/amirhamzah/Github/jin-legal/components/about/firm-story.tsx`**

```tsx
import { Eyebrow } from "@/components/ui/eyebrow";
import { VALUES } from "@/lib/constants";

export function FirmStory() {
  return (
    <section className="bg-ivory px-[72px] py-24">
      <div className="max-w-[1100px] mx-auto">
        <Eyebrow className="mb-5">Who We Are</Eyebrow>
        <h2 className="font-serif text-[42px] font-light text-forest leading-tight mb-12">
          Our Story
        </h2>

        <div className="grid grid-cols-[1fr_1fr] gap-20 mb-20">
          <div className="space-y-5">
            <p className="font-sans text-[15px] font-light text-ink leading-[1.85]">
              Jin Legal — the practice of <strong className="font-semibold">PT Juris International Network</strong> — was founded on a simple principle: exceptional legal counsel must be both strategically sharp and deeply human.
            </p>
            <p className="font-sans text-[15px] font-light text-ink-muted leading-[1.85]">
              We bring together six partners with deep expertise across corporate law, dispute resolution, emerging technologies, and specialized practice areas that define today&apos;s business landscape in Indonesia. Our team has advised clients ranging from venture-backed startups to established multinationals.
            </p>
            <p className="font-sans text-[15px] font-light text-ink-muted leading-[1.85]">
              What sets us apart isn&apos;t just our technical expertise — it&apos;s our commitment to understanding each client&apos;s commercial reality before we ever open a statute book. We measure success by the outcomes we achieve, not the hours we bill.
            </p>
          </div>
          <div className="relative">
            <div
              className="aspect-[4/5] bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&h=1125&fit=crop&q=85')",
              }}
            />
            <div className="absolute -bottom-6 -left-6 bg-gold px-7 py-5 text-forest-deep">
              <div className="font-serif text-[32px] font-light leading-none">10+</div>
              <div className="font-sans text-[9px] tracking-[2.5px] uppercase mt-1 font-bold">
                Years of Excellence
              </div>
            </div>
          </div>
        </div>

        <div>
          <Eyebrow className="mb-5">What We Stand For</Eyebrow>
          <h3 className="font-serif text-[28px] font-light text-forest leading-tight mb-10">
            Our Core Values
          </h3>
          <div className="grid grid-cols-4 gap-5">
            {VALUES.map((val) => (
              <div
                key={val.title}
                className="bg-white border-t-2 border-gold p-7 hover:shadow-[0_12px_36px_rgba(26,64,53,.08)] transition-shadow"
              >
                <h4 className="font-sans text-[11px] font-bold tracking-[2px] uppercase text-gold mb-3">
                  {val.title}
                </h4>
                <p className="font-sans text-[13px] font-light text-ink-muted leading-[1.7]">
                  {val.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test, verify pass**

```bash
npm test -- --run firm-story.test
```

Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add tests/components/firm-story.test.tsx components/about/firm-story.tsx
git commit -m "feat: add FirmStory section for About page"
```

---

## Task 5: Build About `Credentials` Section

**Files:**
- Create: `tests/components/credentials.test.tsx`
- Create: `components/about/credentials.tsx`

- [ ] **Step 1: Write failing test** at `/Users/amirhamzah/Github/jin-legal/tests/components/credentials.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Credentials } from "@/components/about/credentials";

describe("Credentials", () => {
  it("renders section heading", () => {
    render(<Credentials />);
    expect(screen.getByRole("heading", { name: /credentials/i })).toBeInTheDocument();
  });

  it("lists all four credential items", () => {
    render(<Credentials />);
    expect(screen.getByText(/Business Identification Number/i)).toBeInTheDocument();
    expect(screen.getByText(/Tax Registration/i)).toBeInTheDocument();
    expect(screen.getByText(/Standard Certificate/i)).toBeInTheDocument();
    expect(screen.getByText(/Registered Practice/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test, verify fail**

```bash
npm test -- --run credentials.test
```

Expected: FAIL.

- [ ] **Step 3: Create `/Users/amirhamzah/Github/jin-legal/components/about/credentials.tsx`**

```tsx
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
```

- [ ] **Step 4: Run test, verify pass**

```bash
npm test -- --run credentials.test
```

Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add tests/components/credentials.test.tsx components/about/credentials.tsx
git commit -m "feat: add Credentials section for About page"
```

---

## Task 6: Compose About Page Route

**Files:**
- Create: `app/about/page.tsx`

- [ ] **Step 1: Create `/Users/amirhamzah/Github/jin-legal/app/about/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/ui/page-hero";
import { FirmStory } from "@/components/about/firm-story";
import { Credentials } from "@/components/about/credentials";
import { CtaBanner } from "@/components/homepage/cta-banner";

export const metadata: Metadata = {
  title: "About — Jin Legal | PT Juris International Network",
  description:
    "Jin Legal is the practice of PT Juris International Network — six partners delivering strategic legal counsel across 11 practice areas in Indonesia.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main>
        <PageHero
          eyebrow="About the Firm"
          title="A Modern Legal Partner for a Complex World"
          subtitle="Founded on the principle that exceptional legal counsel must be both strategically sharp and deeply human."
        />
        <FirmStory />
        <Credentials />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Run build to verify the new route compiles**

```bash
npm run build
```

Expected: `/about` listed in the routes output.

- [ ] **Step 3: Spot-check the page renders**

```bash
PORT=3010 npm run dev &
sleep 4
curl -s http://localhost:3010/about | grep -c "Modern Legal Partner"
pkill -f "next dev"
```

Expected: grep returns at least `1`.

- [ ] **Step 4: Commit**

```bash
git add app/about/page.tsx
git commit -m "feat: compose About page route"
```

---

## Task 7: Build `FullTeamGrid` Component

**Files:**
- Create: `tests/components/full-team-grid.test.tsx`
- Create: `components/team/full-team-grid.tsx`

- [ ] **Step 1: Write failing test** at `/Users/amirhamzah/Github/jin-legal/tests/components/full-team-grid.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FullTeamGrid } from "@/components/team/full-team-grid";
import { PARTNERS } from "@/lib/constants";

describe("FullTeamGrid", () => {
  it("renders all 6 partner names by default (no filter)", () => {
    render(<FullTeamGrid filter="all" />);
    for (const partner of PARTNERS) {
      expect(screen.getByText(partner.name)).toBeInTheDocument();
    }
  });

  it("filters to corporate-business group", () => {
    render(<FullTeamGrid filter="corporate-business" />);
    expect(screen.getByText("Muhammad Subuh Rezki")).toBeInTheDocument();
    expect(screen.getByText("Achmad Firmansyah")).toBeInTheDocument();
    expect(screen.queryByText("Ryan Tampubolon")).not.toBeInTheDocument();
  });

  it("filters to litigation group", () => {
    render(<FullTeamGrid filter="litigation" />);
    expect(screen.getByText("Ryan Tampubolon")).toBeInTheDocument();
    expect(screen.getByText("Amir Hamzah")).toBeInTheDocument();
    expect(screen.queryByText("Abi Rafdi")).not.toBeInTheDocument();
  });

  it("filters to specialties group", () => {
    render(<FullTeamGrid filter="specialties" />);
    expect(screen.getByText("Abi Rafdi")).toBeInTheDocument();
    expect(screen.getByText("Aditya Muriza")).toBeInTheDocument();
    expect(screen.queryByText("Muhammad Subuh Rezki")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test, verify fail**

```bash
npm test -- --run full-team-grid.test
```

Expected: FAIL.

- [ ] **Step 3: Create `/Users/amirhamzah/Github/jin-legal/components/team/full-team-grid.tsx`**

```tsx
import Image from "next/image";
import { PARTNERS, type PracticeGroup } from "@/lib/constants";

export function FullTeamGrid({ filter }: { filter: PracticeGroup }) {
  const visible =
    filter === "all" ? PARTNERS : PARTNERS.filter((p) => p.practiceGroup === filter);

  return (
    <div className="grid grid-cols-3 gap-[3px]">
      {visible.map((partner) => (
        <div key={partner.slug} className="relative overflow-hidden group cursor-pointer">
          <Image
            src={partner.photo}
            alt={partner.name}
            width={600}
            height={720}
            className="w-full h-[420px] object-cover object-top transition-all duration-[550ms] grayscale-[40%] brightness-[.85] saturate-[.9] group-hover:grayscale-0 group-hover:brightness-100 group-hover:saturate-100 group-hover:scale-[1.04]"
          />
          <div className="absolute bottom-0 left-0 right-0 px-5 pt-16 pb-5 [background:linear-gradient(0deg,rgba(10,24,18,.97)_0%,transparent_100%)] translate-y-7 group-hover:translate-y-0 transition-transform duration-400">
            <div className="font-sans text-[9px] tracking-[3px] text-gold font-bold uppercase mb-1.5">
              {partner.role}
            </div>
            <div className="font-serif text-[22px] text-white font-medium mb-0.5 leading-tight">
              {partner.name}
            </div>
            <div className="font-sans text-[10px] text-white/45 mb-3">{partner.credentials}</div>
            <p className="font-sans text-[11px] font-light text-white/55 leading-[1.6] opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
              {partner.bio}
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-[450ms]" />
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run test, verify pass**

```bash
npm test -- --run full-team-grid.test
```

Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add tests/components/full-team-grid.test.tsx components/team/full-team-grid.tsx
git commit -m "feat: add FullTeamGrid component with practice group filtering"
```

---

## Task 8: Build `TeamFilterTabs` Client Component

**Files:**
- Create: `tests/components/team-filter-tabs.test.tsx`
- Create: `components/team/team-filter-tabs.tsx`

- [ ] **Step 1: Write failing test** at `/Users/amirhamzah/Github/jin-legal/tests/components/team-filter-tabs.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TeamPageBody } from "@/components/team/team-filter-tabs";

describe("TeamPageBody (with filter tabs)", () => {
  it("renders all four filter tabs", () => {
    render(<TeamPageBody />);
    expect(screen.getByRole("button", { name: /all partners/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /corporate & business/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /litigation/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /specialties/i })).toBeInTheDocument();
  });

  it("shows all 6 partners on first render", () => {
    render(<TeamPageBody />);
    expect(screen.getByText("Muhammad Subuh Rezki")).toBeInTheDocument();
    expect(screen.getByText("Aditya Muriza")).toBeInTheDocument();
  });

  it("filters partners when Litigation tab is clicked", async () => {
    const user = userEvent.setup();
    render(<TeamPageBody />);
    await user.click(screen.getByRole("button", { name: /^litigation$/i }));
    expect(screen.getByText("Ryan Tampubolon")).toBeInTheDocument();
    expect(screen.queryByText("Muhammad Subuh Rezki")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test, verify fail**

```bash
npm test -- --run team-filter-tabs.test
```

Expected: FAIL.

- [ ] **Step 3: Create `/Users/amirhamzah/Github/jin-legal/components/team/team-filter-tabs.tsx`**

```tsx
"use client";

import { useState } from "react";
import { FullTeamGrid } from "./full-team-grid";
import { PRACTICE_GROUPS, type PracticeGroup } from "@/lib/constants";

export function TeamPageBody() {
  const [active, setActive] = useState<PracticeGroup>("all");

  return (
    <section className="bg-forest-deep px-[72px] py-20">
      <div className="flex gap-1 mb-12 border-b border-white/10">
        {PRACTICE_GROUPS.map((group) => {
          const isActive = group.id === active;
          return (
            <button
              key={group.id}
              type="button"
              onClick={() => setActive(group.id)}
              className={`font-sans text-[11px] font-semibold tracking-[2px] uppercase px-6 py-4 border-b-2 -mb-px transition-colors ${
                isActive
                  ? "text-gold border-gold"
                  : "text-white/40 border-transparent hover:text-white/70"
              }`}
            >
              {group.label}
            </button>
          );
        })}
      </div>
      <FullTeamGrid filter={active} />
    </section>
  );
}
```

- [ ] **Step 4: Run test, verify pass**

```bash
npm test -- --run team-filter-tabs.test
```

Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add tests/components/team-filter-tabs.test.tsx components/team/team-filter-tabs.tsx
git commit -m "feat: add TeamPageBody client component with filter tabs"
```

---

## Task 9: Compose Team Page Route

**Files:**
- Create: `app/team/page.tsx`

- [ ] **Step 1: Create `/Users/amirhamzah/Github/jin-legal/app/team/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/ui/page-hero";
import { TeamPageBody } from "@/components/team/team-filter-tabs";
import { CtaBanner } from "@/components/homepage/cta-banner";

export const metadata: Metadata = {
  title: "Our Team — Jin Legal | PT Juris International Network",
  description:
    "Six partners with deep expertise across corporate law, litigation, and specialized practice areas in Indonesia.",
};

export default function TeamPage() {
  return (
    <>
      <Nav />
      <main>
        <PageHero
          eyebrow="Our People"
          title="The Partners Behind Jin Legal"
          subtitle="Six dedicated legal professionals committed to delivering sharp, strategic counsel for every client — from startups to corporations."
        />
        <TeamPageBody />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: `/team` listed in routes, build succeeds.

- [ ] **Step 3: Smoke-test**

```bash
PORT=3010 npm run dev &
sleep 4
curl -s http://localhost:3010/team | grep -c "Muhammad Subuh Rezki"
pkill -f "next dev"
```

Expected: at least `1`.

- [ ] **Step 4: Commit**

```bash
git add app/team/page.tsx
git commit -m "feat: compose Team page route"
```

---

## Task 10: Build `PracticeListGrid` Component

**Files:**
- Create: `tests/components/practice-list-grid.test.tsx`
- Create: `components/practice-areas/practice-list-grid.tsx`

- [ ] **Step 1: Write failing test** at `/Users/amirhamzah/Github/jin-legal/tests/components/practice-list-grid.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PracticeListGrid } from "@/components/practice-areas/practice-list-grid";

describe("PracticeListGrid", () => {
  it("renders all 11 practice area titles", () => {
    render(<PracticeListGrid />);
    expect(screen.getByText("Business & Corporate Law")).toBeInTheDocument();
    expect(screen.getByText("Litigation & Dispute Resolution")).toBeInTheDocument();
    expect(screen.getByText("Banking, Finance & FinTech")).toBeInTheDocument();
    expect(screen.getByText("Sport & Entertainment")).toBeInTheDocument();
  });

  it("renders descriptions for each card", () => {
    render(<PracticeListGrid />);
    expect(screen.getByText(/Corporate transactions, M&A/i)).toBeInTheDocument();
  });

  it("links each card to its detail page", () => {
    render(<PracticeListGrid />);
    const link = screen.getByRole("link", { name: /business & corporate law/i });
    expect(link).toHaveAttribute("href", "/practice-areas/business-corporate-law");
  });
});
```

- [ ] **Step 2: Run test, verify fail**

```bash
npm test -- --run practice-list-grid.test
```

Expected: FAIL.

- [ ] **Step 3: Create `/Users/amirhamzah/Github/jin-legal/components/practice-areas/practice-list-grid.tsx`**

```tsx
import Link from "next/link";
import { PRACTICE_AREAS } from "@/lib/constants";
import { PracticeIcon } from "@/components/icons/practice-icons";

export function PracticeListGrid() {
  return (
    <section className="bg-ivory px-[72px] py-20">
      <div className="grid grid-cols-3 gap-5">
        {PRACTICE_AREAS.map((area) => (
          <Link
            key={area.slug}
            href={`/practice-areas/${area.slug}`}
            className="bg-white border-t-2 border-gold p-7 relative overflow-hidden transition-all hover:shadow-[0_16px_40px_rgba(26,64,53,.10)] hover:-translate-y-1 group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gold-pale to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <PracticeIcon name={area.icon} className="w-8 h-8 text-forest mb-5" />
              <div className="font-serif text-[14px] text-gold mb-2">{area.num}</div>
              <h3 className="font-serif text-[20px] font-medium text-forest leading-tight mb-3">
                {area.title}
              </h3>
              <p className="font-sans text-[12px] font-light text-ink-muted leading-[1.7] mb-5">
                {area.description}
              </p>
              <div className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-gold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                Learn More →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test, verify pass**

```bash
npm test -- --run practice-list-grid.test
```

Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add tests/components/practice-list-grid.test.tsx components/practice-areas/practice-list-grid.tsx
git commit -m "feat: add PracticeListGrid for Practice Areas listing page"
```

---

## Task 11: Compose Practice Areas Listing Page

**Files:**
- Create: `app/practice-areas/page.tsx`

- [ ] **Step 1: Create `/Users/amirhamzah/Github/jin-legal/app/practice-areas/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/ui/page-hero";
import { PracticeListGrid } from "@/components/practice-areas/practice-list-grid";
import { CtaBanner } from "@/components/homepage/cta-banner";

export const metadata: Metadata = {
  title: "Practice Areas — Jin Legal | PT Juris International Network",
  description:
    "Eleven practice areas spanning corporate law, litigation, regulatory advisory, intellectual property, and specialized domains.",
};

export default function PracticeAreasPage() {
  return (
    <>
      <Nav />
      <main>
        <PageHero
          eyebrow="What We Do"
          title="Our Practice Areas"
          subtitle="Eleven focused practice areas spanning corporate transactions, dispute resolution, regulatory advisory, and specialized industry expertise."
        />
        <PracticeListGrid />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: `/practice-areas` listed.

- [ ] **Step 3: Smoke-test**

```bash
PORT=3010 npm run dev &
sleep 4
curl -s http://localhost:3010/practice-areas | grep -c "11 practice"
pkill -f "next dev"
```

(Note: grep is for any "11" or "practice" presence; exact count not critical.)

- [ ] **Step 4: Commit**

```bash
git add app/practice-areas/page.tsx
git commit -m "feat: compose Practice Areas listing page"
```

---

## Task 12: Build `PracticeDetailHero` Component

**Files:**
- Create: `tests/components/practice-detail-hero.test.tsx`
- Create: `components/practice-areas/practice-detail-hero.tsx`

- [ ] **Step 1: Write failing test** at `/Users/amirhamzah/Github/jin-legal/tests/components/practice-detail-hero.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PracticeDetailHero } from "@/components/practice-areas/practice-detail-hero";
import { PRACTICE_AREAS } from "@/lib/constants";

describe("PracticeDetailHero", () => {
  it("renders the area title and number", () => {
    const area = PRACTICE_AREAS[0];
    render(<PracticeDetailHero area={area} />);
    expect(screen.getByRole("heading", { name: area.title })).toBeInTheDocument();
    expect(screen.getByText(area.num)).toBeInTheDocument();
  });

  it("renders breadcrumb link back to listing", () => {
    const area = PRACTICE_AREAS[0];
    render(<PracticeDetailHero area={area} />);
    expect(screen.getByRole("link", { name: /practice areas/i })).toHaveAttribute(
      "href",
      "/practice-areas"
    );
  });

  it("renders the area description", () => {
    const area = PRACTICE_AREAS[5];
    render(<PracticeDetailHero area={area} />);
    expect(screen.getByText(area.description)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test, verify fail**

```bash
npm test -- --run practice-detail-hero.test
```

Expected: FAIL.

- [ ] **Step 3: Create `/Users/amirhamzah/Github/jin-legal/components/practice-areas/practice-detail-hero.tsx`**

```tsx
import Link from "next/link";
import { PracticeIcon } from "@/components/icons/practice-icons";
import type { PracticeArea } from "@/lib/constants";

export function PracticeDetailHero({ area }: { area: PracticeArea }) {
  return (
    <section className="bg-forest-deep pt-[120px] pb-20 px-[72px] relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,168,76,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,.04) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      />
      <div className="relative z-10 max-w-[1100px] mx-auto">
        <nav className="flex items-center gap-3 font-sans text-[10px] tracking-[2px] uppercase text-white/40 mb-10">
          <Link href="/practice-areas" className="hover:text-gold transition-colors">
            Practice Areas
          </Link>
          <span className="text-gold/50">/</span>
          <span className="text-gold">{area.num}</span>
        </nav>
        <div className="grid grid-cols-[auto_1fr] gap-8 items-start">
          <div className="border border-gold/30 p-5">
            <PracticeIcon name={area.icon} className="w-12 h-12 text-gold" />
          </div>
          <div>
            <div className="font-serif text-[28px] text-gold font-light mb-3">
              {area.num}
            </div>
            <h1 className="font-serif text-[clamp(36px,4.8vw,56px)] font-light text-white leading-[1.15] tracking-tight mb-6">
              {area.title}
            </h1>
            <p className="font-sans text-[15px] font-light text-white/55 leading-[1.85] max-w-[640px]">
              {area.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test, verify pass**

```bash
npm test -- --run practice-detail-hero.test
```

Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add tests/components/practice-detail-hero.test.tsx components/practice-areas/practice-detail-hero.tsx
git commit -m "feat: add PracticeDetailHero with breadcrumb and area metadata"
```

---

## Task 13: Build `PracticeDetailContent` Component

**Files:**
- Create: `tests/components/practice-detail-content.test.tsx`
- Create: `components/practice-areas/practice-detail-content.tsx`

- [ ] **Step 1: Write failing test** at `/Users/amirhamzah/Github/jin-legal/tests/components/practice-detail-content.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PracticeDetailContent } from "@/components/practice-areas/practice-detail-content";
import { PRACTICE_AREAS } from "@/lib/constants";

describe("PracticeDetailContent", () => {
  it("renders the full content paragraph", () => {
    const area = PRACTICE_AREAS[0];
    render(<PracticeDetailContent area={area} />);
    expect(screen.getByText(area.fullContent)).toBeInTheDocument();
  });

  it("renders all services for the area", () => {
    const area = PRACTICE_AREAS[0];
    render(<PracticeDetailContent area={area} />);
    for (const svc of area.services) {
      expect(screen.getByText(svc)).toBeInTheDocument();
    }
  });

  it("renders 'How We Help' section heading", () => {
    const area = PRACTICE_AREAS[0];
    render(<PracticeDetailContent area={area} />);
    expect(screen.getByRole("heading", { name: /how we help/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test, verify fail**

```bash
npm test -- --run practice-detail-content.test
```

Expected: FAIL.

- [ ] **Step 3: Create `/Users/amirhamzah/Github/jin-legal/components/practice-areas/practice-detail-content.tsx`**

```tsx
import { Eyebrow } from "@/components/ui/eyebrow";
import type { PracticeArea } from "@/lib/constants";

export function PracticeDetailContent({ area }: { area: PracticeArea }) {
  return (
    <section className="bg-ivory px-[72px] py-20">
      <div className="max-w-[1100px] mx-auto grid grid-cols-[2fr_1fr] gap-16">
        <div>
          <Eyebrow className="mb-5">Overview</Eyebrow>
          <h2 className="font-serif text-[32px] font-light text-forest leading-tight mb-6">
            Our Approach
          </h2>
          <p className="font-sans text-[15px] font-light text-ink leading-[1.85]">
            {area.fullContent}
          </p>
        </div>
        <aside>
          <Eyebrow className="mb-5">How We Help</Eyebrow>
          <h2 className="sr-only">How We Help</h2>
          <ul className="space-y-3 list-none p-0 m-0">
            {area.services.map((svc) => (
              <li
                key={svc}
                className="flex items-start gap-3 font-sans text-[13px] font-light text-ink-muted leading-[1.6] pb-3 border-b border-ivory-dark"
              >
                <span className="text-gold mt-1 flex-shrink-0">—</span>
                <span>{svc}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test, verify pass**

```bash
npm test -- --run practice-detail-content.test
```

Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add tests/components/practice-detail-content.test.tsx components/practice-areas/practice-detail-content.tsx
git commit -m "feat: add PracticeDetailContent with overview and services list"
```

---

## Task 14: Build `RelatedPartners` Component

**Files:**
- Create: `tests/components/related-partners.test.tsx`
- Create: `components/practice-areas/related-partners.tsx`

- [ ] **Step 1: Write failing test** at `/Users/amirhamzah/Github/jin-legal/tests/components/related-partners.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RelatedPartners } from "@/components/practice-areas/related-partners";

describe("RelatedPartners", () => {
  it("renders only partners associated with the given slug", () => {
    render(<RelatedPartners practiceSlug="banking-finance-fintech" />);
    expect(screen.getByText("Achmad Firmansyah")).toBeInTheDocument();
    expect(screen.queryByText("Ryan Tampubolon")).not.toBeInTheDocument();
  });

  it("renders multiple partners for areas with multiple specialists", () => {
    render(<RelatedPartners practiceSlug="business-corporate-law" />);
    expect(screen.getByText("Muhammad Subuh Rezki")).toBeInTheDocument();
    expect(screen.getByText("Achmad Firmansyah")).toBeInTheDocument();
  });

  it("renders nothing if no partners match", () => {
    const { container } = render(<RelatedPartners practiceSlug="nonexistent-slug" />);
    expect(container.firstChild).toBeNull();
  });
});
```

- [ ] **Step 2: Run test, verify fail**

```bash
npm test -- --run related-partners.test
```

Expected: FAIL.

- [ ] **Step 3: Create `/Users/amirhamzah/Github/jin-legal/components/practice-areas/related-partners.tsx`**

```tsx
import Image from "next/image";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PARTNERS } from "@/lib/constants";

export function RelatedPartners({ practiceSlug }: { practiceSlug: string }) {
  const relevant = PARTNERS.filter((p) =>
    (p.practiceAreas as readonly string[]).includes(practiceSlug)
  );
  if (relevant.length === 0) return null;

  return (
    <section className="bg-forest-deep px-[72px] py-20">
      <div className="max-w-[1100px] mx-auto">
        <Eyebrow className="mb-5">Our People</Eyebrow>
        <h2 className="font-serif text-[32px] font-light text-white leading-tight mb-12">
          Partners in This Practice
        </h2>
        <div className="grid grid-cols-3 gap-[3px]">
          {relevant.map((partner) => (
            <div key={partner.slug} className="relative overflow-hidden group">
              <Image
                src={partner.photo}
                alt={partner.name}
                width={500}
                height={600}
                className="w-full h-[340px] object-cover object-top grayscale-[40%] brightness-[.85] saturate-[.9] transition-all duration-500 group-hover:grayscale-0 group-hover:brightness-100 group-hover:saturate-100 group-hover:scale-[1.04]"
              />
              <div className="absolute bottom-0 left-0 right-0 px-5 pt-12 pb-5 [background:linear-gradient(0deg,rgba(10,24,18,.96)_0%,transparent_100%)]">
                <div className="font-sans text-[9px] tracking-[3px] text-gold font-bold uppercase mb-1">
                  {partner.role}
                </div>
                <div className="font-serif text-[18px] text-white font-medium">{partner.name}</div>
                <div className="font-sans text-[10px] text-white/35">{partner.credentials}</div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-[450ms]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test, verify pass**

```bash
npm test -- --run related-partners.test
```

Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add tests/components/related-partners.test.tsx components/practice-areas/related-partners.tsx
git commit -m "feat: add RelatedPartners component for practice area detail pages"
```

---

## Task 15: Compose Practice Area Detail Route with `generateStaticParams`

**Files:**
- Create: `app/practice-areas/[slug]/page.tsx`

- [ ] **Step 1: Create `/Users/amirhamzah/Github/jin-legal/app/practice-areas/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PracticeDetailHero } from "@/components/practice-areas/practice-detail-hero";
import { PracticeDetailContent } from "@/components/practice-areas/practice-detail-content";
import { RelatedPartners } from "@/components/practice-areas/related-partners";
import { CtaBanner } from "@/components/homepage/cta-banner";
import { PRACTICE_AREAS } from "@/lib/constants";

export function generateStaticParams() {
  return PRACTICE_AREAS.map((area) => ({ slug: area.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const area = PRACTICE_AREAS.find((a) => a.slug === params.slug);
  if (!area) return { title: "Not Found — Jin Legal" };
  return {
    title: `${area.title} — Jin Legal | PT Juris International Network`,
    description: area.description,
  };
}

export default function PracticeAreaDetailPage({ params }: { params: { slug: string } }) {
  const area = PRACTICE_AREAS.find((a) => a.slug === params.slug);
  if (!area) notFound();

  return (
    <>
      <Nav />
      <main>
        <PracticeDetailHero area={area} />
        <PracticeDetailContent area={area} />
        <RelatedPartners practiceSlug={area.slug} />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: build output shows 11 pre-rendered static pages under `/practice-areas/[slug]`. Look for the route listing with all 11 slugs.

- [ ] **Step 3: Smoke-test multiple detail pages**

```bash
PORT=3010 npm run dev &
sleep 4
echo "--- business-corporate-law ---"
curl -s http://localhost:3010/practice-areas/business-corporate-law | grep -c "Business & Corporate Law"
echo "--- banking-finance-fintech ---"
curl -s http://localhost:3010/practice-areas/banking-finance-fintech | grep -c "Banking, Finance & FinTech"
echo "--- bogus slug should 404 ---"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3010/practice-areas/nonexistent
pkill -f "next dev"
```

Expected:
- First two `grep -c` return at least `1`
- Last one returns `404`

- [ ] **Step 4: Commit**

```bash
git add app/practice-areas/\[slug\]/page.tsx
git commit -m "feat: compose Practice Area detail route with static generation for 11 slugs"
```

---

## Task 16: Update Nav for Active Route Highlighting (optional polish)

**Files:**
- Modify: `components/layout/nav.tsx`
- Modify: `tests/components/nav.test.tsx`

- [ ] **Step 1: Read existing `/Users/amirhamzah/Github/jin-legal/components/layout/nav.tsx`** (just look — it currently has no active state).

- [ ] **Step 2: Replace `/Users/amirhamzah/Github/jin-legal/components/layout/nav.tsx` with active-route-aware version**

```tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[70px] px-[72px] flex items-center justify-between bg-forest-deep/96 backdrop-blur-xl border-b border-gold/20">
      <Link href="/" className="block">
        <Image
          src="/logo/jin-logo.png"
          alt="JIN Legal"
          width={86}
          height={28}
          priority
          className="h-7 w-auto brightness-0 invert"
        />
      </Link>
      <div className="flex gap-10 items-center">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative font-sans text-[11px] font-medium tracking-[2px] uppercase transition-colors ${
                isActive ? "text-gold" : "text-white/55 hover:text-white/90"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
      <Link
        href="/contact"
        className="font-sans text-[10px] font-semibold tracking-[2px] uppercase text-forest-deep bg-gold hover:bg-gold-light px-6 py-2.5 transition-colors"
      >
        Consult With Us
      </Link>
    </nav>
  );
}
```

- [ ] **Step 3: Update `/Users/amirhamzah/Github/jin-legal/tests/components/nav.test.tsx`** to mock `usePathname`

Replace the file with:

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Nav } from "@/components/layout/nav";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("Nav", () => {
  it("renders all navigation links", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /practice areas/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /our team/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /insights/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /careers/i })).toBeInTheDocument();
  });

  it("renders Consult With Us CTA", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: /consult with us/i })).toBeInTheDocument();
  });

  it("renders JIN logo image", () => {
    render(<Nav />);
    const logo = screen.getByAltText(/jin legal/i);
    expect(logo).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Run nav tests**

```bash
npm test -- --run nav.test
```

Expected: PASS (3 tests).

- [ ] **Step 5: Run full test suite to verify no regressions**

```bash
npm test -- --run
```

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add components/layout/nav.tsx tests/components/nav.test.tsx
git commit -m "feat: highlight active route in nav using usePathname"
```

---

## Task 17: Add E2E Tests for New Pages

**Files:**
- Modify: `tests/e2e/homepage.spec.ts` — rename to cover all pages, or
- Create: `tests/e2e/pages.spec.ts`

We'll create a new spec file so the existing homepage spec stays focused.

- [ ] **Step 1: Create `/Users/amirhamzah/Github/jin-legal/tests/e2e/pages.spec.ts`**

```typescript
import { test, expect } from "@playwright/test";

test.describe("Static pages", () => {
  test("About page loads and renders firm story", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Modern Legal Partner");
    await expect(page.getByText("Integrity")).toBeVisible();
    await expect(page.getByText(/PT Juris International Network/i).first()).toBeVisible();
  });

  test("Team page loads with all 6 partners visible", async ({ page }) => {
    await page.goto("/team");
    await expect(page.getByText("Muhammad Subuh Rezki")).toBeVisible();
    await expect(page.getByText("Ryan Tampubolon")).toBeVisible();
    await expect(page.getByText("Abi Rafdi")).toBeVisible();
    await expect(page.getByText("Achmad Firmansyah")).toBeVisible();
    await expect(page.getByText("Amir Hamzah")).toBeVisible();
    await expect(page.getByText("Aditya Muriza")).toBeVisible();
  });

  test("Team page Litigation filter works", async ({ page }) => {
    await page.goto("/team");
    await page.getByRole("button", { name: /^litigation$/i }).click();
    await expect(page.getByText("Ryan Tampubolon")).toBeVisible();
    await expect(page.getByText("Muhammad Subuh Rezki")).not.toBeVisible();
  });

  test("Practice Areas listing shows all 11 cards", async ({ page }) => {
    await page.goto("/practice-areas");
    await expect(page.getByText("Business & Corporate Law")).toBeVisible();
    await expect(page.getByText("Banking, Finance & FinTech")).toBeVisible();
    await expect(page.getByText("Insolvency, Restructuring & PKPU")).toBeVisible();
  });

  test("Practice area detail page renders and 404s correctly", async ({ page }) => {
    await page.goto("/practice-areas/banking-finance-fintech");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Banking, Finance & FinTech");
    await expect(page.getByText(/Our Approach/i)).toBeVisible();
    await expect(page.getByText("Achmad Firmansyah")).toBeVisible();

    const bogus = await page.goto("/practice-areas/this-does-not-exist");
    expect(bogus?.status()).toBe(404);
  });

  test("Nav highlights active route on About page", async ({ page }) => {
    await page.goto("/about");
    const aboutLink = page.getByRole("link", { name: /^about$/i });
    await expect(aboutLink).toHaveClass(/text-gold/);
  });
});
```

- [ ] **Step 2: Run E2E tests**

```bash
npm run test:e2e
```

Expected: All tests pass (4 existing homepage tests + 6 new page tests = 10 total).

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/pages.spec.ts
git commit -m "test: add E2E tests for About, Team, and Practice Areas pages"
```

---

## Task 18: Final Validation

**No code — verification only.**

- [ ] **Step 1: Full type + unit + E2E + build check**

```bash
npm run typecheck && npm test -- --run && npm run test:e2e && npm run build
```

Expected: all four pass cleanly.

- [ ] **Step 2: Confirm route count**

After `npm run build`, the route table should list:
- `/` (homepage)
- `/about`
- `/team`
- `/practice-areas`
- `/practice-areas/business-corporate-law` through `/practice-areas/banking-finance-fintech` (11 slugs)

Total: 14 static routes + `/_not-found` = 15 prerendered pages.

- [ ] **Step 3: Push everything to GitHub**

```bash
git push origin main
```

- [ ] **Step 4: If anything fails, fix and re-run. Otherwise, Phase 2 complete.**

No commit needed — verification only.

---

## Self-Review Notes

**Spec coverage (Phase 2 portion):**
- ✅ About page with firm story, mission, values, credentials — Tasks 4, 5, 6
- ✅ Team page with 6 partners and filter tabs — Tasks 7, 8, 9
- ✅ Practice Areas listing (4-col / 3-col grid) — Tasks 10, 11
- ✅ Practice Area detail pages (×11) with hero, description, services, related partners — Tasks 12, 13, 14, 15
- ✅ Static generation for 11 practice area slugs — Task 15
- ✅ Shared `PageHero` primitive — Task 3
- ✅ Extended constants with descriptions, bios, photos — Tasks 1, 2
- ✅ Nav active-route highlighting (nice-to-have polish) — Task 16
- ✅ E2E coverage — Task 17

**Out of scope (Phase 3):**
- Insights blog (listing + detail)
- Careers page
- Contact page + form submission
- Admin dashboard
- Multi-language (per spec section 10)
- Real partner photos (still Unsplash placeholders — flag for stakeholder before public launch)

**Carry-overs from Phase 1 final review (still open, optional polish):**
- Button primitive not consistently used across hero/CTA/nav (hand-rolled link classes)
- `lib/data/queries.ts` not created (will be needed in Phase 3 for Supabase reads)
- Unused Geist font binaries have been cleaned up in Task 3 of Phase 1 ✅

**Phase 2 deliverable:** 14 fully-rendered static routes, all served via SSG. Site is "feature-complete" for everything that doesn't require a database — visitors can browse the firm, team, and 11 practice areas. Contact CTAs still point to `/contact` (which doesn't exist yet — they will 404 until Phase 3). Consider temporarily routing CTAs to `mailto:info@jinlegal.co.id` if Phase 3 is delayed.
