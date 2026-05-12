# Jin Legal — Phase 3b: Admin Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a protected admin dashboard at `/admin` where the firm can publish blog posts, manage careers, and view contact leads — without touching code.

**Architecture:** Supabase Auth (email/password) protects all routes under `/admin/*` via Next.js middleware. Mutations go through Server Actions that use a `requireAdmin()` helper to enforce session presence before calling Supabase. Markdown blog content is edited in a plain textarea with a live preview (no heavy WYSIWYG dep). Cover images upload to Supabase Storage. Lists use Server Components for fast initial loads; mutation forms are Client Components (form state).

**Tech Stack:**
- Next.js 14 App Router + Server Actions + Middleware
- Supabase Auth (`@supabase/ssr` — already installed)
- Supabase Storage for cover images
- TypeScript + Tailwind (existing tokens)
- Vitest + RTL + Playwright (existing setup)
- `react-markdown` (already installed for blog rendering)

**Supabase setup additions:**
- Auth: enable email/password provider (already on by default)
- One admin user manually created via Supabase Dashboard before testing
- New storage bucket `blog-covers` (public read) for cover images
- New `is_read` boolean column on `contact_leads` for inbox-style status

**Out of Phase 3b (deferred):**
- Team members CRUD (use Supabase Dashboard for rare changes)
- Practice areas CRUD (use Supabase Dashboard for rare changes)
- Multi-user roles / permissions (single admin role)
- Email notifications on new lead

---

## File Structure

```
app/
  admin/
    layout.tsx                            Admin shell layout: nav, header, auth check
    page.tsx                              Dashboard overview (counts, recent leads)
    login/
      page.tsx                            Login form (server + client component pair)
      actions.ts                          'use server' loginAction
    leads/
      page.tsx                            Lead list (server)
      [id]/
        page.tsx                          Lead detail view
      actions.ts                          'use server' markRead, deleteLead
    blog/
      page.tsx                            Blog post list (server)
      new/
        page.tsx                          Blog create form
      [id]/
        page.tsx                          Blog edit form
      actions.ts                          'use server' createPost, updatePost, deletePost, togglePublished
    careers/
      page.tsx                            Career list (server)
      new/
        page.tsx                          Create form
      [id]/
        page.tsx                          Edit form
      actions.ts                          'use server' createCareer, updateCareer, deactivateCareer
  auth/
    callback/
      route.ts                            Auth callback handler

components/
  admin/
    admin-shell.tsx                       Sidebar + topbar layout
    admin-nav-link.tsx                    Active-aware nav link (client)
    sign-out-button.tsx                   Client button calling signOut action
    stat-card.tsx                         Dashboard stat card
    blog-form.tsx                         Client: blog create/edit form with markdown preview
    blog-table.tsx                        Server: blog post list table
    delete-button.tsx                     Client: confirm-and-delete button (reused)
    publish-toggle.tsx                    Client: published/draft toggle
    lead-row.tsx                          Server: a single row in lead list
    lead-detail.tsx                       Server: full lead view
    mark-read-button.tsx                  Client: mark-as-read action button
    career-form.tsx                       Client: career create/edit form
    career-table.tsx                      Server: career list table

lib/
  supabase/
    admin.ts                              requireAdmin() helper, also exposes admin server client
  storage/
    blog-covers.ts                        uploadBlogCover() helper (client-side upload via signed URL)

middleware.ts                             Auth middleware for /admin/*

tests/
  components/
    admin-nav-link.test.tsx
    blog-form.test.tsx
    publish-toggle.test.tsx
    career-form.test.tsx
    stat-card.test.tsx
  e2e/
    admin.spec.ts                         E2E: login + protected route check (uses test admin user)
```

---

## Task 1: Supabase Schema Update — `is_read` on `contact_leads`

**Files:**
- Apply migration via Supabase MCP (not a file in repo)
- Modify: `lib/supabase/types.ts` (add `is_read` column)
- Modify: `supabase/migrations/20260512000000_initial_schema.sql` (document the change for future fresh setups)

- [ ] **Step 1: Apply migration via Supabase MCP**

In the controller agent (not the implementer): use `mcp__supabase-pat__apply_migration` with project_id `ymerojltkwjauqhdhnzu`, name `add_is_read_to_contact_leads`, query:

```sql
alter table contact_leads add column is_read boolean not null default false;
create index idx_contact_leads_unread on contact_leads(created_at desc) where is_read = false;
```

(If implementer subagent is handling this, ask the controller to apply the migration on your behalf — subagents can use `mcp__supabase-pat__apply_migration` if available in their tool set.)

- [ ] **Step 2: Update `/Users/amirhamzah/Github/jin-legal/lib/supabase/types.ts`**

Find the `contact_leads` entry under `Tables` and add `is_read: boolean` to the Row type. The current shape:

```typescript
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
```

Replace the `Row` block to add `is_read: boolean`:

```typescript
contact_leads: {
  Row: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    company: string | null;
    subject: string | null;
    message: string;
    is_read: boolean;
    created_at: string;
  };
  Insert: Omit<Database["public"]["Tables"]["contact_leads"]["Row"], "id" | "created_at" | "is_read"> & {
    is_read?: boolean;
  };
  Update: Partial<Database["public"]["Tables"]["contact_leads"]["Insert"]>;
};
```

- [ ] **Step 3: Update `/Users/amirhamzah/Github/jin-legal/supabase/migrations/20260512000000_initial_schema.sql`**

Append at the bottom of the file:

```sql

-- Added in Phase 3b
alter table contact_leads add column if not exists is_read boolean not null default false;
create index if not exists idx_contact_leads_unread on contact_leads(created_at desc) where is_read = false;
```

(This makes a fresh checkout produce the same schema.)

- [ ] **Step 4: Verify**

```bash
npm run typecheck && npm run build
```

Expected: both succeed. Existing tests unaffected.

- [ ] **Step 5: Commit**

```bash
git add lib/supabase/types.ts supabase/migrations/20260512000000_initial_schema.sql
git commit -m "feat: add is_read column to contact_leads for admin inbox"
```

---

## Task 2: Create Storage Bucket for Blog Covers

**Files:**
- Apply via Supabase MCP / dashboard (not a file in repo)
- Document: append to `supabase/migrations/20260512000000_initial_schema.sql`

- [ ] **Step 1: Create the storage bucket via Supabase MCP `execute_sql`**

Controller dispatches:

```sql
insert into storage.buckets (id, name, public)
values ('blog-covers', 'blog-covers', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload
create policy if not exists "Authenticated users can upload blog covers"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'blog-covers');

-- Allow public read access
create policy if not exists "Public can read blog covers"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'blog-covers');

-- Allow authenticated users to delete (in case they want to swap covers)
create policy if not exists "Authenticated users can delete blog covers"
  on storage.objects for delete to authenticated
  using (bucket_id = 'blog-covers');
```

- [ ] **Step 2: Document the change** by appending to `/Users/amirhamzah/Github/jin-legal/supabase/migrations/20260512000000_initial_schema.sql`:

```sql

-- Storage bucket for blog cover images (Phase 3b)
-- (Bucket creation must be done via Supabase dashboard or SQL editor;
--  policies are listed here for reference and idempotent re-runs.)
```

- [ ] **Step 3: Verify the bucket exists**

