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
