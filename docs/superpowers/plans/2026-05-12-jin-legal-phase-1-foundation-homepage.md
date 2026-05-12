# Jin Legal — Phase 1: Foundation + Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy a working Jin Legal homepage on Vercel with the full design system, Supabase connection, and shared layout (nav + footer) — ready for subsequent page builds.

**Architecture:** Next.js 14 App Router + TypeScript + Tailwind. Supabase (PostgreSQL) backs content (practice areas, team members, blog posts, careers) plus contact form submissions. Homepage v1 reads seeded data from Supabase; admin CRUD is a later phase. All design tokens (forest green + gold) live in Tailwind config; typography is loaded via next/font.

**Tech Stack:**
- Next.js 14.2+ (App Router, TypeScript)
- Tailwind CSS 3.4
- Supabase JS client v2 + Postgres
- next/font (Cormorant Garamond, Jost)
- Vercel (deployment)
- Vitest + React Testing Library (unit/component tests)
- Playwright (smoke E2E on homepage)

---

## File Structure

```
app/
  layout.tsx              Root layout: fonts, body wrapper, grain overlay
  page.tsx                Homepage (composes section components)
  globals.css             Tailwind directives + base resets + grain SVG
  fonts.ts                next/font Cormorant + Jost setup

components/
  layout/
    nav.tsx               Fixed top navigation
    footer.tsx            Site footer
    grain-overlay.tsx     Fixed grain texture overlay
  homepage/
    hero.tsx              Hero section
    stats-bar.tsx         4-stat bar
    about-strip.tsx       About section + value cards
    practice-areas.tsx    Icon grid of 11 areas
    team-preview.tsx      3-card cinematic team teaser
    insights.tsx          Featured + 2 article preview
    cta-banner.tsx        Gold "Ready to work with us"
  ui/
    button.tsx            btn-gold, btn-ghost, btn-white variants
    eyebrow.tsx           Reusable uppercase eyebrow label
    section-head.tsx      Title + eyebrow + view-all link
  icons/
    practice-icons.tsx    11 SVG icons indexed by slug

lib/
  supabase/
    client.ts             Browser Supabase client (anon key)
    server.ts             Server Supabase client (cookies-aware)
    types.ts              Generated DB types (from Supabase CLI)
  data/
    queries.ts            getPracticeAreas, getTeamMembers, getRecentPosts
  constants.ts            Static fallbacks: PARTNERS, PRACTICE_AREAS, STATS

public/
  logo/
    jin-logo.png          Cropped logo (copied from assets/logo/jin-logo-crop.png)

supabase/
  migrations/
    20260512000000_initial_schema.sql   5 tables + RLS policies
  seed.sql                              Seed: 11 practice areas, 6 partners, 3 sample posts

tests/
  components/
    nav.test.tsx          Navigation renders all links
    hero.test.tsx         Hero copy + CTAs render
    practice-areas.test.tsx  11 cards render with icons
  e2e/
    homepage.spec.ts      Playwright: homepage loads, scroll, no console errors

Config:
  package.json
  tsconfig.json
  tailwind.config.ts
  next.config.mjs
  .env.local.example
  .eslintrc.json
  vitest.config.ts
  playwright.config.ts
  vercel.json
```

---

## Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.mjs`
- Create: `.eslintrc.json`
- Create: `.gitignore` (extend existing)

- [ ] **Step 1: Run create-next-app in current directory**

```bash
cd /Users/amirhamzah/Github/jin-legal
npx create-next-app@14 . \
  --typescript --tailwind --app --src-dir=false --import-alias="@/*" \
  --use-npm --no-git --eslint
```

When prompted about existing files (assets, docs, .gitignore), answer "No" to overwriting.

- [ ] **Step 2: Verify Next.js installed**

Run: `npx next --version`
Expected: `Next.js v14.x.x`

- [ ] **Step 3: Update package.json metadata**

Open `package.json`, replace the top-level keys with:

```json
{
  "name": "jin-legal",
  "version": "0.1.0",
  "private": true,
  "description": "Jin Legal — PT Juris International Network official website",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest",
    "test:e2e": "playwright test",
    "typecheck": "tsc --noEmit"
  }
}
```

Keep all existing `dependencies` and `devDependencies` blocks below.

- [ ] **Step 4: Extend .gitignore for Next.js**

Append to `.gitignore`:

```
# Next.js
.next/
out/
next-env.d.ts

# Testing
coverage/
playwright-report/
test-results/

# Editor
.vscode/
.idea/
```

- [ ] **Step 5: Run dev server smoke test**

Run: `npm run dev`
Open `http://localhost:3000` — verify the default Next.js page loads.
Stop dev server with Ctrl+C.

- [ ] **Step 6: Commit**

```bash
git add package.json tsconfig.json next.config.mjs .eslintrc.json .gitignore tailwind.config.ts postcss.config.mjs app/ public/
git commit -m "chore: initialize Next.js 14 project with TypeScript and Tailwind"
```

---

## Task 2: Configure Design Tokens in Tailwind

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

- [ ] **Step 1: Replace tailwind.config.ts with design tokens**

Open `tailwind.config.ts` and replace the entire file with:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#1a4035",
          deep: "#0e2820",
          mid: "#245548",
          hover: "#2d6b5a",
        },
        gold: {
          DEFAULT: "#c9a84c",
          light: "#e2c97e",
          pale: "#f5edda",
        },
        ivory: {
          DEFAULT: "#faf7f1",
          dark: "#f0ebe0",
        },
        ink: {
          DEFAULT: "#1a2420",
          muted: "#6b7f78",
          faint: "#a8b8b2",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-jost)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.25em",
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 2: Replace app/globals.css with base styles + grain**

Open `app/globals.css` and replace the entire file with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { -webkit-font-smoothing: antialiased; }
  body {
    @apply bg-ivory text-ink font-sans;
    overflow-x: hidden;
  }
  h1, h2, h3, h4, h5 { @apply font-serif; }
}

