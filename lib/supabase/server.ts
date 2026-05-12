import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

export function createClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // Lazy cookie access — `cookies()` throws outside a request scope
          // (e.g. inside generateStaticParams at build time). For anon reads
          // we can safely fall back to no cookie.
          try {
            return cookies().get(name)?.value;
          } catch {
            return undefined;
          }
        },
      },
    }
  );
}
