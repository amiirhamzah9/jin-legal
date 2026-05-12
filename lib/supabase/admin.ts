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
