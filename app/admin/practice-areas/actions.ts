"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/admin";

export type PracticeAreaFormState = {
  status: "idle" | "error" | "success";
  message?: string;
};

function getFields(formData: FormData) {
  const servicesRaw = String(formData.get("services") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    full_content: String(formData.get("full_content") ?? "").trim() || null,
    services: servicesRaw.length ? servicesRaw : null,
    display_order: Number(formData.get("display_order") ?? 0),
  };
}

export async function updatePracticeArea(
  areaId: string,
  _prev: PracticeAreaFormState,
  formData: FormData
): Promise<PracticeAreaFormState> {
  await requireAdmin();
  const fields = getFields(formData);

  if (!fields.title || !fields.description) {
    return { status: "error", message: "Title and description are required." };
  }

  const supabase = createClient();
  // Look up slug for revalidation
  const { data: existing } = await supabase
    .from("practice_areas")
    .select("slug")
    .eq("id", areaId)
    .single();

  const { error } = await supabase
    .from("practice_areas")
    .update(fields)
    .eq("id", areaId);

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/admin/practice-areas");
  revalidatePath(`/admin/practice-areas/${areaId}`);
  revalidatePath("/practice-areas");
  if (existing?.slug) revalidatePath(`/practice-areas/${existing.slug}`);
  revalidatePath("/");
  return { status: "success", message: "Practice area saved." };
}
