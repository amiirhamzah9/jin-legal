"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/admin";

export type CareerFormState = {
  status: "idle" | "error" | "success";
  message?: string;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  return {
    title,
    slug: slugify(title),
    description: String(formData.get("description") ?? "").trim(),
    type: String(formData.get("type") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim() || null,
    is_active: formData.get("is_active") === "on",
    title_id: String(formData.get("title_id") ?? "").trim() || null,
    description_id: String(formData.get("description_id") ?? "").trim() || null,
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
      message: "Judul, deskripsi, dan tipe wajib diisi.",
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
  revalidatePath(`/careers/${fields.slug}`);
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
      message: "Judul, deskripsi, dan tipe wajib diisi.",
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
  revalidatePath(`/careers/${fields.slug}`);
  return { status: "success", message: "Lowongan tersimpan." };
}

export async function deleteCareer(careerId: string) {
  await requireAdmin();
  const supabase = createClient();
  await supabase.from("careers").delete().eq("id", careerId);
  revalidatePath("/admin/careers");
  revalidatePath("/careers");
  redirect("/admin/careers");
}
