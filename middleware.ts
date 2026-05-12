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