@layer utilities {
  .grain-overlay::before {
    content: "";
    position: fixed;
    inset: 0;
    z-index: 999;
    pointer-events: none;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.ts app/globals.css
git commit -m "feat: add Tailwind design tokens for forest green + gold palette"
```

---

## Task 3: Load Fonts via next/font

**Files:**
- Create: `app/fonts.ts`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create app/fonts.ts**

```typescript
import { Cormorant_Garamond, Jost } from "next/font/google";

export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jost",
  display: "swap",
});
```

- [ ] **Step 2: Replace app/layout.tsx with font-wired layout**

```tsx
import type { Metadata } from "next";
import { cormorant, jost } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jin Legal — PT Juris International Network",
  description:
    "A full-service legal consultancy serving corporations, institutions, and individuals across 11 practice areas throughout Indonesia.",
  metadataBase: new URL("https://jinlegal.co.id"),
  openGraph: {
    title: "Jin Legal — Legal Excellence, Strategic Results",
    description: "Strategic legal counsel across 11 practice areas.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="grain-overlay">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Verify dev server renders with new fonts**

Run: `npm run dev`
Open `http://localhost:3000` — verify default page text uses Jost (sans). Inspect DOM, confirm `<html>` has both font variables.
Stop dev server with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add app/fonts.ts app/layout.tsx
git commit -m "feat: load Cormorant Garamond + Jost via next/font"
```

---

## Task 4: Add Testing Infrastructure (Vitest + RTL + Playwright)

**Files:**
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`
- Create: `playwright.config.ts`
- Modify: `package.json` (devDependencies)

- [ ] **Step 1: Install test dependencies**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test
npx playwright install chromium
```

- [ ] **Step 2: Create vitest.config.ts**

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    exclude: ["tests/e2e/**"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
});
```

- [ ] **Step 3: Create tests/setup.ts**

```typescript
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});
```

- [ ] **Step 4: Create playwright.config.ts**

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

- [ ] **Step 5: Verify Vitest runs (no tests yet, exit code 0)**

Run: `npm test -- --run`
Expected: `No test files found` — that's fine. Exit code is 0 or "no tests" warning.

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts tests/setup.ts playwright.config.ts package.json package-lock.json
git commit -m "chore: add Vitest + RTL + Playwright test infrastructure"
```

---

## Task 5: Set Up Supabase Project + Local Migration

**Files:**
- Create: `supabase/migrations/20260512000000_initial_schema.sql`
- Create: `supabase/seed.sql`
- Create: `.env.local.example`
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/types.ts`

- [ ] **Step 1: Install Supabase client + CLI**

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install -D supabase
```

- [ ] **Step 2: Create migration file**

Path: `supabase/migrations/20260512000000_initial_schema.sql`

```sql
-- Practice Areas
create table practice_areas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text not null,
  full_content text,
  icon_name text not null,
  display_order int not null default 0,
  created_at timestamptz default now()
);

-- Team Members
create table team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  credentials text,
  role text not null,
  bio text,
  photo_url text,
  practice_areas text[],
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

-- Blog Posts
create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null,
  cover_image_url text,
  category text,
  author_id uuid references team_members(id),
  published_at timestamptz,
  is_published boolean not null default false,
  created_at timestamptz default now()
);

-- Careers
create table careers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  type text not null,
  location text,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

-- Contact Leads
create table contact_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  subject text,
  message text not null,
  created_at timestamptz default now()
);

-- Row Level Security: public read for content, no public read for leads
alter table practice_areas enable row level security;
alter table team_members enable row level security;
alter table blog_posts enable row level security;
alter table careers enable row level security;
alter table contact_leads enable row level security;

create policy "practice_areas read" on practice_areas for select to anon using (true);
create policy "team_members read active" on team_members for select to anon using (is_active = true);
create policy "blog_posts read published" on blog_posts for select to anon using (is_published = true);
create policy "careers read active" on careers for select to anon using (is_active = true);
create policy "contact_leads insert" on contact_leads for insert to anon with check (true);

create index idx_practice_areas_order on practice_areas(display_order);
create index idx_team_members_order on team_members(display_order) where is_active = true;
create index idx_blog_posts_published on blog_posts(published_at desc) where is_published = true;
```

- [ ] **Step 3: Create seed file**

Path: `supabase/seed.sql`

```sql
insert into practice_areas (title, slug, description, icon_name, display_order) values
  ('Business & Corporate Law', 'business-corporate-law', 'Corporate transactions, M&A, governance, and commercial contracts.', 'briefcase', 1),
  ('Litigation & Dispute Resolution', 'litigation-dispute-resolution', 'Commercial disputes, arbitration, and trial advocacy.', 'scales', 2),
  ('Employment Law', 'employment-law', 'Workforce strategy, labor disputes, and HR compliance.', 'people', 3),
  ('Advisory & Regulatory Compliance', 'advisory-regulatory-compliance', 'Regulatory navigation and ongoing compliance counsel.', 'shield-check', 4),
  ('Insolvency, Restructuring & PKPU', 'insolvency-restructuring-pkpu', 'Restructuring, insolvency, and debt suspension proceedings.', 'refresh', 5),
  ('Technology, Media & Telecommunications', 'technology-media-telecommunications', 'TMT regulation, platform compliance, and digital strategy.', 'screen', 6),
  ('Intellectual Property', 'intellectual-property', 'Patents, trademarks, copyrights, and IP enforcement.', 'lightbulb', 7),
  ('Consumer Protection', 'consumer-protection', 'Consumer rights advocacy and compliance counsel.', 'shield-user', 8),
  ('Criminal Defense & White Collar Crime', 'criminal-defense-white-collar', 'Criminal defense and white collar matters.', 'lock', 9),
  ('Sport & Entertainment', 'sport-entertainment', 'Sports law, entertainment contracts, and talent representation.', 'trophy', 10),
  ('Banking, Finance & FinTech', 'banking-finance-fintech', 'Banking regulation, FinTech licensing, and digital assets.', 'bank', 11);

insert into team_members (name, credentials, role, display_order) values
  ('Muhammad Subuh Rezki', 'S.H.', 'Managing Partner', 1),
  ('Ryan Tampubolon', 'S.H.', 'Partner', 2),
  ('Abi Rafdi', 'S.H.', 'Partner', 3),
  ('Achmad Firmansyah', 'S.H.', 'Partner', 4),
  ('Amir Hamzah', 'S.H.', 'Partner', 5),
  ('Aditya Muriza', 'S.H.', 'Partner', 6);
```

- [ ] **Step 4: Create .env.local.example**

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Tell the user to copy this to `.env.local` and fill in real Supabase credentials. Pause here for them to create the Supabase project at https://supabase.com/dashboard, run the migration, and add their credentials.

- [ ] **Step 5: Create lib/supabase/client.ts**

```typescript
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