Controller runs `execute_sql` with `select * from storage.buckets where id = 'blog-covers';` and confirms one row.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260512000000_initial_schema.sql
git commit -m "chore: document blog-covers storage bucket setup"
```

---

## Task 3: Create Admin User (Manual Step)

**No code changes.** This is a controller-managed step — orchestrator instructs the user once.

- [ ] **Step 1: Tell the user to create the admin user via Supabase Dashboard**

> "Open https://supabase.com/dashboard/project/ymerojltkwjauqhdhnzu/auth/users → click 'Add user' → 'Create new user' → enter the admin's email and a strong password. Confirm the user is created with `email_confirmed_at` set. You'll log in with these credentials at `/admin/login`."

- [ ] **Step 2: User confirms the admin user is created.** No commit needed.

---

## Task 4: Build `requireAdmin` Helper

**Files:**
- Create: `lib/supabase/admin.ts`

- [ ] **Step 1: Create `/Users/amirhamzah/Github/jin-legal/lib/supabase/admin.ts`**

```typescript
import { redirect } from "next/navigation";
import { createClient } from "./server";

/**
 * Guard for admin routes/actions. Redirects to /admin/login if no session.
 * Returns the authenticated user object on success.
 */
export async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin/login");
  }
  return user;
}

/**
 * Returns the current user or null without redirecting. Use in optional contexts.
 */
export async function getCurrentUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
```

- [ ] **Step 2: Update `/Users/amirhamzah/Github/jin-legal/lib/supabase/server.ts`** to support `set`/`remove` cookies (needed for auth — current impl only has `get`).

Read the current file first, then replace its contents wholesale with:

```typescript
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

export function createClient() {
  let cookieStore: ReturnType<typeof cookies> | null = null;
  try {
    cookieStore = cookies();
  } catch {
    // Called outside a request context (e.g., generateStaticParams)
    cookieStore = null;
  }

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore?.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore?.set({ name, value, ...options });
          } catch {
            // Read-only contexts (e.g., Server Components) — Next.js doesn't
            // allow cookie writes; middleware handles refresh in those cases.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore?.set({ name, value: "", ...options });
          } catch {
            // Same as set
          }
        },
      },
    }
  );
}
```

- [ ] **Step 3: Run typecheck and build**

```bash
npm run typecheck && npm run build
```

Expected: both succeed.

- [ ] **Step 4: Commit**

```bash
git add lib/supabase/server.ts lib/supabase/admin.ts
git commit -m "feat: add requireAdmin helper and cookie write support"
```

---

## Task 5: Build Auth Middleware

**Files:**
- Create: `middleware.ts`

- [ ] **Step 1: Create `/Users/amirhamzah/Github/jin-legal/middleware.ts`**

```typescript
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // Refresh session if needed (sets new cookie via the `set` hook above)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect /admin routes (except /admin/login)
  const path = request.nextUrl.pathname;
  if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("redirectedFrom", path);
      return NextResponse.redirect(url);
    }
  }

  // If logged in user visits /admin/login, send them to dashboard
  if (path === "/admin/login" && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.searchParams.delete("redirectedFrom");
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: build succeeds; output mentions middleware was compiled.

- [ ] **Step 3: Commit**

```bash
git add middleware.ts
git commit -m "feat: add auth middleware for /admin routes"
```

---

## Task 6: Build Login Page + Action

**Files:**
- Create: `app/admin/login/page.tsx`
- Create: `app/admin/login/actions.ts`

- [ ] **Step 1: Create `/Users/amirhamzah/Github/jin-legal/app/admin/login/actions.ts`**

```typescript
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type LoginState = {
  status: "idle" | "error";
  message?: string;
};

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/admin");

  if (!email || !password) {
    return { status: "error", message: "Email and password are required." };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { status: "error", message: "Invalid email or password." };
  }

  redirect(redirectTo);
}

export async function signOutAction() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
```

- [ ] **Step 2: Create `/Users/amirhamzah/Github/jin-legal/app/admin/login/page.tsx`**

```tsx
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import { loginAction, type LoginState } from "./actions";

const INITIAL: LoginState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-gold text-forest-deep font-sans text-[11px] font-bold tracking-[2.5px] uppercase py-4 hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? "Signing in…" : "Sign In"}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(loginAction, INITIAL);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectedFrom") ?? "/admin";

  return (
    <main className="min-h-screen bg-forest-deep flex items-center justify-center px-6">
      <div className="w-full max-w-[420px] bg-white p-12">
        <div className="font-sans text-[9px] tracking-[3px] text-gold font-bold uppercase mb-3">
          Jin Legal Admin
        </div>
        <h1 className="font-serif text-[34px] font-light text-forest leading-tight mb-10">
          Sign In
        </h1>

        {state.status === "error" && state.message && (
          <div className="bg-red-50 border-l-2 border-red-400 px-5 py-3 mb-6">
            <p className="font-sans text-[13px] text-red-700">{state.message}</p>
          </div>
        )}

        <form action={formAction} className="space-y-5">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <div>
            <label
              htmlFor="email"
              className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full bg-white border border-ivory-dark px-4 py-3 font-sans text-[13px] text-ink focus:border-gold focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full bg-white border border-ivory-dark px-4 py-3 font-sans text-[13px] text-ink focus:border-gold focus:outline-none transition-colors"
            />
          </div>
          <SubmitButton />
        </form>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Build**

```bash
npm run build
```

Expected: `/admin/login` listed.

- [ ] **Step 4: Smoke test (manual)** — start dev server, visit `/admin/login`, see form. Don't actually submit yet (admin user creation depends on Task 3).

- [ ] **Step 5: Commit**

```bash
git add app/admin/login/
git commit -m "feat: add admin login page and auth actions"
```

---

## Task 7: Build Admin Shell Components

**Files:**
- Create: `tests/components/admin-nav-link.test.tsx`
- Create: `components/admin/admin-nav-link.tsx`
- Create: `components/admin/sign-out-button.tsx`
- Create: `components/admin/admin-shell.tsx`

- [ ] **Step 1: Write failing test** at `/Users/amirhamzah/Github/jin-legal/tests/components/admin-nav-link.test.tsx`

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AdminNavLink } from "@/components/admin/admin-nav-link";

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/blog",
}));

describe("AdminNavLink", () => {
  it("renders the label and href", () => {
    render(<AdminNavLink href="/admin/blog" label="Blog Posts" />);
    const link = screen.getByRole("link", { name: /blog posts/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/admin/blog");
  });

  it("applies active styling when pathname matches", () => {
    render(<AdminNavLink href="/admin/blog" label="Blog Posts" />);
    const link = screen.getByRole("link", { name: /blog posts/i });
    expect(link.className).toContain("text-gold");
  });

  it("applies inactive styling when pathname does not match", () => {
    render(<AdminNavLink href="/admin/leads" label="Leads" />);
    const link = screen.getByRole("link", { name: /leads/i });
    expect(link.className).not.toContain("text-gold");
  });
});
```

- [ ] **Step 2: Run test, verify fail** with `npm test -- --run admin-nav-link.test`

- [ ] **Step 3: Create `/Users/amirhamzah/Github/jin-legal/components/admin/admin-nav-link.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminNavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      className={`block font-sans text-[12px] font-medium tracking-wide py-2.5 px-4 border-l-2 transition-colors ${
        isActive
          ? "text-gold border-gold bg-gold/5"
          : "text-white/55 border-transparent hover:text-white/85 hover:border-white/20"
      }`}
    >
      {label}
    </Link>
  );
}
```

- [ ] **Step 4: Run test, verify pass**

```bash
npm test -- --run admin-nav-link.test
```

Expected: PASS (3 tests).

- [ ] **Step 5: Create `/Users/amirhamzah/Github/jin-legal/components/admin/sign-out-button.tsx`**

```tsx
"use client";

import { signOutAction } from "@/app/admin/login/actions";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-white/55 hover:text-gold transition-colors"
      >
        Sign Out
      </button>
    </form>
  );
}
```

- [ ] **Step 6: Create `/Users/amirhamzah/Github/jin-legal/components/admin/admin-shell.tsx`**

```tsx
import type { ReactNode } from "react";
import Link from "next/link";
import { AdminNavLink } from "./admin-nav-link";
import { SignOutButton } from "./sign-out-button";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/blog", label: "Blog Posts" },
  { href: "/admin/careers", label: "Careers" },
];

export function AdminShell({
  children,
  userEmail,
}: {
  children: ReactNode;
  userEmail: string;
}) {
  return (
    <div className="min-h-screen flex bg-ivory">
      <aside className="w-64 bg-forest-deep flex flex-col">
        <div className="px-6 py-7 border-b border-white/5">
          <Link
            href="/admin"
            className="font-serif text-[20px] font-medium text-white"
          >
            JIN<span className="text-gold">.</span> Admin
          </Link>
        </div>
        <nav className="flex-1 py-6 px-2 space-y-1">
          {NAV_ITEMS.map((item) => (
            <AdminNavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>
        <div className="px-6 py-5 border-t border-white/5">
          <div className="font-sans text-[10px] text-white/35 mb-2">
            Signed in as
          </div>
          <div className="font-sans text-[12px] text-white/70 mb-4 break-all">
            {userEmail}
          </div>
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 px-12 py-10 overflow-x-hidden">{children}</main>
    </div>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add tests/components/admin-nav-link.test.tsx components/admin/admin-nav-link.tsx components/admin/sign-out-button.tsx components/admin/admin-shell.tsx
git commit -m "feat: add admin shell layout components"
```

---

## Task 8: Compose Admin Root Layout

**Files:**
- Create: `app/admin/layout.tsx`

- [ ] **Step 1: Create `/Users/amirhamzah/Github/jin-legal/app/admin/layout.tsx`**

```tsx
import { headers } from "next/headers";
import { AdminShell } from "@/components/admin/admin-shell";
import { getCurrentUser } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Login page has its own layout — don't wrap it.
  const pathname = headers().get("x-pathname") ?? "";
  if (pathname.endsWith("/admin/login")) {
    return <>{children}</>;
  }

  const user = await getCurrentUser();

  // Middleware redirects unauthed users; this is belt-and-suspenders.
  if (!user) {
    return <>{children}</>;
  }

  return <AdminShell userEmail={user.email ?? "(no email)"}>{children}</AdminShell>;
}
```

The `x-pathname` header check needs to be set by middleware. Update `/Users/amirhamzah/Github/jin-legal/middleware.ts` to set it. Inside the middleware function, before the return, find where the `response = NextResponse.next(...)` is created. Modify the headers passed in to include `x-pathname`:

Replace the entire `middleware.ts` content with:

```typescript
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  let response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: requestHeaders } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({ request: { headers: requestHeaders } });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("redirectedFrom", path);
      return NextResponse.redirect(url);
    }
  }

  if (path === "/admin/login" && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.searchParams.delete("redirectedFrom");
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
```

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: success; all admin routes compile.

- [ ] **Step 3: Commit**

```bash
git add app/admin/layout.tsx middleware.ts
git commit -m "feat: add admin root layout with auth-aware shell"
```

---

## Task 9: Build Dashboard Overview Page

**Files:**
- Create: `tests/components/stat-card.test.tsx`
- Create: `components/admin/stat-card.tsx`
- Create: `app/admin/page.tsx`

- [ ] **Step 1: Write failing test** at `/Users/amirhamzah/Github/jin-legal/tests/components/stat-card.test.tsx`

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatCard } from "@/components/admin/stat-card";

