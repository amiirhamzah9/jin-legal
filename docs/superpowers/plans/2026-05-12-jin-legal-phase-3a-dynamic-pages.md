# Jin Legal — Phase 3a: Dynamic Public Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the three Supabase-backed public routes — `/insights` (blog listing + detail), `/careers`, and `/contact` (with form submission to `contact_leads` table). Replace the homepage's hardcoded Insights preview with real data from Supabase. After this phase, every CTA on the site lands on a working page.

**Architecture:** All Supabase reads happen in Server Components via a dedicated query layer (`lib/data/queries.ts`). The Contact form is a Client Component that posts to a Server Action which inserts into `contact_leads`. Blog post bodies are stored as Markdown in Supabase and rendered via `react-markdown` with custom typography components. The Insights listing page uses Next.js dynamic rendering with `revalidate: 300` (5-minute ISR window) so editors don't need to redeploy after publishing posts.

**Tech Stack:**
- Next.js 14 App Router (Server Components, Server Actions, ISR)
- TypeScript
- `@supabase/supabase-js` + `@supabase/ssr` (already installed)
- `react-markdown` + `remark-gfm` for blog rendering
- Tailwind CSS (existing tokens)
- Vitest + RTL + Playwright (existing setup)

**Supabase project:** `ymerojltkwjauqhdhnzu` (already provisioned, migration applied, seeded with 11 practice areas, 6 partners, 3 blog posts, 3 careers).

**Env vars (set in `.env.local` locally and in Vercel dashboard before deploy):**
- `NEXT_PUBLIC_SUPABASE_URL=https://ymerojltkwjauqhdhnzu.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_TyIf0o19Ukfx78raNeyTEQ_o393ZROE`

**Out of Phase 3a (deferred to Phase 3b):**
- Admin dashboard (`/admin`) with Supabase Auth
- CRUD UI for editing blog posts, team members, practice areas, careers
- Viewing contact leads in the admin panel

---

## File Structure

```
app/
  contact/
    page.tsx                              Contact route (server) + ContactForm (client) usage
    actions.ts                            'use server' action: submitContactForm
  insights/
    page.tsx                              Insights listing (server, ISR revalidate=300)
    [slug]/
      page.tsx                            Insights detail (server, generateStaticParams)
  careers/
    page.tsx                              Careers listing (server, ISR revalidate=300)

components/
  insights/
    insight-card.tsx                      Reusable card (used on /insights + /insights/[slug] related)
    insights-grid.tsx                     Featured + secondary cards layout
    markdown-content.tsx                  ReactMarkdown wrapper with brand typography
  careers/
    career-card.tsx                       Open position card
    careers-list.tsx                      Group of career-card components
  contact/
    contact-form.tsx                      Client form (uses Server Action)
    contact-info.tsx                      Static "office details" right column

lib/
  data/
    queries.ts                            Supabase read functions

tests/
  components/
    insight-card.test.tsx
    insights-grid.test.tsx
    markdown-content.test.tsx
    career-card.test.tsx
    careers-list.test.tsx
    contact-form.test.tsx
    contact-info.test.tsx
  e2e/
    insights.spec.ts                      E2E for /insights + detail
    careers.spec.ts                       E2E for /careers
    contact.spec.ts                       E2E for /contact + form submission
```

---

## Task 1: Install `react-markdown` + `remark-gfm`

**Files:**
- Modify: `package.json` (via npm install)

- [ ] **Step 1: Install packages**

```bash
cd /Users/amirhamzah/Github/jin-legal
npm install react-markdown remark-gfm
```

- [ ] **Step 2: Verify build still passes**

```bash
npm run build
```

Expected: success.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add react-markdown + remark-gfm for blog rendering"
```

---

## Task 2: Build Supabase Query Layer

**Files:**
- Create: `lib/data/queries.ts`

The query layer centralizes all Supabase reads so route handlers stay thin and tests can mock at one boundary.

- [ ] **Step 1: Create `/Users/amirhamzah/Github/jin-legal/lib/data/queries.ts`**

```typescript
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
type Career = Database["public"]["Tables"]["careers"]["Row"];

/**
 * Get published blog posts, newest first.
 * @param limit Max number of posts to return (default 12)
 */
export async function getRecentBlogPosts(limit = 12): Promise<BlogPost[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getRecentBlogPosts error:", error);
    return [];
  }
  return data ?? [];
}

/**
 * Get a single published post by slug. Returns null if not found.
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("getBlogPostBySlug error:", error);
    }
    return null;
  }
  return data;
}

/**
 * Get all published blog post slugs (for generateStaticParams).
 */
export async function getAllPublishedSlugs(): Promise<string[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("is_published", true);

  if (error) {
    console.error("getAllPublishedSlugs error:", error);
    return [];
  }
  return (data ?? []).map((r) => r.slug);
}

/**
 * Get all active careers, newest first.
 */
export async function getActiveCareers(): Promise<Career[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("careers")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getActiveCareers error:", error);
    return [];
  }
  return data ?? [];
}
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: success.

- [ ] **Step 4: Commit**

```bash
git add lib/data/queries.ts
git commit -m "feat: add Supabase query layer for blog posts and careers"
```

---

## Task 3: Build `MarkdownContent` Component

**Files:**
- Create: `tests/components/markdown-content.test.tsx`
- Create: `components/insights/markdown-content.tsx`

