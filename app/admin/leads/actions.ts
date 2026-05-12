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