describe("StatCard", () => {
  it("renders label and value", () => {
    render(<StatCard label="Total Posts" value={42} />);
    expect(screen.getByText("Total Posts")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders helper text when provided", () => {
    render(<StatCard label="Leads" value={5} helper="3 unread" />);
    expect(screen.getByText("3 unread")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test, verify fail** with `npm test -- --run stat-card.test`

- [ ] **Step 3: Create `/Users/amirhamzah/Github/jin-legal/components/admin/stat-card.tsx`**

```tsx
export function StatCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: number | string;
  helper?: string;
}) {
  return (
    <div className="bg-white border-t-2 border-gold p-7">
      <div className="font-sans text-[9px] font-bold tracking-[2.5px] uppercase text-gold mb-3">
        {label}
      </div>
      <div className="font-serif text-[44px] font-light text-forest leading-none mb-2">
        {value}
      </div>
      {helper && (
        <div className="font-sans text-[12px] font-light text-ink-muted">
          {helper}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run test, verify pass**

```bash
npm test -- --run stat-card.test
```

Expected: PASS (2 tests).

- [ ] **Step 5: Create `/Users/amirhamzah/Github/jin-legal/app/admin/page.tsx`**

```tsx
import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/admin/stat-card";

export const dynamic = "force-dynamic";

async function getCounts() {
  const supabase = createClient();
  const [postsAll, postsPublished, leadsAll, leadsUnread, careersAll] = await Promise.all([
    supabase.from("blog_posts").select("id", { count: "exact", head: true }),
    supabase
      .from("blog_posts")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true),
    supabase.from("contact_leads").select("id", { count: "exact", head: true }),
    supabase
      .from("contact_leads")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false),
    supabase
      .from("careers")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
  ]);
  return {
    postsTotal: postsAll.count ?? 0,
    postsPublished: postsPublished.count ?? 0,
    leadsTotal: leadsAll.count ?? 0,
    leadsUnread: leadsUnread.count ?? 0,
    careersActive: careersAll.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  await requireAdmin();
  const counts = await getCounts();

  return (
    <div>
      <div className="mb-10">
        <div className="font-sans text-[10px] font-bold tracking-[2.5px] uppercase text-gold mb-2">
          Overview
        </div>
        <h1 className="font-serif text-[34px] font-light text-forest leading-tight">
          Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-12">
        <StatCard
          label="Blog Posts"
          value={counts.postsTotal}
          helper={`${counts.postsPublished} published`}
        />
        <StatCard
          label="Contact Leads"
          value={counts.leadsTotal}
          helper={`${counts.leadsUnread} unread`}
        />
        <StatCard
          label="Active Careers"
          value={counts.careersActive}
        />
        <StatCard label="Practice Areas" value={11} helper="managed in code" />
      </div>

      <div className="grid grid-cols-3 gap-5">
        <Link
          href="/admin/blog/new"
          className="bg-forest text-white px-6 py-5 hover:bg-forest-mid transition-colors"
        >
          <div className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-gold mb-2">
            Quick Action
          </div>
          <div className="font-serif text-[18px] font-medium">
            New Blog Post →
          </div>
        </Link>
        <Link
          href="/admin/leads"
          className="bg-forest text-white px-6 py-5 hover:bg-forest-mid transition-colors"
        >
          <div className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-gold mb-2">
            Quick Action
          </div>
          <div className="font-serif text-[18px] font-medium">View Leads →</div>
        </Link>
        <Link
          href="/admin/careers/new"
          className="bg-forest text-white px-6 py-5 hover:bg-forest-mid transition-colors"
        >
          <div className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-gold mb-2">
            Quick Action
          </div>
          <div className="font-serif text-[18px] font-medium">
            Post a Job →
          </div>
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Build**

```bash
npm run build
```

Expected: `/admin` listed as dynamic route.

- [ ] **Step 7: Commit**

```bash
git add tests/components/stat-card.test.tsx components/admin/stat-card.tsx app/admin/page.tsx
git commit -m "feat: add admin dashboard overview page with counts"
```

---

## Task 10: Leads — List Page

**Files:**
- Create: `app/admin/leads/page.tsx`
- Create: `components/admin/lead-row.tsx`

- [ ] **Step 1: Create `/Users/amirhamzah/Github/jin-legal/components/admin/lead-row.tsx`**

```tsx
import Link from "next/link";
import type { Database } from "@/lib/supabase/types";

type Lead = Database["public"]["Tables"]["contact_leads"]["Row"];

function formatRelative(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function LeadRow({ lead }: { lead: Lead }) {
  const unreadAccent = !lead.is_read ? "border-l-2 border-l-gold" : "border-l-2 border-l-transparent";
  return (
    <Link
      href={`/admin/leads/${lead.id}`}
      className={`block bg-white px-6 py-5 hover:bg-gold/5 transition-colors ${unreadAccent}`}
    >
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-center gap-3">
          <span
            className={`font-serif text-[18px] ${
              lead.is_read ? "text-ink-muted font-light" : "text-forest font-medium"
            }`}
          >
            {lead.name}
          </span>
          {!lead.is_read && (
            <span className="font-sans text-[8px] font-bold tracking-[2px] uppercase text-gold bg-gold/10 px-2 py-0.5">
              New
            </span>
          )}
        </div>
        <span className="font-sans text-[11px] text-ink-faint">
          {formatRelative(lead.created_at)}
        </span>
      </div>
      <div className="font-sans text-[12px] text-ink-muted mb-1">
        {lead.email}
        {lead.subject && <span className="text-ink-faint"> · {lead.subject}</span>}
      </div>
      <div className="font-sans text-[13px] font-light text-ink leading-[1.6] line-clamp-2">
        {lead.message}
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Create `/Users/amirhamzah/Github/jin-legal/app/admin/leads/page.tsx`**

```tsx
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { LeadRow } from "@/components/admin/lead-row";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  await requireAdmin();
  const supabase = createClient();
  const { data: leads } = await supabase
    .from("contact_leads")
    .select("*")
    .order("created_at", { ascending: false });

  const list = leads ?? [];

  return (
    <div>
      <div className="mb-10">
        <div className="font-sans text-[10px] font-bold tracking-[2.5px] uppercase text-gold mb-2">
          Inbox
        </div>
        <h1 className="font-serif text-[34px] font-light text-forest leading-tight">
          Contact Leads
        </h1>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-20 bg-white">
          <p className="font-sans text-[14px] font-light text-ink-muted">
            No leads yet — when visitors submit the contact form they&apos;ll appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {list.map((lead) => (
            <LeadRow key={lead.id} lead={lead} />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Build**

```bash
npm run build
```

Expected: `/admin/leads` listed.

- [ ] **Step 4: Commit**

```bash
git add app/admin/leads/page.tsx components/admin/lead-row.tsx
git commit -m "feat: add admin leads list page"
```

---

## Task 11: Leads — Detail Page + Actions (Mark Read / Delete)

**Files:**
- Create: `app/admin/leads/actions.ts`
- Create: `components/admin/mark-read-button.tsx`
- Create: `components/admin/delete-button.tsx`
- Create: `app/admin/leads/[id]/page.tsx`

- [ ] **Step 1: Create `/Users/amirhamzah/Github/jin-legal/app/admin/leads/actions.ts`**

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/admin";

export async function markLeadRead(leadId: string) {
  await requireAdmin();
  const supabase = createClient();
  await supabase.from("contact_leads").update({ is_read: true }).eq("id", leadId);
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function markLeadUnread(leadId: string) {
  await requireAdmin();
  const supabase = createClient();
  await supabase.from("contact_leads").update({ is_read: false }).eq("id", leadId);
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function deleteLead(leadId: string) {
  await requireAdmin();
  const supabase = createClient();
  await supabase.from("contact_leads").delete().eq("id", leadId);
  revalidatePath("/admin/leads");
  redirect("/admin/leads");
}
```

- [ ] **Step 2: Create `/Users/amirhamzah/Github/jin-legal/components/admin/mark-read-button.tsx`**

```tsx
"use client";

import { markLeadRead, markLeadUnread } from "@/app/admin/leads/actions";

export function MarkReadButton({ leadId, isRead }: { leadId: string; isRead: boolean }) {
  return (
    <form action={isRead ? markLeadUnread.bind(null, leadId) : markLeadRead.bind(null, leadId)}>
      <button
        type="submit"
        className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-forest border border-forest px-5 py-2.5 hover:bg-forest hover:text-white transition-colors"
      >
        {isRead ? "Mark as Unread" : "Mark as Read"}
      </button>
    </form>
  );
}
```

- [ ] **Step 3: Create `/Users/amirhamzah/Github/jin-legal/components/admin/delete-button.tsx`**

```tsx
"use client";

import { useState } from "react";

export function DeleteButton({
  onConfirm,
  label = "Delete",
  confirmText = "Are you sure? This cannot be undone.",
}: {
  onConfirm: () => Promise<void> | void;
  label?: string;
  confirmText?: string;
}) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <form
        action={async () => {
          await onConfirm();
        }}
        className="flex items-center gap-2"
      >
        <span className="font-sans text-[12px] text-red-700">{confirmText}</span>
        <button
          type="submit"
          className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-white bg-red-600 px-4 py-2 hover:bg-red-700 transition-colors"
        >
          Confirm
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted px-4 py-2 hover:text-ink transition-colors"
        >
          Cancel
        </button>
      </form>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-red-600 border border-red-300 px-5 py-2.5 hover:bg-red-50 transition-colors"
    >
      {label}
    </button>
  );
}
```

- [ ] **Step 4: Create `/Users/amirhamzah/Github/jin-legal/app/admin/leads/[id]/page.tsx`**

```tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { MarkReadButton } from "@/components/admin/mark-read-button";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteLead, markLeadRead } from "../actions";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin();
  const supabase = createClient();
  const { data: lead } = await supabase
    .from("contact_leads")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!lead) notFound();

  // Auto-mark-as-read on first view
  if (!lead.is_read) {
    await markLeadRead(lead.id);
  }

  return (
    <div className="max-w-[800px]">
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-2 font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted hover:text-gold transition-colors mb-8"
      >
        ← Back to Inbox
      </Link>

      <div className="font-sans text-[10px] font-bold tracking-[2.5px] uppercase text-gold mb-3">
        {lead.subject ?? "General Inquiry"}
      </div>
      <h1 className="font-serif text-[34px] font-light text-forest leading-tight mb-2">
        {lead.name}
      </h1>
      <div className="font-sans text-[13px] text-ink-muted mb-1">
        <a href={`mailto:${lead.email}`} className="hover:text-gold transition-colors">
          {lead.email}
        </a>
      </div>
      {lead.phone && (
        <div className="font-sans text-[13px] text-ink-muted mb-1">{lead.phone}</div>
      )}
      {lead.company && (
        <div className="font-sans text-[13px] text-ink-muted mb-1">{lead.company}</div>
      )}
      <div className="font-sans text-[11px] text-ink-faint mt-3">
        Received {new Date(lead.created_at).toLocaleString("en-US")}
      </div>

      <div className="my-8 bg-white p-8 border-l-2 border-gold">
        <div className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-gold mb-4">
          Message
        </div>
        <p className="font-sans text-[15px] font-light text-ink leading-[1.85] whitespace-pre-wrap">
          {lead.message}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <MarkReadButton leadId={lead.id} isRead={lead.is_read} />
        <DeleteButton
          label="Delete Lead"
          onConfirm={async () => {
            "use server";
            await deleteLead(lead.id);
          }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Build**

```bash
npm run build
```

Expected: `/admin/leads/[id]` listed.

- [ ] **Step 6: Commit**

```bash
git add app/admin/leads/ components/admin/mark-read-button.tsx components/admin/delete-button.tsx
git commit -m "feat: add lead detail view with mark-read and delete actions"
```

---

## Task 12: Blog Posts — List Page

**Files:**
- Create: `components/admin/blog-table.tsx`
- Create: `app/admin/blog/page.tsx`

- [ ] **Step 1: Create `/Users/amirhamzah/Github/jin-legal/components/admin/blog-table.tsx`**

```tsx
import Link from "next/link";
import type { Database } from "@/lib/supabase/types";

type Post = Database["public"]["Tables"]["blog_posts"]["Row"];

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function BlogTable({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="bg-white py-16 text-center">
        <p className="font-sans text-[14px] font-light text-ink-muted">
          No posts yet. Create your first one above.
        </p>
      </div>
    );
  }

  return (
    <table className="w-full bg-white">
      <thead>
        <tr className="border-b border-ivory-dark">
          <th className="text-left font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted px-6 py-4">
            Title
          </th>
          <th className="text-left font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted px-4 py-4">
            Category
          </th>
          <th className="text-left font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted px-4 py-4">
            Status
          </th>
          <th className="text-left font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted px-4 py-4">
            Published
          </th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post) => (
          <tr
            key={post.id}
            className="border-b border-ivory-dark hover:bg-gold/5 transition-colors"
          >
            <td className="px-6 py-4">
              <Link
                href={`/admin/blog/${post.id}`}
                className="font-serif text-[16px] font-medium text-forest hover:text-gold transition-colors"
              >
                {post.title}
              </Link>
            </td>
            <td className="px-4 py-4 font-sans text-[12px] text-ink-muted">
              {post.category ?? "—"}
            </td>
            <td className="px-4 py-4">
              <span
                className={`font-sans text-[9px] font-bold tracking-[2px] uppercase px-2 py-1 ${
                  post.is_published
                    ? "bg-gold/10 text-gold"
                    : "bg-ivory-dark text-ink-muted"
                }`}
              >
                {post.is_published ? "Published" : "Draft"}
              </span>
            </td>
            <td className="px-4 py-4 font-sans text-[12px] text-ink-muted">
              {formatDate(post.published_at)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

- [ ] **Step 2: Create `/Users/amirhamzah/Github/jin-legal/app/admin/blog/page.tsx`**

```tsx
import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { BlogTable } from "@/components/admin/blog-table";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  await requireAdmin();
  const supabase = createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="font-sans text-[10px] font-bold tracking-[2.5px] uppercase text-gold mb-2">
            Content
          </div>
          <h1 className="font-serif text-[34px] font-light text-forest leading-tight">
            Blog Posts
          </h1>
        </div>
        <Link
          href="/admin/blog/new"
          className="bg-gold text-forest-deep font-sans text-[10px] font-bold tracking-[2.5px] uppercase px-7 py-3.5 hover:bg-gold-light transition-colors"
        >
          New Post
        </Link>
      </div>
      <BlogTable posts={posts ?? []} />
    </div>
  );
}
```

- [ ] **Step 3: Build**

```bash
npm run build
```

Expected: `/admin/blog` listed.

- [ ] **Step 4: Commit**

```bash
git add app/admin/blog/page.tsx components/admin/blog-table.tsx
git commit -m "feat: add admin blog list page"
```

---

## Task 13: Blog — Server Actions (Create / Update / Delete / TogglePublished)

**Files:**
- Create: `app/admin/blog/actions.ts`

- [ ] **Step 1: Create `/Users/amirhamzah/Github/jin-legal/app/admin/blog/actions.ts`**

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/admin";

export type BlogFormState = {
  status: "idle" | "error" | "success";
  message?: string;
};

/**
 * Convert "Some Title!" → "some-title". Basic slug helper for new posts.
 */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 80);
}

function getCommonFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim() || null,
    content: String(formData.get("content") ?? "").trim(),
    cover_image_url: String(formData.get("cover_image_url") ?? "").trim() || null,
    category: String(formData.get("category") ?? "").trim() || null,
    is_published: formData.get("is_published") === "on",
  };
}

export async function createPost(
  _prev: BlogFormState,
  formData: FormData
): Promise<BlogFormState> {
  await requireAdmin();
  const fields = getCommonFields(formData);

  if (!fields.title || !fields.content) {
    return { status: "error", message: "Title and content are required." };
  }
  const slug = fields.slug || slugify(fields.title);
  if (!slug) {
    return { status: "error", message: "Could not generate a valid slug." };
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      title: fields.title,
      slug,
      excerpt: fields.excerpt,
      content: fields.content,
      cover_image_url: fields.cover_image_url,
      category: fields.category,
      is_published: fields.is_published,
      published_at: fields.is_published ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (error) {
    return {
      status: "error",
      message: error.code === "23505" ? "Slug already exists." : error.message,
    };
  }

  revalidatePath("/admin/blog");
  revalidatePath("/insights");
  redirect(`/admin/blog/${data!.id}`);
}

export async function updatePost(
  postId: string,
  _prev: BlogFormState,
  formData: FormData
): Promise<BlogFormState> {
  await requireAdmin();
  const fields = getCommonFields(formData);
  if (!fields.title || !fields.content) {
    return { status: "error", message: "Title and content are required." };
  }
  const slug = fields.slug || slugify(fields.title);

  const supabase = createClient();
  const { error } = await supabase
    .from("blog_posts")
    .update({
      title: fields.title,
      slug,
      excerpt: fields.excerpt,
      content: fields.content,
      cover_image_url: fields.cover_image_url,
      category: fields.category,
      is_published: fields.is_published,
      published_at: fields.is_published ? new Date().toISOString() : null,
    })
    .eq("id", postId);

  if (error) {
    return {
      status: "error",
      message: error.code === "23505" ? "Slug already exists." : error.message,
    };
  }

  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${postId}`);
  revalidatePath("/insights");
  revalidatePath(`/insights/${slug}`);
  return { status: "success", message: "Post saved." };
}

export async function deletePost(postId: string) {
  await requireAdmin();
  const supabase = createClient();
  await supabase.from("blog_posts").delete().eq("id", postId);
  revalidatePath("/admin/blog");
  revalidatePath("/insights");
  redirect("/admin/blog");
}

export async function togglePublished(postId: string, currentlyPublished: boolean) {
  await requireAdmin();
  const supabase = createClient();
  await supabase
    .from("blog_posts")
    .update({
      is_published: !currentlyPublished,
      published_at: !currentlyPublished ? new Date().toISOString() : null,
    })
    .eq("id", postId);
  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${postId}`);
  revalidatePath("/insights");
}
```

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/admin/blog/actions.ts
git commit -m "feat: add blog post Server Actions (CRUD + publish toggle)"
```

---

## Task 14: Blog — Form Component (Create / Edit)

**Files:**
- Create: `tests/components/blog-form.test.tsx`
- Create: `components/admin/blog-form.tsx`

- [ ] **Step 1: Write failing test** at `/Users/amirhamzah/Github/jin-legal/tests/components/blog-form.test.tsx`

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BlogForm } from "@/components/admin/blog-form";

vi.mock("@/app/admin/blog/actions", () => ({
  createPost: vi.fn().mockResolvedValue({ status: "idle" }),
  updatePost: vi.fn(),
}));

vi.mock("@/components/insights/markdown-content", () => ({
  MarkdownContent: ({ source }: { source: string }) => (
    <div data-testid="md-preview">{source}</div>
  ),
}));

describe("BlogForm", () => {
  it("renders all blog fields", () => {
    render(<BlogForm mode="create" />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/slug/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/excerpt/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cover image url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/published/i)).toBeInTheDocument();
  });

  it("pre-fills fields in edit mode", () => {
    const post = {
      id: "p1",
      title: "Existing Title",
      slug: "existing",
      excerpt: "Excerpt",
      content: "Body",
      cover_image_url: null,
      category: "Corporate Law",
      author_id: null,
      published_at: null,
      is_published: false,
      created_at: "2025-01-01T00:00:00Z",
    };
    render(<BlogForm mode="edit" post={post} />);
    expect(screen.getByDisplayValue("Existing Title")).toBeInTheDocument();
    expect(screen.getByDisplayValue("existing")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Corporate Law")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test, verify fail** with `npm test -- --run blog-form.test`

- [ ] **Step 3: Create `/Users/amirhamzah/Github/jin-legal/components/admin/blog-form.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createPost, updatePost, type BlogFormState } from "@/app/admin/blog/actions";
import { MarkdownContent } from "@/components/insights/markdown-content";
import type { Database } from "@/lib/supabase/types";

type Post = Database["public"]["Tables"]["blog_posts"]["Row"];

const INITIAL: BlogFormState = { status: "idle" };

const FIELD_BASE =
  "w-full bg-white border border-ivory-dark px-4 py-3 font-sans text-[13px] text-ink focus:border-gold focus:outline-none transition-colors";

function SaveButton({ mode }: { mode: "create" | "edit" }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-gold text-forest-deep font-sans text-[10px] font-bold tracking-[2.5px] uppercase px-9 py-3.5 hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? "Saving…" : mode === "create" ? "Create Post" : "Save Changes"}
    </button>
  );
}

export function BlogForm({
  mode,
  post,
}: {
  mode: "create" | "edit";
  post?: Post;
}) {
  const boundAction =
    mode === "create" ? createPost : updatePost.bind(null, post!.id);
  const [state, formAction] = useFormState<BlogFormState, FormData>(
    boundAction,
    INITIAL
  );

  const [content, setContent] = useState(post?.content ?? "");
  const [showPreview, setShowPreview] = useState(false);

  return (
    <form action={formAction} className="grid grid-cols-[2fr_1fr] gap-8">
      <div className="space-y-5">
        {state.status === "error" && state.message && (
          <div className="bg-red-50 border-l-2 border-red-400 px-5 py-3">
            <p className="font-sans text-[13px] text-red-700">{state.message}</p>
          </div>
        )}
        {state.status === "success" && state.message && (
          <div className="bg-gold/10 border-l-2 border-gold px-5 py-3">
            <p className="font-sans text-[13px] text-forest">{state.message}</p>
          </div>
        )}

        <div>
          <label
            htmlFor="title"
            className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
          >
            Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={post?.title}
            className={FIELD_BASE}
          />
        </div>

        <div>
          <label
            htmlFor="slug"
            className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
          >
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            defaultValue={post?.slug}
            placeholder="auto-generated from title if blank"
            className={FIELD_BASE}
          />
        </div>

        <div>
          <label
            htmlFor="excerpt"
            className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
          >
            Excerpt
          </label>
          <input
            id="excerpt"
            name="excerpt"
            type="text"
            defaultValue={post?.excerpt ?? ""}
            placeholder="Short summary shown on the listing page"
            className={FIELD_BASE}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="content"
              className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted"
            >
              Content (Markdown) *
            </label>
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-gold hover:underline"
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </button>
          </div>
          <textarea
            id="content"
            name="content"
            required
            rows={20}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`${FIELD_BASE} font-mono`}
          />
          {showPreview && (
            <div className="mt-5 bg-ivory p-7 border-l-2 border-gold">
              <div className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-gold mb-4">
                Live Preview
              </div>
              <MarkdownContent source={content} />
            </div>
          )}
        </div>
      </div>

      <aside className="space-y-5">
        <div>
          <label
            htmlFor="category"
            className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
          >
            Category
          </label>
          <input
            id="category"
            name="category"
            type="text"
            defaultValue={post?.category ?? ""}
            placeholder="e.g. Corporate Law"
            className={FIELD_BASE}
          />
        </div>

        <div>
          <label
            htmlFor="cover_image_url"
            className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
          >
            Cover Image URL
          </label>
          <input
            id="cover_image_url"
            name="cover_image_url"
            type="url"
            defaultValue={post?.cover_image_url ?? ""}
            placeholder="https://..."
            className={FIELD_BASE}
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer pt-3 border-t border-ivory-dark">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={post?.is_published}
            className="w-4 h-4 accent-gold"
          />
          <span className="font-sans text-[11px] font-medium tracking-wide text-ink">
            Published
          </span>
        </label>

        <div className="pt-5 border-t border-ivory-dark">
          <SaveButton mode={mode} />
        </div>
      </aside>
    </form>
  );
}
```

- [ ] **Step 4: Run test, verify pass**

```bash
npm test -- --run blog-form.test
```

Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add tests/components/blog-form.test.tsx components/admin/blog-form.tsx
git commit -m "feat: add BlogForm component with markdown preview"
```

---

## Task 15: Blog — New + Edit Routes + Delete Button Wiring

**Files:**
- Create: `app/admin/blog/new/page.tsx`
- Create: `app/admin/blog/[id]/page.tsx`

- [ ] **Step 1: Create `/Users/amirhamzah/Github/jin-legal/app/admin/blog/new/page.tsx`**

```tsx
import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin";
import { BlogForm } from "@/components/admin/blog-form";

export const dynamic = "force-dynamic";

export default async function NewBlogPostPage() {
  await requireAdmin();
  return (
    <div>
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-2 font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted hover:text-gold transition-colors mb-8"
      >
        ← Back to Posts
      </Link>
      <div className="mb-10">
        <div className="font-sans text-[10px] font-bold tracking-[2.5px] uppercase text-gold mb-2">
          New Post
        </div>
        <h1 className="font-serif text-[34px] font-light text-forest leading-tight">
          Create Blog Post
        </h1>
      </div>
      <BlogForm mode="create" />
    </div>
  );
}
```

- [ ] **Step 2: Create `/Users/amirhamzah/Github/jin-legal/app/admin/blog/[id]/page.tsx`**

```tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { BlogForm } from "@/components/admin/blog-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { deletePost } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin();
  const supabase = createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!post) notFound();

  return (
    <div>
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-2 font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted hover:text-gold transition-colors mb-8"
      >
        ← Back to Posts
      </Link>
      <div className="flex items-start justify-between mb-10">
        <div>
          <div className="font-sans text-[10px] font-bold tracking-[2.5px] uppercase text-gold mb-2">
            Edit Post
          </div>
          <h1 className="font-serif text-[28px] font-light text-forest leading-tight">
            {post.title}
          </h1>
        </div>
        <DeleteButton
          label="Delete Post"
          onConfirm={async () => {
            "use server";
            await deletePost(post.id);
          }}
        />
      </div>
      <BlogForm mode="edit" post={post} />
    </div>
  );
}
```

- [ ] **Step 3: Build**

```bash
npm run build
```

Expected: both `/admin/blog/new` and `/admin/blog/[id]` listed.

- [ ] **Step 4: Commit**

```bash
git add app/admin/blog/new/page.tsx "app/admin/blog/[id]/page.tsx"
git commit -m "feat: add admin blog create + edit routes"
```

---

## Task 16: Careers — Server Actions

**Files:**
- Create: `app/admin/careers/actions.ts`

- [ ] **Step 1: Create `/Users/amirhamzah/Github/jin-legal/app/admin/careers/actions.ts`**

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/admin";

export type CareerFormState = {
  status: "idle" | "error" | "success";
  message?: string;
};

function getFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    type: String(formData.get("type") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim() || null,
    is_active: formData.get("is_active") === "on",
  };
}

export async function createCareer(
  _prev: CareerFormState,
  formData: FormData
): Promise<CareerFormState> {
  await requireAdmin();
  const fields = getFields(formData);

  if (!fields.title || !fields.description || !fields.type) {
    return {
      status: "error",
      message: "Title, description, and type are required.",
    };
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("careers")
    .insert(fields)
    .select("id")
    .single();

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/admin/careers");
  revalidatePath("/careers");
  redirect(`/admin/careers/${data!.id}`);
}

export async function updateCareer(
  careerId: string,
  _prev: CareerFormState,
  formData: FormData
): Promise<CareerFormState> {
  await requireAdmin();
  const fields = getFields(formData);

  if (!fields.title || !fields.description || !fields.type) {
    return {
      status: "error",
      message: "Title, description, and type are required.",
    };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("careers")
    .update(fields)
    .eq("id", careerId);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/admin/careers");
  revalidatePath(`/admin/careers/${careerId}`);
  revalidatePath("/careers");
  return { status: "success", message: "Career saved." };
}

export async function deleteCareer(careerId: string) {
  await requireAdmin();
  const supabase = createClient();
  await supabase.from("careers").delete().eq("id", careerId);
  revalidatePath("/admin/careers");
  revalidatePath("/careers");
  redirect("/admin/careers");
}
```

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/admin/careers/actions.ts
git commit -m "feat: add careers Server Actions"
```

---

## Task 17: Careers — Form + List

**Files:**
- Create: `tests/components/career-form.test.tsx`
- Create: `components/admin/career-form.tsx`
- Create: `components/admin/career-table.tsx`
- Create: `app/admin/careers/page.tsx`
- Create: `app/admin/careers/new/page.tsx`
- Create: `app/admin/careers/[id]/page.tsx`

- [ ] **Step 1: Write failing test** at `/Users/amirhamzah/Github/jin-legal/tests/components/career-form.test.tsx`

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CareerForm } from "@/components/admin/career-form";

vi.mock("@/app/admin/careers/actions", () => ({
  createCareer: vi.fn().mockResolvedValue({ status: "idle" }),
  updateCareer: vi.fn(),
}));

describe("CareerForm", () => {
  it("renders all career fields", () => {
    render(<CareerForm mode="create" />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/active/i)).toBeInTheDocument();
  });

  it("pre-fills fields in edit mode", () => {
    const career = {
      id: "c1",
      title: "Senior Associate",
      description: "Five+ years of experience required",
      type: "Full-time",
      location: "Jakarta",
      is_active: true,
      created_at: "2025-01-01T00:00:00Z",
    };
    render(<CareerForm mode="edit" career={career} />);
    expect(screen.getByDisplayValue("Senior Associate")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Jakarta")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test, verify fail** with `npm test -- --run career-form.test`

- [ ] **Step 3: Create `/Users/amirhamzah/Github/jin-legal/components/admin/career-form.tsx`**

```tsx
"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  createCareer,
  updateCareer,
  type CareerFormState,
} from "@/app/admin/careers/actions";
import type { Database } from "@/lib/supabase/types";

type Career = Database["public"]["Tables"]["careers"]["Row"];

const INITIAL: CareerFormState = { status: "idle" };

const FIELD_BASE =
  "w-full bg-white border border-ivory-dark px-4 py-3 font-sans text-[13px] text-ink focus:border-gold focus:outline-none transition-colors";

function SaveButton({ mode }: { mode: "create" | "edit" }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-gold text-forest-deep font-sans text-[10px] font-bold tracking-[2.5px] uppercase px-9 py-3.5 hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? "Saving…" : mode === "create" ? "Create Career" : "Save Changes"}
    </button>
  );
}

export function CareerForm({
  mode,
  career,
}: {
  mode: "create" | "edit";
  career?: Career;
}) {
  const boundAction =
    mode === "create" ? createCareer : updateCareer.bind(null, career!.id);
  const [state, formAction] = useFormState<CareerFormState, FormData>(
    boundAction,
    INITIAL
  );

  return (
    <form action={formAction} className="max-w-[760px] space-y-5">
      {state.status === "error" && state.message && (
        <div className="bg-red-50 border-l-2 border-red-400 px-5 py-3">
          <p className="font-sans text-[13px] text-red-700">{state.message}</p>
        </div>
      )}
      {state.status === "success" && state.message && (
        <div className="bg-gold/10 border-l-2 border-gold px-5 py-3">
          <p className="font-sans text-[13px] text-forest">{state.message}</p>
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
        >
          Title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={career?.title}
          className={FIELD_BASE}
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
        >
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={10}
          defaultValue={career?.description}
          className={FIELD_BASE}
        />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="type"
            className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
          >
            Type *
          </label>
          <select
            id="type"
            name="type"
            required
            defaultValue={career?.type}
            className={FIELD_BASE}
          >
            <option value="">Choose…</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="location"
            className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted mb-2 block"
          >
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            defaultValue={career?.location ?? ""}
            className={FIELD_BASE}
          />
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer pt-3 border-t border-ivory-dark">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={career?.is_active ?? true}
          className="w-4 h-4 accent-gold"
        />
        <span className="font-sans text-[11px] font-medium tracking-wide text-ink">
          Active (visible on /careers)
        </span>
      </label>

      <div className="pt-5 border-t border-ivory-dark">
        <SaveButton mode={mode} />
      </div>
    </form>
  );
}
```

- [ ] **Step 4: Run test, verify pass**

```bash
npm test -- --run career-form.test
```

Expected: PASS (2 tests).

- [ ] **Step 5: Create `/Users/amirhamzah/Github/jin-legal/components/admin/career-table.tsx`**

```tsx
import Link from "next/link";
import type { Database } from "@/lib/supabase/types";

type Career = Database["public"]["Tables"]["careers"]["Row"];

export function CareerTable({ careers }: { careers: Career[] }) {
  if (careers.length === 0) {
    return (
      <div className="bg-white py-16 text-center">
        <p className="font-sans text-[14px] font-light text-ink-muted">
          No careers posted. Create one above.
        </p>
      </div>
    );
  }
  return (
    <table className="w-full bg-white">
      <thead>
        <tr className="border-b border-ivory-dark">
          <th className="text-left font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted px-6 py-4">
            Title
          </th>
          <th className="text-left font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted px-4 py-4">
            Type
          </th>
          <th className="text-left font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted px-4 py-4">
            Location
          </th>
          <th className="text-left font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted px-4 py-4">
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        {careers.map((career) => (
          <tr
            key={career.id}
            className="border-b border-ivory-dark hover:bg-gold/5 transition-colors"
          >
            <td className="px-6 py-4">
              <Link
                href={`/admin/careers/${career.id}`}
                className="font-serif text-[16px] font-medium text-forest hover:text-gold transition-colors"
              >
                {career.title}
              </Link>
            </td>
            <td className="px-4 py-4 font-sans text-[12px] text-ink-muted">
              {career.type}
            </td>
            <td className="px-4 py-4 font-sans text-[12px] text-ink-muted">
              {career.location ?? "—"}
            </td>
            <td className="px-4 py-4">
              <span
                className={`font-sans text-[9px] font-bold tracking-[2px] uppercase px-2 py-1 ${
                  career.is_active
                    ? "bg-gold/10 text-gold"
                    : "bg-ivory-dark text-ink-muted"
                }`}
              >
                {career.is_active ? "Active" : "Inactive"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

- [ ] **Step 6: Create `/Users/amirhamzah/Github/jin-legal/app/admin/careers/page.tsx`**

```tsx
import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { CareerTable } from "@/components/admin/career-table";

export const dynamic = "force-dynamic";

export default async function AdminCareersPage() {
  await requireAdmin();
  const supabase = createClient();
  const { data: careers } = await supabase
    .from("careers")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="font-sans text-[10px] font-bold tracking-[2.5px] uppercase text-gold mb-2">
            Hiring
          </div>
          <h1 className="font-serif text-[34px] font-light text-forest leading-tight">
            Careers
          </h1>
        </div>
        <Link
          href="/admin/careers/new"
          className="bg-gold text-forest-deep font-sans text-[10px] font-bold tracking-[2.5px] uppercase px-7 py-3.5 hover:bg-gold-light transition-colors"
        >
          New Career
        </Link>
      </div>
      <CareerTable careers={careers ?? []} />
    </div>
  );
}
```

- [ ] **Step 7: Create `/Users/amirhamzah/Github/jin-legal/app/admin/careers/new/page.tsx`**

```tsx
import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin";
import { CareerForm } from "@/components/admin/career-form";

export const dynamic = "force-dynamic";

export default async function NewCareerPage() {
  await requireAdmin();
  return (
    <div>
      <Link
        href="/admin/careers"
        className="inline-flex items-center gap-2 font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted hover:text-gold transition-colors mb-8"
      >
        ← Back to Careers
      </Link>
      <div className="mb-10">
        <div className="font-sans text-[10px] font-bold tracking-[2.5px] uppercase text-gold mb-2">
          New Career
        </div>
        <h1 className="font-serif text-[34px] font-light text-forest leading-tight">
          Post a Job
        </h1>
      </div>
      <CareerForm mode="create" />
    </div>
  );
}
```

- [ ] **Step 8: Create `/Users/amirhamzah/Github/jin-legal/app/admin/careers/[id]/page.tsx`**

```tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { CareerForm } from "@/components/admin/career-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteCareer } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditCareerPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin();
  const supabase = createClient();
  const { data: career } = await supabase
    .from("careers")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!career) notFound();

  return (
    <div>
      <Link
        href="/admin/careers"
        className="inline-flex items-center gap-2 font-sans text-[10px] font-bold tracking-[2px] uppercase text-ink-muted hover:text-gold transition-colors mb-8"
      >
        ← Back to Careers
      </Link>
      <div className="flex items-start justify-between mb-10">
        <div>
          <div className="font-sans text-[10px] font-bold tracking-[2.5px] uppercase text-gold mb-2">
            Edit Career
          </div>
          <h1 className="font-serif text-[28px] font-light text-forest leading-tight">
            {career.title}
          </h1>
        </div>
        <DeleteButton
          label="Delete Career"
          onConfirm={async () => {
            "use server";
            await deleteCareer(career.id);
          }}
        />
      </div>
      <CareerForm mode="edit" career={career} />
    </div>
  );
}
```

- [ ] **Step 9: Build**

```bash
npm run build
```

Expected: all 3 career routes listed.

- [ ] **Step 10: Commit**

```bash
git add tests/components/career-form.test.tsx components/admin/career-form.tsx components/admin/career-table.tsx app/admin/careers/
git commit -m "feat: add admin careers CRUD (list, create, edit)"
```

---

## Task 18: E2E Test — Admin Login + Protected Route

**Files:**
- Create: `tests/e2e/admin.spec.ts`

- [ ] **Step 1: Create `/Users/amirhamzah/Github/jin-legal/tests/e2e/admin.spec.ts`**

```typescript
import { test, expect } from "@playwright/test";

test.describe("Admin auth", () => {
  test("Unauthenticated user is redirected from /admin to /admin/login", async ({
    page,
  }) => {
    const response = await page.goto("/admin");
    // Should end up at the login page after middleware redirect
    await expect(page).toHaveURL(/\/admin\/login/);
    expect(response?.status()).toBeLessThan(500);
  });

  test("Login page renders the form", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("Login fails with bad credentials and stays on login page", async ({
    page,
  }) => {
    await page.goto("/admin/login");
    await page.getByLabel(/email/i).fill("not-an-admin@example.com");
    await page.getByLabel(/password/i).fill("wrong-password");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
```

- [ ] **Step 2: Run E2E**

```bash
pkill -f "next dev" 2>/dev/null; sleep 2
npm run test:e2e
```

Expected: all tests pass — 18 from prior phases + 3 new = 21.

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/admin.spec.ts
git commit -m "test: add E2E for admin login + auth redirects"
```

---

## Task 19: Update Homepage Insights To Skip Drafts

**Files:**
- (Already correct — `getRecentBlogPosts` filters on `is_published`. This task is a no-op verification.)

- [ ] **Step 1: Read `/Users/amirhamzah/Github/jin-legal/lib/data/queries.ts`** and confirm `getRecentBlogPosts` has `.eq("is_published", true)`.

If yes, this task is complete — no commit needed.

If somehow missing, add `.eq("is_published", true)` to the chain.

---

## Task 20: Final Validation + Push

**No code — verification only.**

- [ ] **Step 1: Run full validation**

```bash
echo "=== TYPECHECK ===" && npm run typecheck && \
echo "=== UNIT ===" && npm test -- --run 2>&1 | tail -8 && \
echo "=== E2E ===" && npm run test:e2e 2>&1 | tail -10 && \
echo "=== BUILD ===" && npm run build 2>&1 | tail -40
```

All four pass cleanly. Expected route table includes everything from prior phases plus admin routes:
- Public: `/`, `/about`, `/team`, `/practice-areas`, 11 practice-area subpages, `/insights`, 3 insight detail, `/careers`, `/contact`, `/_not-found`
- Admin: `/admin`, `/admin/login`, `/admin/leads`, `/admin/leads/[id]`, `/admin/blog`, `/admin/blog/new`, `/admin/blog/[id]`, `/admin/careers`, `/admin/careers/new`, `/admin/careers/[id]`

Total: ~33 routes.

- [ ] **Step 2: Push**

```bash
git push origin main
```

- [ ] **Step 3: Reminder to user** — env vars already in Vercel from Phase 3a, so production deploys will work. After the next push, the admin dashboard will be live at https://jin-legal.vercel.app/admin.

The admin user (created in Task 3) can sign in at /admin/login with the email + password they set in Supabase Auth.

---

## Self-Review Notes

**Spec coverage (Phase 3b portion):**
- ✅ `/admin` dashboard with auth — Tasks 6, 8, 9 (login, layout, overview)
- ✅ Middleware protection — Task 5
- ✅ `requireAdmin()` helper — Task 4
- ✅ Blog posts CRUD — Tasks 12, 13, 14, 15
- ✅ Markdown live preview — Task 14 (reuses MarkdownContent from Phase 3a)
- ✅ Contact leads view + mark read + delete — Tasks 10, 11
- ✅ Careers CRUD — Tasks 16, 17
- ✅ Auth E2E — Task 18

**Deviations from full spec:**
- Spec section 5.11 mentions CRUD for **team members** and **practice areas** — both deferred. Team profiles and practice area definitions change rarely; for now, admins can edit those directly in the Supabase dashboard. If the firm wants in-app CRUD for these, it's a follow-up plan (Phase 3c, ~12 tasks each).

**Blog cover image flow:**
- Task 14's BlogForm has a "Cover Image URL" text field — admins paste a URL (e.g. from Unsplash or after manually uploading to the `blog-covers` Supabase bucket via the dashboard). A future polish task could add inline file upload to the bucket via signed URL — out of scope here.

**Carry-overs from earlier phases (still open, optional polish):**
- Button primitive not consistently used
- Real partner photos (still Unsplash placeholders)

**Phase 3b deliverable:** Full content-management workflow. The firm's editor can: write blog posts in markdown with live preview, publish/unpublish them, respond to incoming leads, post and close career listings — all without touching code or asking a developer. The site is now genuinely self-serve for non-engineering staff.