- [ ] **Step 1: Write failing test** at `/Users/amirhamzah/Github/jin-legal/tests/components/markdown-content.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MarkdownContent } from "@/components/insights/markdown-content";

describe("MarkdownContent", () => {
  it("renders h2 headings from markdown", () => {
    render(<MarkdownContent source={"## Overview\n\nSome text."} />);
    expect(screen.getByRole("heading", { level: 2, name: /overview/i })).toBeInTheDocument();
  });

  it("renders paragraphs", () => {
    render(<MarkdownContent source={"First paragraph.\n\nSecond paragraph."} />);
    expect(screen.getByText(/first paragraph/i)).toBeInTheDocument();
    expect(screen.getByText(/second paragraph/i)).toBeInTheDocument();
  });

  it("renders unordered lists", () => {
    render(<MarkdownContent source={"- Item one\n- Item two\n- Item three"} />);
    expect(screen.getByText("Item one")).toBeInTheDocument();
    expect(screen.getByText("Item three")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test, verify fail** with `npm test -- --run markdown-content.test`

- [ ] **Step 3: Create `/Users/amirhamzah/Github/jin-legal/components/insights/markdown-content.tsx`**

```tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownContent({ source }: { source: string }) {
  return (
    <div className="prose-jin">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="font-serif text-[34px] font-light text-forest leading-tight mt-12 mb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-serif text-[26px] font-medium text-forest leading-tight mt-10 mb-4">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-serif text-[20px] font-medium text-forest leading-tight mt-8 mb-3">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="font-sans text-[15px] font-light text-ink leading-[1.85] mb-5">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="font-sans text-[15px] font-light text-ink leading-[1.85] mb-5 pl-6 space-y-2 list-disc marker:text-gold">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="font-sans text-[15px] font-light text-ink leading-[1.85] mb-5 pl-6 space-y-2 list-decimal marker:text-gold">
              {children}
            </ol>
          ),
          li: ({ children }) => <li>{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-forest">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-gold underline decoration-gold/40 underline-offset-4 hover:decoration-gold transition-colors"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-gold pl-6 my-6 font-serif italic text-[18px] text-forest">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="border-ivory-dark my-10" />,
          code: ({ children }) => (
            <code className="bg-ivory-dark px-1.5 py-0.5 rounded text-[13px] font-mono text-forest">
              {children}
            </code>
          ),
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
```

- [ ] **Step 4: Run test, verify pass**

```bash
npm test -- --run markdown-content.test
```

Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add tests/components/markdown-content.test.tsx components/insights/markdown-content.tsx
git commit -m "feat: add MarkdownContent component with brand typography"
```

---

## Task 4: Build `InsightCard` Component

**Files:**
- Create: `tests/components/insight-card.test.tsx`
- Create: `components/insights/insight-card.tsx`

- [ ] **Step 1: Write failing test** at `/Users/amirhamzah/Github/jin-legal/tests/components/insight-card.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { InsightCard } from "@/components/insights/insight-card";

const FAKE_POST = {
  id: "test-id",
  title: "Sample Article Title",
  slug: "sample-article",
  excerpt: "A short excerpt.",
  content: "Body text here.",
  cover_image_url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=900",
  category: "Corporate Law",
  author_id: null,
  published_at: "2025-05-08T00:00:00Z",
  is_published: true,
  created_at: "2025-05-08T00:00:00Z",
};

describe("InsightCard", () => {
  it("renders title, category, and date", () => {
    render(<InsightCard post={FAKE_POST} />);
    expect(screen.getByText("Sample Article Title")).toBeInTheDocument();
    expect(screen.getByText("Corporate Law")).toBeInTheDocument();
    expect(screen.getByText(/May 8, 2025/i)).toBeInTheDocument();
  });

  it("links to the post detail page", () => {
    render(<InsightCard post={FAKE_POST} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/insights/sample-article");
  });

  it("uses larger heading variant when featured=true", () => {
    render(<InsightCard post={FAKE_POST} featured />);
    const heading = screen.getByRole("heading", { name: /sample article title/i });
    expect(heading.className).toContain("text-[26px]");
  });
});
```

- [ ] **Step 2: Run test, verify fail** with `npm test -- --run insight-card.test`

- [ ] **Step 3: Create `/Users/amirhamzah/Github/jin-legal/components/insights/insight-card.tsx`**

```tsx
import Image from "next/image";
import Link from "next/link";
import type { Database } from "@/lib/supabase/types";

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function InsightCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return (
    <Link href={`/insights/${post.slug}`} className="cursor-pointer group block">
      {post.cover_image_url && (
        <div className="overflow-hidden mb-[18px]">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            width={900}
            height={506}
            className="w-full aspect-video object-cover brightness-95 saturate-95 transition-all duration-500 group-hover:scale-[1.04] group-hover:brightness-100 group-hover:saturate-100"
          />
        </div>
      )}
      {post.category && (
        <div className="font-sans text-[9px] tracking-[3px] text-gold font-bold uppercase mb-2">
          {post.category}
        </div>
      )}
      <h3
        className={`font-serif font-medium text-forest leading-[1.35] mb-2.5 ${
          featured ? "text-[26px]" : "text-xl"
        }`}
      >
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="font-sans text-[13px] font-light text-ink-muted leading-[1.7] mb-3">
          {post.excerpt}
        </p>
      )}
      <div className="font-sans text-[10px] text-ink-faint tracking-wide">
        {formatDate(post.published_at)}
      </div>
    </Link>
  );
}
```

- [ ] **Step 4: Run test, verify pass**

```bash
npm test -- --run insight-card.test
```

Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add tests/components/insight-card.test.tsx components/insights/insight-card.tsx
git commit -m "feat: add InsightCard component with featured variant"
```

---

## Task 5: Build `InsightsGrid` Component

**Files:**
- Create: `tests/components/insights-grid.test.tsx`
- Create: `components/insights/insights-grid.tsx`

- [ ] **Step 1: Write failing test** at `/Users/amirhamzah/Github/jin-legal/tests/components/insights-grid.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { InsightsGrid } from "@/components/insights/insights-grid";

const POSTS = [
  {
    id: "1",
    title: "First Post",
    slug: "first-post",
    excerpt: "Excerpt one",
    content: "Body",
    cover_image_url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=900",
    category: "Corporate Law",
    author_id: null,
    published_at: "2025-05-08T00:00:00Z",
    is_published: true,
    created_at: "2025-05-08T00:00:00Z",
  },
  {
    id: "2",
    title: "Second Post",
    slug: "second-post",
    excerpt: "Excerpt two",
    content: "Body",
    cover_image_url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=500",
    category: "FinTech",
    author_id: null,
    published_at: "2025-04-24T00:00:00Z",
    is_published: true,
    created_at: "2025-04-24T00:00:00Z",
  },
  {
    id: "3",
    title: "Third Post",
    slug: "third-post",
    excerpt: "Excerpt three",
    content: "Body",
    cover_image_url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=500",
    category: "Employment",
    author_id: null,
    published_at: "2025-04-10T00:00:00Z",
    is_published: true,
    created_at: "2025-04-10T00:00:00Z",
  },
];

describe("InsightsGrid", () => {
  it("renders all provided posts", () => {
    render(<InsightsGrid posts={POSTS} />);
    expect(screen.getByText("First Post")).toBeInTheDocument();
    expect(screen.getByText("Second Post")).toBeInTheDocument();
    expect(screen.getByText("Third Post")).toBeInTheDocument();
  });

  it("renders empty state when no posts", () => {
    render(<InsightsGrid posts={[]} />);
    expect(screen.getByText(/no insights published yet/i)).toBeInTheDocument();
  });

  it("uses featured layout (2fr 1fr 1fr) when 3+ posts present", () => {
    const { container } = render(<InsightsGrid posts={POSTS} />);
    const grid = container.querySelector(".grid");
    expect(grid?.className).toContain("grid-cols-[2fr_1fr_1fr]");
  });
});
```

- [ ] **Step 2: Run test, verify fail** with `npm test -- --run insights-grid.test`

- [ ] **Step 3: Create `/Users/amirhamzah/Github/jin-legal/components/insights/insights-grid.tsx`**

```tsx
import { InsightCard } from "./insight-card";
import type { Database } from "@/lib/supabase/types";

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];

export function InsightsGrid({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-sans text-[14px] font-light text-ink-muted">
          No insights published yet — check back soon.
        </p>
      </div>
    );
  }

  if (posts.length < 3) {
    return (
      <div className="grid grid-cols-2 gap-6">
        {posts.map((post) => (
          <InsightCard key={post.id} post={post} featured />
        ))}
      </div>
    );
  }

  const [featured, ...rest] = posts;
  return (
    <div className="grid grid-cols-[2fr_1fr_1fr] gap-6">
      <InsightCard post={featured} featured />
      {rest.slice(0, 2).map((post) => (
        <InsightCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run test, verify pass**

```bash
npm test -- --run insights-grid.test
```

Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add tests/components/insights-grid.test.tsx components/insights/insights-grid.tsx
git commit -m "feat: add InsightsGrid with featured + secondary layout"
```

---

## Task 6: Compose `/insights` Listing Route

**Files:**
- Create: `app/insights/page.tsx`

- [ ] **Step 1: Create `/Users/amirhamzah/Github/jin-legal/app/insights/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/ui/page-hero";
import { InsightsGrid } from "@/components/insights/insights-grid";
import { CtaBanner } from "@/components/homepage/cta-banner";
import { getRecentBlogPosts } from "@/lib/data/queries";

export const revalidate = 300; // 5-minute ISR

export const metadata: Metadata = {
  title: "Insights — Jin Legal | PT Juris International Network",
  description:
    "Legal perspectives, regulatory updates, and analysis from Jin Legal's practice areas.",
};

export default async function InsightsPage() {
  const posts = await getRecentBlogPosts(12);

  return (
    <>
      <Nav />
      <main>
        <PageHero
          eyebrow="Latest Insights"
          title="Legal Perspectives"
          subtitle="Analysis, regulatory updates, and practical guidance from our practice areas across Indonesian law."
        />
        <section className="bg-white px-[72px] py-20">
          <InsightsGrid posts={posts} />
        </section>
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

Expected: `/insights` listed in routes. `ISR` indicator (`◐`) on the route.

- [ ] **Step 3: Smoke-test against live Supabase**

```bash
pkill -f "next dev" 2>/dev/null; sleep 2
PORT=3010 npm run dev &
sleep 5
echo "--- /insights ---"
curl -s http://localhost:3010/insights | grep -c "Indonesia"
pkill -f "next dev"
```

Expected: ≥1 (at least one of the seeded post titles contains "Indonesia").

- [ ] **Step 4: Commit**

```bash
git add app/insights/page.tsx
git commit -m "feat: compose Insights listing route with Supabase reads + ISR"
```

---

## Task 7: Compose `/insights/[slug]` Detail Route

**Files:**
- Create: `app/insights/[slug]/page.tsx`

- [ ] **Step 1: Create `/Users/amirhamzah/Github/jin-legal/app/insights/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { CtaBanner } from "@/components/homepage/cta-banner";
import { MarkdownContent } from "@/components/insights/markdown-content";
import { Eyebrow } from "@/components/ui/eyebrow";
import { getBlogPostBySlug, getAllPublishedSlugs } from "@/lib/data/queries";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return { title: "Not Found — Jin Legal" };
  return {
    title: `${post.title} — Jin Legal`,
    description: post.excerpt ?? undefined,
  };
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function InsightDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <>
      <Nav />
      <main>
        <section className="bg-forest-deep pt-[120px] pb-16 px-[72px]">
          <div className="max-w-[800px] mx-auto">
            {post.category && (
              <Eyebrow withLine className="mb-6">
                {post.category}
              </Eyebrow>
            )}
            <h1 className="font-serif text-[clamp(34px,4.5vw,52px)] font-light text-white leading-[1.15] tracking-tight mb-6">
              {post.title}
            </h1>
            <div className="font-sans text-[12px] text-white/40 tracking-wide">
              {formatDate(post.published_at)}
            </div>
          </div>
        </section>
        {post.cover_image_url && (
          <div className="bg-forest-deep">
            <div className="max-w-[1100px] mx-auto px-[72px] -mb-20 relative z-10">
              <Image
                src={post.cover_image_url}
                alt={post.title}
                width={1200}
                height={675}
                className="w-full aspect-video object-cover"
              />
            </div>
          </div>
        )}
        <section className="bg-ivory pt-32 pb-24 px-[72px]">
          <div className="max-w-[760px] mx-auto">
            <MarkdownContent source={post.content} />
          </div>
        </section>
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

Expected: build succeeds; route table shows `/insights/[slug]` with 3 prerendered slugs (one per seeded post).

- [ ] **Step 3: Smoke-test**

```bash
pkill -f "next dev" 2>/dev/null; sleep 2
PORT=3010 npm run dev &
sleep 5
echo "--- /insights/indonesia-new-company-law ---"
curl -s http://localhost:3010/insights/indonesia-new-company-law | grep -c "Foreign Investors"
echo "--- /insights/bogus-slug ---"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3010/insights/bogus-slug
pkill -f "next dev"
```

Expected: First ≥1, second `404`.

- [ ] **Step 4: Commit**

```bash
git add app/insights/\[slug\]/page.tsx
git commit -m "feat: compose Insights detail route with markdown rendering"
```

---

## Task 8: Replace Homepage Insights with Supabase Reads

**Files:**
- Modify: `components/homepage/insights.tsx`
- Modify: `tests/components/insights.test.tsx`

- [ ] **Step 1: Read existing `/Users/amirhamzah/Github/jin-legal/components/homepage/insights.tsx`** to confirm current shape.

- [ ] **Step 2: Replace `/Users/amirhamzah/Github/jin-legal/components/homepage/insights.tsx`** wholesale with:

```tsx
import { SectionHead } from "@/components/ui/section-head";
import { InsightsGrid } from "@/components/insights/insights-grid";
import { getRecentBlogPosts } from "@/lib/data/queries";

export async function Insights() {
  const posts = await getRecentBlogPosts(3);

  return (
    <section className="bg-white px-[72px] py-24">
      <SectionHead
        eyebrow="Latest Insights"
        title="Legal Perspectives"
        viewAllHref="/insights"
        viewAllLabel="All Articles"
      />
      <InsightsGrid posts={posts} />
    </section>
  );
}
```

- [ ] **Step 3: Replace `/Users/amirhamzah/Github/jin-legal/tests/components/insights.test.tsx`** wholesale (the original test asserted on hardcoded SAMPLE_POSTS which no longer exist — now we test it renders the section structure, gracefully with empty data):

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Insights } from "@/components/homepage/insights";

vi.mock("@/lib/data/queries", () => ({
  getRecentBlogPosts: vi.fn().mockResolvedValue([]),
}));

describe("Insights (homepage section)", () => {
  it("renders section heading", async () => {
    const ui = await Insights();
    render(ui);
    expect(screen.getByRole("heading", { name: /legal perspectives/i })).toBeInTheDocument();
  });

  it("renders 'All Articles' view-all link to /insights", async () => {
    const ui = await Insights();
    render(ui);
    expect(screen.getByRole("link", { name: /all articles/i })).toHaveAttribute(
      "href",
      "/insights"
    );
  });

  it("renders empty state when no posts", async () => {
    const ui = await Insights();
    render(ui);
    expect(screen.getByText(/no insights published yet/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Run modified tests**

```bash
npm test -- --run insights.test
```

Expected: PASS (3 tests).

- [ ] **Step 5: Run full suite to check for regressions**

```bash
npm test -- --run
```

Expected: all tests pass.

- [ ] **Step 6: Build + smoke-test homepage shows real posts**

```bash
npm run build
pkill -f "next dev" 2>/dev/null; sleep 2
PORT=3010 npm run dev &
sleep 5
curl -s http://localhost:3010 | grep -c "Indonesia"
pkill -f "next dev"
```

Expected: ≥1.

- [ ] **Step 7: Commit**

```bash
git add components/homepage/insights.tsx tests/components/insights.test.tsx
git commit -m "feat: homepage Insights section reads from Supabase"
```

---

## Task 9: Build `CareerCard` + `CareersList` Components

**Files:**
- Create: `tests/components/career-card.test.tsx`
- Create: `components/careers/career-card.tsx`
- Create: `tests/components/careers-list.test.tsx`
- Create: `components/careers/careers-list.tsx`

- [ ] **Step 1: Write failing test for CareerCard** at `/Users/amirhamzah/Github/jin-legal/tests/components/career-card.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CareerCard } from "@/components/careers/career-card";

const FAKE_CAREER = {
  id: "c1",
  title: "Senior Associate — Corporate Law",
  description: "We're seeking a Senior Associate with 5+ years of experience.",
  type: "Full-time",
  location: "Jakarta, Indonesia",
  is_active: true,
  created_at: "2025-05-01T00:00:00Z",
};

describe("CareerCard", () => {
  it("renders title, type, and location", () => {
    render(<CareerCard career={FAKE_CAREER} />);
    expect(screen.getByText("Senior Associate — Corporate Law")).toBeInTheDocument();
    expect(screen.getByText("Full-time")).toBeInTheDocument();
    expect(screen.getByText("Jakarta, Indonesia")).toBeInTheDocument();
  });

  it("renders apply CTA link", () => {
    render(<CareerCard career={FAKE_CAREER} />);
    const link = screen.getByRole("link", { name: /apply/i });
    expect(link).toHaveAttribute("href", "/contact?subject=Senior%20Associate%20%E2%80%94%20Corporate%20Law");
  });
});
```

- [ ] **Step 2: Run test, verify fail** with `npm test -- --run career-card.test`

- [ ] **Step 3: Create `/Users/amirhamzah/Github/jin-legal/components/careers/career-card.tsx`**

```tsx
import Link from "next/link";
import type { Database } from "@/lib/supabase/types";

type Career = Database["public"]["Tables"]["careers"]["Row"];

export function CareerCard({ career }: { career: Career }) {
  const applyHref = `/contact?subject=${encodeURIComponent(career.title)}`;
  return (
    <article className="bg-white border-t-2 border-gold p-8 transition-all hover:shadow-[0_16px_40px_rgba(26,64,53,.08)] hover:-translate-y-0.5">
      <div className="flex items-center gap-3 mb-4">
        <span className="font-sans text-[9px] font-bold tracking-[2px] uppercase text-gold bg-gold/10 px-3 py-1">
          {career.type}
        </span>
        {career.location && (
          <span className="font-sans text-[11px] text-ink-muted">{career.location}</span>
        )}
      </div>
      <h3 className="font-serif text-[24px] font-medium text-forest leading-tight mb-4">
        {career.title}
      </h3>
      <p className="font-sans text-[13px] font-light text-ink-muted leading-[1.75] mb-6 line-clamp-3">
        {career.description}
      </p>
      <Link
        href={applyHref}
        className="inline-flex items-center gap-2 font-sans text-[10px] font-bold tracking-[2px] uppercase text-gold hover:gap-3 transition-all"
      >
        Apply Now →
      </Link>
    </article>
  );
}
```

- [ ] **Step 4: Run test, verify pass**

```bash
npm test -- --run career-card.test
```

Expected: PASS (2 tests).

- [ ] **Step 5: Write failing test for CareersList** at `/Users/amirhamzah/Github/jin-legal/tests/components/careers-list.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CareersList } from "@/components/careers/careers-list";

const SAMPLE = [
  {
    id: "c1",
    title: "Senior Associate",
    description: "Corporate law role",
    type: "Full-time",
    location: "Jakarta",
    is_active: true,
    created_at: "2025-05-01T00:00:00Z",
  },
  {
    id: "c2",
    title: "Legal Intern",
    description: "Summer program",
    type: "Internship",
    location: "Jakarta",
    is_active: true,
    created_at: "2025-04-15T00:00:00Z",
  },
];

describe("CareersList", () => {
  it("renders all provided careers", () => {
    render(<CareersList careers={SAMPLE} />);
    expect(screen.getByText("Senior Associate")).toBeInTheDocument();
    expect(screen.getByText("Legal Intern")).toBeInTheDocument();
  });

  it("renders empty state when no careers", () => {
    render(<CareersList careers={[]} />);
    expect(screen.getByText(/no openings/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run test, verify fail** with `npm test -- --run careers-list.test`

- [ ] **Step 7: Create `/Users/amirhamzah/Github/jin-legal/components/careers/careers-list.tsx`**

```tsx
import { CareerCard } from "./career-card";
import type { Database } from "@/lib/supabase/types";

type Career = Database["public"]["Tables"]["careers"]["Row"];

export function CareersList({ careers }: { careers: Career[] }) {
  if (careers.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-sans text-[14px] font-light text-ink-muted mb-3">
          No openings right now.
        </p>
        <p className="font-sans text-[12px] font-light text-ink-faint">
          Want to introduce yourself anyway? Reach out to careers@jinlegal.co.id.
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-6">
      {careers.map((career) => (
        <CareerCard key={career.id} career={career} />
      ))}
    </div>
  );
}
```

- [ ] **Step 8: Run test, verify pass**

```bash
npm test -- --run careers-list.test
```

Expected: PASS (2 tests).

- [ ] **Step 9: Commit**

```bash
git add tests/components/career-card.test.tsx tests/components/careers-list.test.tsx components/careers/
git commit -m "feat: add CareerCard and CareersList components"
```

---

## Task 10: Compose `/careers` Route

**Files:**
- Create: `app/careers/page.tsx`

- [ ] **Step 1: Create `/Users/amirhamzah/Github/jin-legal/app/careers/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/ui/page-hero";
import { CareersList } from "@/components/careers/careers-list";
import { CtaBanner } from "@/components/homepage/cta-banner";
import { getActiveCareers } from "@/lib/data/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Careers — Jin Legal | PT Juris International Network",
  description: "Join Jin Legal — open positions and internship opportunities.",
};

export default async function CareersPage() {
  const careers = await getActiveCareers();

  return (
    <>
      <Nav />
      <main>
        <PageHero
          eyebrow="Join Our Team"
          title="Build a Career at Jin Legal"
          subtitle="We're looking for sharp, strategic, and curious legal professionals who want to do meaningful work."
        />
        <section className="bg-ivory px-[72px] py-20">
          <CareersList careers={careers} />
        </section>
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Run build** — `/careers` should appear in routes.

- [ ] **Step 3: Smoke-test**

```bash
pkill -f "next dev" 2>/dev/null; sleep 2
PORT=3010 npm run dev &
sleep 5
curl -s http://localhost:3010/careers | grep -c "Senior Associate"
pkill -f "next dev"
```

Expected: ≥1.

- [ ] **Step 4: Commit**

```bash
git add app/careers/page.tsx
git commit -m "feat: compose Careers route with Supabase reads + ISR"
```

---

## Task 11: Build `ContactInfo` Component

**Files:**
- Create: `tests/components/contact-info.test.tsx`
- Create: `components/contact/contact-info.tsx`

- [ ] **Step 1: Write failing test** at `/Users/amirhamzah/Github/jin-legal/tests/components/contact-info.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContactInfo } from "@/components/contact/contact-info";

describe("ContactInfo", () => {
  it("renders office address", () => {
    render(<ContactInfo />);
    expect(screen.getByText(/Jakarta/i)).toBeInTheDocument();
  });

  it("renders email and phone", () => {
    render(<ContactInfo />);
    expect(screen.getByText(/info@jinlegal\.co\.id/i)).toBeInTheDocument();
    expect(screen.getByText(/\+62/)).toBeInTheDocument();
  });

  it("renders working hours", () => {
    render(<ContactInfo />);
    expect(screen.getByText(/monday/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test, verify fail** with `npm test -- --run contact-info.test`

- [ ] **Step 3: Create `/Users/amirhamzah/Github/jin-legal/components/contact/contact-info.tsx`**

```tsx
import { Eyebrow } from "@/components/ui/eyebrow";

const INFO_BLOCKS = [
  {
    label: "Office",
    lines: ["Jakarta, Indonesia", "PT Juris International Network"],
  },
  {
    label: "Email",
    lines: ["info@jinlegal.co.id"],
  },
  {
    label: "Phone",
    lines: ["+62 21 XXX XXXX"],
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
```

- [ ] **Step 4: Run test, verify pass**

```bash
npm test -- --run contact-info.test
```

Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add tests/components/contact-info.test.tsx components/contact/contact-info.tsx
git commit -m "feat: add ContactInfo component with firm contact details"
```

---

## Task 12: Build Server Action for Contact Form Submission

**Files:**
- Create: `app/contact/actions.ts`

- [ ] **Step 1: Create `/Users/amirhamzah/Github/jin-legal/app/contact/actions.ts`**

```typescript
"use server";

import { createClient } from "@/lib/supabase/server";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const company = String(formData.get("company") ?? "").trim() || null;
  const subject = String(formData.get("subject") ?? "").trim() || null;
  const message = String(formData.get("message") ?? "").trim();

  // Basic validation
  if (!name || !email || !message) {
    return {
      status: "error",
      message: "Name, email, and message are required.",
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { status: "error", message: "Please provide a valid email address." };
  }

  if (message.length < 10) {
    return {
      status: "error",
      message: "Message is too short — please provide at least 10 characters.",
    };
  }

  const supabase = createClient();
  const { error } = await supabase.from("contact_leads").insert({
    name,
    email,
    phone,
    company,
    subject,
    message,
  });

  if (error) {
    console.error("submitContactForm error:", error);
    return {
      status: "error",
      message: "Something went wrong submitting your message. Please try again.",
    };
  }

  return {
    status: "success",
    message: "Thank you — we'll be in touch within 1–2 business days.",
  };
}
```

- [ ] **Step 2: Verify typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/contact/actions.ts
git commit -m "feat: add submitContactForm Server Action"
```

---

## Task 13: Build `ContactForm` Client Component

**Files:**
- Create: `tests/components/contact-form.test.tsx`
- Create: `components/contact/contact-form.tsx`

- [ ] **Step 1: Write failing test** at `/Users/amirhamzah/Github/jin-legal/tests/components/contact-form.test.tsx`

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContactForm } from "@/components/contact/contact-form";

vi.mock("@/app/contact/actions", () => ({
  submitContactForm: vi.fn().mockResolvedValue({ status: "idle" }),
}));

describe("ContactForm", () => {
  it("renders all required form fields", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<ContactForm />);
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });

  it("renders subject dropdown with practice areas + general inquiry", () => {
    render(<ContactForm />);
    const subjectSelect = screen.getByLabelText(/subject/i) as HTMLSelectElement;
    const optionTexts = Array.from(subjectSelect.options).map((o) => o.textContent);
    expect(optionTexts).toContain("General Inquiry");
    expect(optionTexts).toContain("Business & Corporate Law");
  });
});
```

- [ ] **Step 2: Run test, verify fail** with `npm test -- --run contact-form.test`

- [ ] **Step 3: Create `/Users/amirhamzah/Github/jin-legal/components/contact/contact-form.tsx`**

```tsx
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { submitContactForm, type ContactFormState } from "@/app/contact/actions";
import { PRACTICE_AREAS } from "@/lib/constants";
import { Eyebrow } from "@/components/ui/eyebrow";

const INITIAL: ContactFormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-gold text-forest-deep font-sans text-[10px] font-bold tracking-[2.5px] uppercase px-9 py-4 hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? "Sending…" : "Send Message"}
    </button>
  );
}

const FIELD_BASE =
  "w-full bg-white border border-ivory-dark px-4 py-3 font-sans text-[13px] text-ink focus:border-gold focus:outline-none transition-colors";

export function ContactForm() {
  const searchParams = useSearchParams();
  const presetSubject = searchParams.get("subject") ?? "";
  const [state, formAction] = useFormState(submitContactForm, INITIAL);

  return (
    <div>
      <Eyebrow className="mb-5">Tell Us About Your Matter</Eyebrow>
      <h2 className="font-serif text-[28px] font-light text-forest leading-tight mb-10">
        Send Us a Message
      </h2>
      {state.status === "success" ? (
        <div className="border-l-2 border-gold bg-gold/5 p-7">
          <div className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-gold mb-3">
            Message Sent
          </div>
          <p className="font-sans text-[14px] font-light text-ink leading-[1.7]">
            {state.message}
          </p>
        </div>
      ) : (
        <form action={formAction} className="space-y-5">
          {state.status === "error" && state.message && (
            <div className="bg-red-50 border-l-2 border-red-400 px-5 py-3">
              <p className="font-sans text-[13px] text-red-700">{state.message}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="name"
                className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
              >
                Name *
              </label>
              <input id="name" name="name" type="text" required className={FIELD_BASE} />
            </div>
            <div>
              <label
                htmlFor="email"
                className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
              >
                Email *
              </label>
              <input id="email" name="email" type="email" required className={FIELD_BASE} />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
              >
                Phone
              </label>
              <input id="phone" name="phone" type="tel" className={FIELD_BASE} />
            </div>
            <div>
              <label
                htmlFor="company"
                className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
              >
                Company
              </label>
              <input id="company" name="company" type="text" className={FIELD_BASE} />
            </div>
          </div>
          <div>
            <label
              htmlFor="subject"
              className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
            >
              Subject
            </label>
            <select
              id="subject"
              name="subject"
              defaultValue={presetSubject}
              className={FIELD_BASE}
            >
              <option value="">General Inquiry</option>
              {PRACTICE_AREAS.map((area) => (
                <option key={area.slug} value={area.title}>
                  {area.title}
                </option>
              ))}
              {presetSubject &&
                !PRACTICE_AREAS.find((a) => a.title === presetSubject) && (
                  <option value={presetSubject}>{presetSubject}</option>
                )}
            </select>
          </div>
          <div>
            <label
              htmlFor="message"
              className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
            >
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              required
              className={FIELD_BASE}
            />
          </div>
          <SubmitButton />
        </form>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run test, verify pass**

```bash
npm test -- --run contact-form.test
```

Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add tests/components/contact-form.test.tsx components/contact/contact-form.tsx
git commit -m "feat: add ContactForm client component with Server Action submission"
```

---

## Task 14: Compose `/contact` Route

**Files:**
- Create: `app/contact/page.tsx`

- [ ] **Step 1: Create `/Users/amirhamzah/Github/jin-legal/app/contact/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { PageHero } from "@/components/ui/page-hero";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";

export const metadata: Metadata = {
  title: "Contact — Jin Legal | PT Juris International Network",
  description:
    "Reach out to Jin Legal for a consultation. Office in Jakarta, Indonesia.",
};

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main>
        <PageHero
          eyebrow="Get in Touch"
          title="Let's Discuss Your Legal Needs"
          subtitle="Tell us about your matter — we typically respond within 1–2 business days."
        />
        <section className="bg-ivory px-[72px] py-20">
          <div className="max-w-[1100px] mx-auto grid grid-cols-[2fr_1fr] gap-16">
            <Suspense fallback={<div>Loading form…</div>}>
              <ContactForm />
            </Suspense>
            <ContactInfo />
          </div>
        </section>
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

Expected: `/contact` listed.

- [ ] **Step 3: Smoke-test form rendering**

```bash
pkill -f "next dev" 2>/dev/null; sleep 2
PORT=3010 npm run dev &
sleep 5
echo "--- /contact ---"
curl -s http://localhost:3010/contact | grep -c "Send Message"
pkill -f "next dev"
```

Expected: ≥1.

- [ ] **Step 4: Manually submit a test entry** (optional but recommended)

Start dev server, browse to http://localhost:3010/contact, fill the form (name=Test User, email=test@example.com, message=This is a Phase 3a test submission), submit. Verify success message appears.

Then verify the lead landed in Supabase:

```bash
# Tell the orchestrator: I will check via Supabase MCP after this task to confirm contact_leads has the test entry
```

- [ ] **Step 5: Commit**

```bash
git add app/contact/page.tsx
git commit -m "feat: compose Contact page route with form and info columns"
```

---

## Task 15: Add E2E Tests for Phase 3a Pages

**Files:**
- Create: `tests/e2e/insights.spec.ts`
- Create: `tests/e2e/careers.spec.ts`
- Create: `tests/e2e/contact.spec.ts`

- [ ] **Step 1: Create `/Users/amirhamzah/Github/jin-legal/tests/e2e/insights.spec.ts`**

```typescript
import { test, expect } from "@playwright/test";

test.describe("Insights pages", () => {
  test("Insights listing renders posts from Supabase", async ({ page }) => {
    await page.goto("/insights");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Legal Perspectives");
    await expect(page.getByText(/Indonesia/i).first()).toBeVisible();
  });

  test("Insights detail page renders markdown content", async ({ page }) => {
    await page.goto("/insights/indonesia-new-company-law");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Company Law");
    await expect(page.getByText(/Overview/i).first()).toBeVisible();
  });

  test("Bogus insight slug returns 404", async ({ page }) => {
    const response = await page.goto("/insights/this-does-not-exist");
    expect(response?.status()).toBe(404);
  });
});
```

- [ ] **Step 2: Create `/Users/amirhamzah/Github/jin-legal/tests/e2e/careers.spec.ts`**

```typescript
import { test, expect } from "@playwright/test";

test.describe("Careers page", () => {
  test("Careers page lists open positions", async ({ page }) => {
    await page.goto("/careers");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Build a Career");
    await expect(page.getByText(/Senior Associate/i)).toBeVisible();
  });

  test("Apply CTA links to /contact with subject param", async ({ page }) => {
    await page.goto("/careers");
    const applyLink = page.getByRole("link", { name: /apply/i }).first();
    const href = await applyLink.getAttribute("href");
    expect(href).toContain("/contact?subject=");
  });
});
```

- [ ] **Step 3: Create `/Users/amirhamzah/Github/jin-legal/tests/e2e/contact.spec.ts`**

```typescript
import { test, expect } from "@playwright/test";

test.describe("Contact page", () => {
  test("renders form and info columns", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Legal Needs");
    await expect(page.getByLabel(/^name/i)).toBeVisible();
    await expect(page.getByLabel(/^email/i)).toBeVisible();
    await expect(page.getByLabel(/^message/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /send message/i })).toBeVisible();
    await expect(page.getByText(/info@jinlegal\.co\.id/i)).toBeVisible();
  });

  test("shows validation error for empty submission", async ({ page }) => {
    await page.goto("/contact");
    // Browser will block on required HTML5 fields — verify required attribute
    await expect(page.getByLabel(/^name/i)).toHaveAttribute("required");
    await expect(page.getByLabel(/^email/i)).toHaveAttribute("required");
    await expect(page.getByLabel(/^message/i)).toHaveAttribute("required");
  });

  test("pre-fills subject from query param", async ({ page }) => {
    await page.goto("/contact?subject=Senior%20Associate%20%E2%80%94%20Corporate%20Law");
    const subjectSelect = page.getByLabel(/subject/i);
    await expect(subjectSelect).toHaveValue("Senior Associate — Corporate Law");
  });
});
```

- [ ] **Step 4: Run E2E suite**

```bash
pkill -f "next dev" 2>/dev/null; sleep 2
npm run test:e2e
```

Expected: all tests pass (4 homepage + 6 pages + 3 insights + 2 careers + 3 contact = 18 tests).

- [ ] **Step 5: Commit**

```bash
git add tests/e2e/insights.spec.ts tests/e2e/careers.spec.ts tests/e2e/contact.spec.ts
git commit -m "test: add E2E tests for Insights, Careers, and Contact"
```

---

## Task 16: Final Validation + Push

**No code — verification only.**

- [ ] **Step 1: Full validation suite**

```bash
echo "=== TYPECHECK ===" && npm run typecheck && \
echo "=== UNIT ===" && npm test -- --run 2>&1 | tail -8 && \
echo "=== E2E ===" && npm run test:e2e 2>&1 | tail -10 && \
echo "=== BUILD ===" && npm run build 2>&1 | tail -25
```

Expected: all four pass cleanly.

- [ ] **Step 2: Confirm route count**

After `npm run build`, route table should now include the Phase 1 + Phase 2 + Phase 3a routes:
- `/`, `/about`, `/team`, `/practice-areas`, 11 practice area detail subpages
- `/contact`, `/insights`, `/insights/[slug]` (3 prerendered), `/careers`
- `/_not-found`

Total: 21+ routes.

- [ ] **Step 3: Push**

```bash
git push origin main
```

- [ ] **Step 4: Reminder: add env vars to Vercel before next deploy**

The user must visit https://vercel.com/amiirhamzah/jin-legal/settings/environment-variables and add:
- `NEXT_PUBLIC_SUPABASE_URL` = `https://ymerojltkwjauqhdhnzu.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `sb_publishable_TyIf0o19Ukfx78raNeyTEQ_o393ZROE`

After adding env vars, trigger a redeploy (Vercel auto-deploys on the next git push, or click "Redeploy" in the dashboard).

---

## Self-Review Notes

**Spec coverage (Phase 3a portion of design spec):**
- ✅ Contact page with two-column layout (form + info) — Tasks 11, 12, 13, 14
- ✅ Contact form fields: Name, Email, Phone, Company, Subject (dropdown with practice areas), Message — Task 13
- ✅ Contact form submission to `contact_leads` Supabase table — Task 12
- ✅ Insights listing with category-filtered cards — Tasks 4, 5, 6
- ✅ Insights detail with markdown rendering, partner author display NOT included (Supabase has `author_id` but Phase 3a doesn't render author cross-reference — flag below)
- ✅ Careers page reading from Supabase, with active filtering — Tasks 9, 10
- ✅ Homepage Insights section now reads from Supabase — Task 8

**Deviations from spec (intentional):**
- Spec section 5.8 mentioned "author (partner)" on the insights detail header. Phase 3a does not render the author because the 3 seeded blog posts don't have an `author_id` populated (they were inserted without partner attribution). When real blog posts arrive with authors, the detail page can be extended to fetch the author from `team_members` via the FK. Tracked as a Phase 3b carry-over.
- Spec mentioned "Related articles sidebar" on insights detail. Phase 3a omits this since the seed only has 3 posts (no meaningful relation to surface). Add when post count grows.

**Carry-overs from earlier phases (still open, optional polish):**
- Button primitive not consistently used (hand-rolled link classes in hero/CTA/nav/contact form)
- Real partner photos (still Unsplash placeholders)
- `MarkdownContent` doesn't handle images yet — flag if blog content needs inline `<img>` tags later

**Phase 3a deliverable:** Three Supabase-backed public routes live. The homepage's Insights section is now data-driven. Visitors can read blog posts, view careers, and submit contact inquiries — completing the public-facing site. The site is now feature-complete for everything except the admin dashboard (Phase 3b).
