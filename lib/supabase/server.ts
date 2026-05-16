import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "./types";

/**
 * Anonymous, cookie-less Supabase client for ISR-friendly public reads.
 * Does not call `next/headers` so it does NOT opt the calling page out of
 * static rendering — use this in `lib/data/queries.ts` and anywhere public
 * data is read during ISR / generateStaticParams.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

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
