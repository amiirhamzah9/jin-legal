import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // ─── Admin auth handling (no i18n on /admin) ───────────────────────────
  if (path.startsWith("/admin")) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", path);

    let response = NextResponse.next({ request: { headers: requestHeaders } });

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

    // Protect /admin routes (except /admin/login)
    if (!path.startsWith("/admin/login") && !user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("redirectedFrom", path);
      return NextResponse.redirect(url);
    }

    // Logged-in user on /admin/login → send to dashboard
    if (path === "/admin/login" && user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.searchParams.delete("redirectedFrom");
      return NextResponse.redirect(url);
    }

    return response;
  }

  // ─── i18n routing for all other public pages ───────────────────────────
  return intlMiddleware(request);
}

export const config = {
  // Match everything except API, static files, and Next.js conventions
  matcher: [
    "/((?!api|_next|_vercel|sitemap.xml|robots.txt|manifest.webmanifest|favicon.ico|icon.png|apple-icon.png|.*\\..*).*)",
  ],
};
