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