- [ ] **Step 6: Create lib/supabase/server.ts**

```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

export function createClient() {
  const cookieStore = cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}
```

- [ ] **Step 7: Create lib/supabase/types.ts (placeholder, regenerate later)**

```typescript
export type Database = {
  public: {
    Tables: {
      practice_areas: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          full_content: string | null;
          icon_name: string;
          display_order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["practice_areas"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["practice_areas"]["Insert"]>;
      };
      team_members: {
        Row: {
          id: string;
          name: string;
          credentials: string | null;
          role: string;
          bio: string | null;
          photo_url: string | null;
          practice_areas: string[] | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["team_members"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["team_members"]["Insert"]>;
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          cover_image_url: string | null;
          category: string | null;
          author_id: string | null;
          published_at: string | null;
          is_published: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["blog_posts"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Insert"]>;
      };
      careers: {
        Row: {
          id: string;
          title: string;
          description: string;
          type: string;
          location: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["careers"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["careers"]["Insert"]>;
      };
      contact_leads: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          company: string | null;
          subject: string | null;
          message: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["contact_leads"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["contact_leads"]["Insert"]>;
      };
    };
  };
};
```

- [ ] **Step 8: Commit**

```bash
git add supabase/ lib/supabase/ .env.local.example package.json package-lock.json
git commit -m "feat: add Supabase schema, seed data, and client setup"
```

---

## Task 6: Static Constants for Fallback Data

**Files:**
- Create: `lib/constants.ts`
- Create: `components/icons/practice-icons.tsx`

- [ ] **Step 1: Create lib/constants.ts**

```typescript
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
```

- [ ] **Step 2: Create components/icons/practice-icons.tsx**

```tsx
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
```

- [ ] **Step 3: Commit**

```bash
git add lib/constants.ts components/icons/
git commit -m "feat: add static fallback data and practice area icons"
```

---

## Task 7: Build Button UI Primitive

**Files:**
- Create: `tests/components/button.test.tsx`
- Create: `components/ui/button.tsx`

- [ ] **Step 1: Write failing test**

Path: `tests/components/button.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders gold variant with correct classes", () => {
    render(<Button variant="gold">Consult With Us</Button>);
    const btn = screen.getByRole("button", { name: /consult with us/i });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain("bg-gold");
  });

  it("renders ghost variant with border", () => {
    render(<Button variant="ghost">Learn More</Button>);
    const btn = screen.getByRole("button", { name: /learn more/i });
    expect(btn.className).toContain("border");
  });

  it("renders as link when href provided", () => {
    render(<Button variant="gold" href="/contact">Get in Touch</Button>);
    expect(screen.getByRole("link", { name: /get in touch/i })).toHaveAttribute("href", "/contact");
  });
});
```

- [ ] **Step 2: Run test, verify fail**

Run: `npm test -- --run button.test`
Expected: FAIL — `Button` cannot be imported.

- [ ] **Step 3: Create components/ui/button.tsx**

```tsx
import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "gold" | "ghost" | "white";

const variantClasses: Record<Variant, string> = {
  gold: "bg-gold text-forest-deep hover:bg-gold-light",
  ghost: "bg-transparent border border-white/20 text-white/70 hover:border-gold hover:text-gold",
  white: "bg-white text-forest hover:bg-forest hover:text-white",
};

const baseClasses =
  "inline-block font-sans text-[10px] font-bold tracking-[2.5px] uppercase no-underline px-8 py-3.5 transition-all duration-200";

export function Button({
  variant,
  href,
  children,
  className = "",
}: {
  variant: Variant;
  href?: string;
  children: ReactNode;
  className?: string;
}) {
  const cls = `${baseClasses} ${variantClasses[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return <button className={cls}>{children}</button>;
}
```

- [ ] **Step 4: Run test, verify pass**

Run: `npm test -- --run button.test`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add tests/components/button.test.tsx components/ui/button.tsx
git commit -m "feat: add Button UI primitive with gold/ghost/white variants"
```

---

## Task 8: Build Eyebrow + SectionHead UI Primitives

**Files:**
- Create: `components/ui/eyebrow.tsx`
- Create: `components/ui/section-head.tsx`
- Create: `tests/components/section-head.test.tsx`

- [ ] **Step 1: Create components/ui/eyebrow.tsx**

```tsx
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
```

- [ ] **Step 2: Write failing test for SectionHead**

Path: `tests/components/section-head.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionHead } from "@/components/ui/section-head";

describe("SectionHead", () => {
  it("renders eyebrow + title", () => {
    render(<SectionHead eyebrow="What We Do" title="Our Practice Areas" />);
    expect(screen.getByText("What We Do")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Our Practice Areas" })).toBeInTheDocument();
  });

  it("renders view-all link when provided", () => {
    render(<SectionHead eyebrow="People" title="Team" viewAllHref="/team" viewAllLabel="View All Partners" />);
    expect(screen.getByRole("link", { name: /view all partners/i })).toHaveAttribute("href", "/team");
  });
});
```

- [ ] **Step 3: Create components/ui/section-head.tsx**

```tsx
import Link from "next/link";
import { Eyebrow } from "./eyebrow";

export function SectionHead({
  eyebrow,
  title,
  viewAllHref,
  viewAllLabel,
}: {
  eyebrow: string;
  title: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}) {
  return (
    <div className="flex justify-between items-end mb-12">
      <div>
        <Eyebrow className="mb-2.5">{eyebrow}</Eyebrow>
        <h2 className="font-serif text-4xl font-normal text-forest">{title}</h2>
      </div>
      {viewAllHref && viewAllLabel && (
        <Link
          href={viewAllHref}
          className="font-sans text-[10px] font-semibold tracking-[2px] uppercase text-forest border-b border-gold pb-0.5 hover:text-gold transition-colors"
        >
          {viewAllLabel}
        </Link>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run test, verify pass**

Run: `npm test -- --run section-head.test`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add components/ui/eyebrow.tsx components/ui/section-head.tsx tests/components/section-head.test.tsx
git commit -m "feat: add Eyebrow and SectionHead UI primitives"
```

---

## Task 9: Build Navigation Component

**Files:**
- Create: `tests/components/nav.test.tsx`
- Create: `components/layout/nav.tsx`
- Copy: `public/logo/jin-logo.png` from `assets/logo/jin-logo-crop.png`

- [ ] **Step 1: Copy logo to public/**

```bash
mkdir -p public/logo
cp assets/logo/jin-logo-crop.png public/logo/jin-logo.png
```

- [ ] **Step 2: Write failing test**

Path: `tests/components/nav.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Nav } from "@/components/layout/nav";

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

- [ ] **Step 3: Run test, verify fail**

Run: `npm test -- --run nav.test`
Expected: FAIL — `Nav` cannot be imported.

- [ ] **Step 4: Create components/layout/nav.tsx**

```tsx
import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS } from "@/lib/constants";

export function Nav() {
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
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="relative font-sans text-[11px] font-medium tracking-[2px] uppercase text-white/55 hover:text-white/90 transition-colors"
          >
            {link.label}
          </Link>
        ))}
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

- [ ] **Step 5: Run test, verify pass**

Run: `npm test -- --run nav.test`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add public/logo/ tests/components/nav.test.tsx components/layout/nav.tsx
git commit -m "feat: add fixed navigation with logo and links"
```

---

## Task 10: Build Footer Component

**Files:**
- Create: `tests/components/footer.test.tsx`
- Create: `components/layout/footer.tsx`

- [ ] **Step 1: Write failing test**

Path: `tests/components/footer.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/layout/footer";

describe("Footer", () => {
  it("renders firm legal name", () => {
    render(<Footer />);
    expect(screen.getByText(/PT Juris International Network/i)).toBeInTheDocument();
  });

  it("renders four column headings", () => {
    render(<Footer />);
    expect(screen.getByText(/practice areas/i)).toBeInTheDocument();
    expect(screen.getByText(/company/i)).toBeInTheDocument();
    expect(screen.getByText(/contact/i)).toBeInTheDocument();
  });

  it("renders copyright with current year", () => {
    render(<Footer />);
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()}`))).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test, verify fail**

Run: `npm test -- --run footer.test`
Expected: FAIL — Footer cannot be imported.

- [ ] **Step 3: Create components/layout/footer.tsx**

```tsx
import Link from "next/link";
import Image from "next/image";

const PRACTICE_LINKS = [
  { label: "Business & Corporate", slug: "business-corporate-law" },
  { label: "Litigation", slug: "litigation-dispute-resolution" },
  { label: "Employment Law", slug: "employment-law" },
  { label: "Intellectual Property", slug: "intellectual-property" },
  { label: "Banking & FinTech", slug: "banking-finance-fintech" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Our Team", href: "/team" },
  { label: "Insights", href: "/insights" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-forest-deep px-[72px] pt-[72px] pb-7 border-t border-gold/20">
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-14 mb-14">
        <div>
          <Image
            src="/logo/jin-logo.png"
            alt="JIN Legal"
            width={74}
            height={24}
            className="h-6 w-auto brightness-0 invert"
          />
          <p className="font-sans text-xs font-light text-white/35 leading-[1.75] mt-4 max-w-[220px]">
            Strategic legal counsel for the modern world — delivered with precision, integrity, and results.
          </p>
          <div className="text-[10px] text-gold/55 mt-3.5 tracking-wide">
            PT Juris International Network
          </div>
        </div>
        <div>
          <h4 className="font-sans text-[9px] tracking-[3.5px] font-bold uppercase text-gold mb-5">
            Practice Areas
          </h4>
          <ul className="list-none p-0 m-0">
            {PRACTICE_LINKS.map((link) => (
              <li key={link.slug} className="mb-2.5">
                <Link
                  href={`/practice-areas/${link.slug}`}
                  className="font-sans text-xs font-light text-white/40 hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mb-2.5">
              <Link href="/practice-areas" className="font-sans text-xs font-light text-white/40 hover:text-gold transition-colors">
                View All →
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-sans text-[9px] tracking-[3.5px] font-bold uppercase text-gold mb-5">
            Company
          </h4>
          <ul className="list-none p-0 m-0">
            {COMPANY_LINKS.map((link) => (
              <li key={link.href} className="mb-2.5">
                <Link href={link.href} className="font-sans text-xs font-light text-white/40 hover:text-gold transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-sans text-[9px] tracking-[3.5px] font-bold uppercase text-gold mb-5">
            Contact
          </h4>
          <ul className="list-none p-0 m-0">
            <li className="mb-2.5"><span className="font-sans text-xs font-light text-white/40">Jakarta, Indonesia</span></li>
            <li className="mb-2.5"><a href="mailto:info@jinlegal.co.id" className="font-sans text-xs font-light text-white/40 hover:text-gold transition-colors">info@jinlegal.co.id</a></li>
            <li className="mb-2.5"><span className="font-sans text-xs font-light text-white/40">+62 21 XXX XXXX</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 pt-5 flex justify-between items-center">
        <p className="font-sans text-[11px] text-white/20">
          © {year} <span className="text-gold">PT Juris International Network</span>. All rights reserved.
        </p>
        <p className="font-sans text-[11px] text-white/20">Privacy Policy · Terms of Use</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Run test, verify pass**

Run: `npm test -- --run footer.test`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add tests/components/footer.test.tsx components/layout/footer.tsx
git commit -m "feat: add footer with brand, links, and contact info"
```

---

## Task 11: Build Hero Section

**Files:**
- Create: `tests/components/hero.test.tsx`
- Create: `components/homepage/hero.tsx`

- [ ] **Step 1: Write failing test**

Path: `tests/components/hero.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/homepage/hero";

describe("Hero", () => {
  it("renders the tagline", () => {
    render(<Hero />);
    expect(screen.getByText(/Legal Excellence/i)).toBeInTheDocument();
    expect(screen.getByText(/Strategic Results/i)).toBeInTheDocument();
  });

  it("renders eyebrow with firm legal name", () => {
    render(<Hero />);
    expect(screen.getByText(/PT Juris International Network/i)).toBeInTheDocument();
  });

  it("renders both CTAs", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /consult with us/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /explore practice areas/i })).toBeInTheDocument();
  });

  it("renders practice areas stat badge", () => {
    render(<Hero />);
    expect(screen.getByText("11")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test, verify fail**

Run: `npm test -- --run hero.test`
Expected: FAIL — Hero cannot be imported.

- [ ] **Step 3: Create components/homepage/hero.tsx**

```tsx
import Link from "next/link";
import { Eyebrow } from "@/components/ui/eyebrow";

export function Hero() {
  return (
    <section className="min-h-screen bg-forest-deep relative overflow-hidden flex items-center px-[72px]">
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1800&q=70&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_70%_50%,rgba(26,64,53,.5)_0%,transparent_60%)]" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,168,76,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,.05) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      />
      <div className="relative z-10 max-w-[740px]">
        <Eyebrow withLine className="mb-8">PT Juris International Network</Eyebrow>
        <h1 className="font-serif text-[clamp(48px,6.5vw,82px)] font-light text-white leading-[1.18] tracking-tight mb-7">
          Legal Excellence,
          <em className="block not-italic">
            <span
              className="italic font-normal bg-clip-text text-transparent pt-1.5 inline-block"
              style={{
                backgroundImage: "linear-gradient(135deg, #c9a84c 0%, #e2c97e 100%)",
              }}
            >
              Strategic Results.
            </span>
          </em>
        </h1>
        <p className="text-[15px] font-light text-white/50 leading-[1.8] max-w-[480px] mb-11 tracking-[0.3px]">
          A full-service legal consultancy serving corporations, institutions, and individuals across 11 practice areas throughout Indonesia and beyond.
        </p>
        <div className="flex gap-3.5 flex-wrap">
          <Link
            href="/contact"
            className="bg-gold text-forest-deep font-sans text-[10px] font-bold tracking-[2.5px] uppercase no-underline px-[34px] py-3.5 hover:bg-gold-light transition-colors"
          >
            Consult With Us
          </Link>
          <Link
            href="/practice-areas"
            className="bg-transparent border border-white/20 text-white/65 font-sans text-[10px] font-medium tracking-[2px] uppercase no-underline px-[34px] py-3.5 hover:border-gold hover:text-gold transition-colors"
          >
            Explore Practice Areas
          </Link>
        </div>
      </div>
      <div className="absolute right-[72px] bottom-[52px] z-10 border border-gold/20 px-7 py-5 text-right bg-forest-deep/60 backdrop-blur">
        <div className="font-serif text-[44px] font-light text-white leading-none">11</div>
        <div className="font-sans text-[9px] tracking-[3px] text-gold uppercase mt-1.5">Practice Areas</div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test, verify pass**

Run: `npm test -- --run hero.test`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add tests/components/hero.test.tsx components/homepage/hero.tsx
git commit -m "feat: add hero section with tagline, CTAs, and stat badge"
```

---

## Task 12: Build StatsBar Section

**Files:**
- Create: `components/homepage/stats-bar.tsx`
- Create: `tests/components/stats-bar.test.tsx`

- [ ] **Step 1: Write failing test**

Path: `tests/components/stats-bar.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatsBar } from "@/components/homepage/stats-bar";

describe("StatsBar", () => {
  it("renders all four stats", () => {
    render(<StatsBar />);
    expect(screen.getByText("Practice Areas")).toBeInTheDocument();
    expect(screen.getByText("Senior Partners")).toBeInTheDocument();
    expect(screen.getByText("Clients Served")).toBeInTheDocument();
    expect(screen.getByText("Years of Excellence")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test, verify fail**

Run: `npm test -- --run stats-bar.test`
Expected: FAIL.

- [ ] **Step 3: Create components/homepage/stats-bar.tsx**

```tsx
import { STATS } from "@/lib/constants";

export function StatsBar() {
  return (
    <div className="grid grid-cols-4 bg-ivory-dark border-b border-ivory-dark">
      {STATS.map((stat, i) => (
        <div
          key={stat.label}
          className={`px-12 py-9 transition-colors hover:bg-gold-pale ${
            i < STATS.length - 1 ? "border-r border-black/[0.07]" : ""
          }`}
        >
          <div className="font-serif text-[46px] font-light text-forest leading-none">
            {stat.num}
            {stat.suffix && <sup className="text-[22px] text-gold align-super">{stat.suffix}</sup>}
          </div>
          <div className="font-sans text-[9px] tracking-[2.5px] uppercase text-ink-muted mt-2 font-medium">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run test, verify pass**

Run: `npm test -- --run stats-bar.test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add tests/components/stats-bar.test.tsx components/homepage/stats-bar.tsx
git commit -m "feat: add stats bar with 4-column metrics"
```

---

## Task 13: Build AboutStrip Section

**Files:**
- Create: `components/homepage/about-strip.tsx`
- Create: `tests/components/about-strip.test.tsx`

- [ ] **Step 1: Write failing test**

Path: `tests/components/about-strip.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AboutStrip } from "@/components/homepage/about-strip";

describe("AboutStrip", () => {
  it("renders all four value cards", () => {
    render(<AboutStrip />);
    expect(screen.getByText("Integrity")).toBeInTheDocument();
    expect(screen.getByText("Precision")).toBeInTheDocument();
    expect(screen.getByText("Innovation")).toBeInTheDocument();
    expect(screen.getByText("Results")).toBeInTheDocument();
  });

  it("renders learn more link", () => {
    render(<AboutStrip />);
    expect(screen.getByRole("link", { name: /learn more about us/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test, verify fail**

Run: `npm test -- --run about-strip.test`
Expected: FAIL.

- [ ] **Step 3: Create components/homepage/about-strip.tsx**

```tsx
import Link from "next/link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { VALUES } from "@/lib/constants";

export function AboutStrip() {
  return (
    <section className="bg-forest px-[72px] py-24 grid grid-cols-2 gap-24 items-center relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-80 h-80 border border-gold/20 rounded-full pointer-events-none" />
      <div className="absolute top-5 right-5 w-44 h-44 border border-gold/10 rounded-full pointer-events-none" />

      <div>
        <Eyebrow className="mb-4">About the Firm</Eyebrow>
        <h2 className="font-serif text-[42px] font-light text-white leading-tight mb-7">
          A <strong className="font-semibold text-gold">Modern Legal Partner</strong> for a Complex World
        </h2>
        <p className="font-sans text-sm font-light text-white/50 leading-[1.9] mb-4 tracking-wide">
          Jin Legal — the practice of PT Juris International Network — was founded on the principle that exceptional legal counsel must be both strategically sharp and deeply human.
        </p>
        <p className="font-sans text-sm font-light text-white/50 leading-[1.9] mb-4 tracking-wide">
          We bring together six partners with deep expertise across corporate law, dispute resolution, emerging technologies, and specialized practice areas that define today&apos;s business landscape in Indonesia.
        </p>
        <Link
          href="/about"
          className="inline-flex items-center gap-2.5 font-sans text-[10px] font-semibold tracking-[2.5px] uppercase text-gold no-underline mt-3 hover:gap-[18px] transition-all"
        >
          Learn More About Us →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-[3px] relative">
        {VALUES.map((val) => (
          <div
            key={val.title}
            className="px-5 py-6 bg-white/[0.04] border-t-2 border-gold/25 hover:bg-gold/[0.06] hover:border-gold transition-all"
          >
            <h4 className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-gold mb-2">
              {val.title}
            </h4>
            <p className="font-sans text-xs text-white/40 leading-[1.65]">{val.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test, verify pass**

Run: `npm test -- --run about-strip.test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add tests/components/about-strip.test.tsx components/homepage/about-strip.tsx
git commit -m "feat: add about strip with firm description and value cards"
```

---

## Task 14: Build PracticeAreas Section

**Files:**
- Create: `components/homepage/practice-areas.tsx`
- Create: `tests/components/practice-areas.test.tsx`

- [ ] **Step 1: Write failing test**

Path: `tests/components/practice-areas.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PracticeAreas } from "@/components/homepage/practice-areas";

describe("PracticeAreas", () => {
  it("renders all 11 practice area titles", () => {
    render(<PracticeAreas />);
    expect(screen.getByText("Business & Corporate Law")).toBeInTheDocument();
    expect(screen.getByText("Banking, Finance & FinTech")).toBeInTheDocument();
    expect(screen.getByText("Sport & Entertainment")).toBeInTheDocument();
    expect(screen.getByText("Intellectual Property")).toBeInTheDocument();
  });

  it("renders view-all CTA card", () => {
    render(<PracticeAreas />);
    expect(screen.getByText(/all practice areas/i)).toBeInTheDocument();
  });

  it("renders section heading", () => {
    render(<PracticeAreas />);
    expect(screen.getByRole("heading", { name: /our practice areas/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test, verify fail**

Run: `npm test -- --run practice-areas.test`
Expected: FAIL.

- [ ] **Step 3: Create components/homepage/practice-areas.tsx**

```tsx
import Link from "next/link";
import { SectionHead } from "@/components/ui/section-head";
import { PracticeIcon } from "@/components/icons/practice-icons";
import { PRACTICE_AREAS } from "@/lib/constants";

export function PracticeAreas() {
  return (
    <section className="bg-ivory px-[72px] py-24">
      <SectionHead
        eyebrow="What We Do"
        title="Our Practice Areas"
        viewAllHref="/practice-areas"
        viewAllLabel="View All Areas"
      />
      <div className="grid grid-cols-4 gap-2.5">
        {PRACTICE_AREAS.map((area) => (
          <Link
            key={area.slug}
            href={`/practice-areas/${area.slug}`}
            className="bg-white border-t-2 border-gold px-4 py-5 relative overflow-hidden cursor-pointer transition-all hover:shadow-[0_12px_36px_rgba(26,64,53,.10)] hover:-translate-y-0.5 group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gold-pale to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <PracticeIcon name={area.icon} className="w-6 h-6 text-forest mb-3 relative z-10" />
            <div className="font-serif text-[11px] text-gold mb-1 relative z-10">{area.num}</div>
            <div className="font-sans text-[11px] font-semibold text-forest leading-snug relative z-10">
              {area.title}
            </div>
          </Link>
        ))}
        <Link
          href="/practice-areas"
          className="bg-forest min-h-[120px] flex flex-col items-center justify-center gap-2 hover:bg-forest-mid transition-colors"
        >
          <div className="text-lg text-gold">→</div>
          <div className="font-sans text-[9px] font-bold tracking-[2.5px] uppercase text-gold">
            All Practice Areas
          </div>
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test, verify pass**

Run: `npm test -- --run practice-areas.test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add tests/components/practice-areas.test.tsx components/homepage/practice-areas.tsx
git commit -m "feat: add practice areas section with 11 icon cards"
```

---

## Task 15: Build TeamPreview Section

**Files:**
- Create: `components/homepage/team-preview.tsx`
- Create: `tests/components/team-preview.test.tsx`

- [ ] **Step 1: Write failing test**

Path: `tests/components/team-preview.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TeamPreview } from "@/components/homepage/team-preview";

describe("TeamPreview", () => {
  it("renders three featured partners", () => {
    render(<TeamPreview />);
    expect(screen.getByText("Muhammad Subuh Rezki")).toBeInTheDocument();
    expect(screen.getByText("Ryan Tampubolon")).toBeInTheDocument();
    expect(screen.getByText("Abi Rafdi")).toBeInTheDocument();
  });

  it("renders view-all CTA link to /team", () => {
    render(<TeamPreview />);
    const link = screen.getByRole("link", { name: /view all partners/i });
    expect(link).toHaveAttribute("href", "/team");
  });
});
```

- [ ] **Step 2: Run test, verify fail**

Run: `npm test -- --run team-preview.test`
Expected: FAIL.

- [ ] **Step 3: Create components/homepage/team-preview.tsx**

```tsx
import Link from "next/link";
import Image from "next/image";
import { Eyebrow } from "@/components/ui/eyebrow";

const FEATURED = [
  {
    name: "Muhammad Subuh Rezki",
    credentials: "S.H.",
    role: "Managing Partner",
    photo: "https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?w=600&h=720&fit=crop&q=80",
  },
  {
    name: "Ryan Tampubolon",
    credentials: "S.H.",
    role: "Partner",
    photo: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=600&h=720&fit=crop&q=80",
  },
  {
    name: "Abi Rafdi",
    credentials: "S.H.",
    role: "Partner",
    photo: "https://images.unsplash.com/photo-1629425733761-caae3b5f2e50?w=600&h=720&fit=crop&q=80",
  },
] as const;

export function TeamPreview() {
  return (
    <section className="bg-forest-deep px-[72px] py-24">
      <Eyebrow className="mb-2.5">Our People</Eyebrow>
      <h2 className="font-serif text-[40px] font-light text-white mb-12">
        Meet the <em className="italic text-gold">Partners</em>
      </h2>
      <div className="grid grid-cols-3 gap-[3px] mb-8">
        {FEATURED.map((partner) => (
          <div key={partner.name} className="relative overflow-hidden group">
            <Image
              src={partner.photo}
              alt={partner.name}
              width={600}
              height={720}
              className="w-full h-[360px] object-cover object-top transition-all duration-[550ms] grayscale-[30%] brightness-[.85] saturate-[.9] group-hover:grayscale-0 group-hover:brightness-100 group-hover:saturate-100 group-hover:scale-[1.04]"
            />
            <div className="absolute bottom-0 left-0 right-0 px-5 pt-14 pb-5 [background:linear-gradient(0deg,rgba(10,24,18,.97)_0%,transparent_100%)] translate-y-5 group-hover:translate-y-0 transition-transform duration-400">
              <div className="font-sans text-[9px] tracking-[3px] text-gold font-bold uppercase mb-1">
                {partner.role}
              </div>
              <div className="font-serif text-xl text-white font-medium mb-0.5">{partner.name}</div>
              <div className="font-sans text-[10px] text-white/35">{partner.credentials}</div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-[450ms]" />
          </div>
        ))}
      </div>
      <div className="text-center">
        <Link
          href="/team"
          className="inline-flex items-center gap-2.5 font-sans text-[10px] font-semibold tracking-[2px] uppercase text-gold border border-gold/30 px-8 py-3.5 no-underline hover:bg-gold hover:text-forest-deep transition-all"
        >
          View All Partners →
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Configure next.config.mjs for Unsplash images**

Open `next.config.mjs` and replace with:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 5: Run test, verify pass**

Run: `npm test -- --run team-preview.test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add tests/components/team-preview.test.tsx components/homepage/team-preview.tsx next.config.mjs
git commit -m "feat: add team preview with 3 cinematic partner cards"
```

---

## Task 16: Build Insights Section

**Files:**
- Create: `components/homepage/insights.tsx`
- Create: `tests/components/insights.test.tsx`

- [ ] **Step 1: Write failing test**

Path: `tests/components/insights.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Insights } from "@/components/homepage/insights";

describe("Insights", () => {
  it("renders section heading", () => {
    render(<Insights />);
    expect(screen.getByRole("heading", { name: /legal perspectives/i })).toBeInTheDocument();
  });

  it("renders all 3 sample articles", () => {
    render(<Insights />);
    expect(screen.getByText(/Indonesia's New Company Law/i)).toBeInTheDocument();
    expect(screen.getByText(/FinTech Licensing/i)).toBeInTheDocument();
    expect(screen.getByText(/Omnibus Law/i)).toBeInTheDocument();
  });

  it("renders all-articles link", () => {
    render(<Insights />);
    expect(screen.getByRole("link", { name: /all articles/i })).toHaveAttribute("href", "/insights");
  });
});
```

- [ ] **Step 2: Run test, verify fail**

Run: `npm test -- --run insights.test`
Expected: FAIL.

- [ ] **Step 3: Create components/homepage/insights.tsx**

```tsx
import Image from "next/image";
import Link from "next/link";
import { SectionHead } from "@/components/ui/section-head";

const SAMPLE_POSTS = [
  {
    title: "Understanding Indonesia's New Company Law: Key Changes for Foreign Investors",
    category: "Corporate Law",
    date: "May 8, 2025 · 6 min read",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=900&h=506&fit=crop&q=80",
    featured: true,
  },
  {
    title: "OJK's New FinTech Licensing Framework Explained",
    category: "FinTech",
    date: "Apr 24, 2025",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=500&h=280&fit=crop&q=80",
  },
  {
    title: "What Employers Must Know About Indonesia's Omnibus Law Updates",
    category: "Employment",
    date: "Apr 10, 2025",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=500&h=280&fit=crop&q=80",
  },
];

export function Insights() {
  return (
    <section className="bg-white px-[72px] py-24">
      <SectionHead
        eyebrow="Latest Insights"
        title="Legal Perspectives"
        viewAllHref="/insights"
        viewAllLabel="All Articles"
      />
      <div className="grid grid-cols-[2fr_1fr_1fr] gap-6">
        {SAMPLE_POSTS.map((post) => (
          <article key={post.title} className="cursor-pointer group">
            <div className="overflow-hidden mb-[18px]">
              <Image
                src={post.image}
                alt={post.title}
                width={900}
                height={506}
                className="w-full aspect-video object-cover brightness-95 saturate-95 transition-all duration-500 group-hover:scale-[1.04] group-hover:brightness-100 group-hover:saturate-100"
              />
            </div>
            <div className="font-sans text-[9px] tracking-[3px] text-gold font-bold uppercase mb-2">
              {post.category}
            </div>
            <h3
              className={`font-serif font-medium text-forest leading-[1.35] mb-2.5 ${
                post.featured ? "text-[26px]" : "text-xl"
              }`}
            >
              {post.title}
            </h3>
            <div className="font-sans text-[10px] text-ink-faint tracking-wide">{post.date}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test, verify pass**

Run: `npm test -- --run insights.test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add tests/components/insights.test.tsx components/homepage/insights.tsx
git commit -m "feat: add insights section with featured + 2 article preview"
```

---

## Task 17: Build CtaBanner Section

**Files:**
- Create: `components/homepage/cta-banner.tsx`
- Create: `tests/components/cta-banner.test.tsx`

- [ ] **Step 1: Write failing test**

Path: `tests/components/cta-banner.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CtaBanner } from "@/components/homepage/cta-banner";

describe("CtaBanner", () => {
  it("renders headline and contact link", () => {
    render(<CtaBanner />);
    expect(screen.getByText(/Ready to work/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /get in touch/i })).toHaveAttribute("href", "/contact");
  });
});
```

- [ ] **Step 2: Run test, verify fail**

Run: `npm test -- --run cta-banner.test`
Expected: FAIL.

- [ ] **Step 3: Create components/homepage/cta-banner.tsx**

```tsx
import Link from "next/link";

export function CtaBanner() {
  return (
    <div className="bg-gold px-[72px] py-[72px] flex items-center justify-between gap-10 relative overflow-hidden">
      <div className="absolute -right-14 -top-14 w-60 h-60 border border-white/15 rounded-full" />
      <div className="absolute right-10 top-10 w-32 h-32 border border-white/10 rounded-full" />
      <div className="relative z-10">
        <h2 className="font-serif text-[38px] font-normal text-white leading-[1.15]">
          Ready to work <em className="italic font-light">with us?</em>
        </h2>
        <p className="font-sans text-[13px] font-light text-white/75 mt-2">
          Schedule a consultation with one of our partners today.
        </p>
      </div>
      <Link
        href="/contact"
        className="bg-white text-forest font-sans text-[10px] font-bold tracking-[2.5px] uppercase no-underline px-9 py-4 whitespace-nowrap hover:bg-forest hover:text-white transition-all relative z-10"
      >
        Get in Touch
      </Link>
    </div>
  );
}
```

- [ ] **Step 4: Run test, verify pass**

Run: `npm test -- --run cta-banner.test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add tests/components/cta-banner.test.tsx components/homepage/cta-banner.tsx
git commit -m "feat: add CTA banner with gold background"
```

---

## Task 18: Compose Homepage Page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace app/page.tsx**

```tsx
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/homepage/hero";
import { StatsBar } from "@/components/homepage/stats-bar";
import { AboutStrip } from "@/components/homepage/about-strip";
import { PracticeAreas } from "@/components/homepage/practice-areas";
import { TeamPreview } from "@/components/homepage/team-preview";
import { Insights } from "@/components/homepage/insights";
import { CtaBanner } from "@/components/homepage/cta-banner";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <StatsBar />
        <AboutStrip />
        <PracticeAreas />
        <TeamPreview />
        <Insights />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Run dev server and visually verify**

Run: `npm run dev`
Open `http://localhost:3000` — verify:
- Nav at top with logo + 5 links + Consult CTA
- Hero with tagline, both CTAs, stat badge
- 4-column stats bar (ivory)
- About strip (forest) with 4 value cards
- 11-card practice area grid + CTA card
- 3 team partner cards (Unsplash photos)
- 3 insight articles
- Gold CTA banner
- Footer with 4 columns + copyright

Stop dev server.

- [ ] **Step 4: Run full test suite**

Run: `npm test -- --run`
Expected: All tests pass (no failures).

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "feat: compose homepage with all section components"
```

---

## Task 19: Add Playwright E2E Smoke Test

**Files:**
- Create: `tests/e2e/homepage.spec.ts`

- [ ] **Step 1: Create tests/e2e/homepage.spec.ts**

```typescript
import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads without console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    // Filter out third-party errors (Unsplash CDN warnings etc.)
    const ownErrors = errors.filter((e) => !e.includes("unsplash"));
    expect(ownErrors).toEqual([]);
  });

  test("hero renders tagline + CTAs", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Legal Excellence");
    await expect(page.getByRole("link", { name: /consult with us/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /explore practice areas/i })).toBeVisible();
  });

  test("scrolls to footer and verifies legal name", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByText("PT Juris International Network").first()).toBeVisible();
  });

  test("all 11 practice areas are rendered", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Business & Corporate Law")).toBeVisible();
    await expect(page.getByText("Banking, Finance & FinTech")).toBeVisible();
    await expect(page.getByText("Sport & Entertainment")).toBeVisible();
  });
});
```

- [ ] **Step 2: Run Playwright test**

Run: `npm run test:e2e`
Expected: All 4 tests pass.

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/homepage.spec.ts
git commit -m "test: add Playwright E2E smoke tests for homepage"
```

---

## Task 20: Deploy to Vercel

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: Create vercel.json**

```json
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "installCommand": "npm install",
  "outputDirectory": ".next"
}
```

- [ ] **Step 2: Install Vercel CLI**

```bash
npm install -g vercel
```

- [ ] **Step 3: Deploy to Vercel**

Run interactively:

```bash
vercel
```

Answer prompts:
- Set up and deploy? **Y**
- Which scope? (user account)
- Link to existing project? **N**
- Project name? `jin-legal`
- Code directory? `./`
- Override settings? **N**

After preview deploy succeeds, add env vars (when Supabase is hooked up):

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

- [ ] **Step 4: Promote to production**

```bash
vercel --prod
```

Capture the production URL.

- [ ] **Step 5: Commit vercel.json**

```bash
git add vercel.json
git commit -m "chore: add Vercel deployment config"
git push origin main
```

---

## Task 21: Final Validation

**No code — verification only.**

- [ ] **Step 1: Full test suite passes**

```bash
npm run typecheck && npm test -- --run && npm run test:e2e
```

Expected: All checks pass.

- [ ] **Step 2: Visual smoke check on production**

Open Vercel production URL. Verify:
- Logo loads in nav and footer
- Hero animation and grain overlay visible
- All 11 practice areas render
- Team photos load from Unsplash
- Mobile view doesn't break layout (best-effort — full responsive is Phase 2)
- No console errors

- [ ] **Step 3: Lighthouse score**

In Chrome DevTools, run Lighthouse on production URL.
Expected: Performance > 80, Accessibility > 85, Best Practices > 90, SEO > 90.
Note any issues for Phase 2 polish.

- [ ] **Step 4: Final commit**

If no fixes needed, no commit required. Phase 1 complete.

---

## Self-Review Notes

**Spec coverage:**
- ✅ Tech stack (Next.js 14, TypeScript, Tailwind, Supabase) — Tasks 1, 2, 5
- ✅ Design tokens (forest/gold/ivory) — Task 2
- ✅ Typography (Cormorant + Jost) — Task 3
- ✅ Logo handling (PNG + CSS filter) — Tasks 9, 10
- ✅ Navigation — Task 9
- ✅ Footer — Task 10
- ✅ Homepage sections 1–8 — Tasks 11–17
- ✅ Supabase schema (5 tables) — Task 5
- ✅ Vercel deployment — Task 20
- ⏸️ Other pages (About, Team, Practice Areas detail, Insights, Careers, Contact) — Phase 2 plan
- ⏸️ Admin dashboard with auth — Phase 3 plan
- ⏸️ Contact form submission — Phase 2 plan
- ⏸️ Multi-language — Out of scope (spec section 10)

**Out-of-scope this phase (documented for Phase 2/3):**
- Practice area detail subpages
- Team page with all 6 partners + filter tabs
- Insights blog listing + detail pages
- Contact form submission to Supabase
- Admin dashboard with auth + CRUD
- WhatsApp button
- Responsive mobile polish (best-effort only)

**Phase 1 deliverable:** Working, deployed homepage at a Vercel URL — visually polished, type-safe, tested, ready to be shown to stakeholders. Subsequent pages will be plugged in during Phase 2 using the same component patterns and design tokens established here.
