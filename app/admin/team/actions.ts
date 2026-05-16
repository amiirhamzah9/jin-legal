"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/admin";

export type TeamFormState = {
  status: "idle" | "error" | "success";
  message?: string;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 80);
}

function getFields(formData: FormData) {
  const practiceAreasRaw = String(formData.get("practice_areas") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    name: String(formData.get("name") ?? "").trim(),
    credentials: String(formData.get("credentials") ?? "").trim() || null,
    role: String(formData.get("role") ?? "").trim(),
    bio: String(formData.get("bio") ?? "").trim() || null,
    photo_url: String(formData.get("photo_url") ?? "").trim() || null,
    slug: String(formData.get("slug") ?? "").trim() || null,
    practice_group: String(formData.get("practice_group") ?? "").trim() || null,
    practice_areas: practiceAreasRaw.length ? practiceAreasRaw : null,
    display_order: Number(formData.get("display_order") ?? 0),
    is_active: formData.get("is_active") === "on",
    role_id: String(formData.get("role_id") ?? "").trim() || null,
    bio_id: String(formData.get("bio_id") ?? "").trim() || null,
  };
}

export async function createTeamMember(
  _prev: TeamFormState,
  formData: FormData
): Promise<TeamFormState> {
  await requireAdmin();
  const fields = getFields(formData);

  if (!fields.name || !fields.role) {
    return { status: "error", message: "Name and role are required." };
  }
  const slug = fields.slug || slugify(fields.name);

  const supabase = createClient();
  const { data, error } = await supabase
    .from("team_members")
    .insert({ ...fields, slug })
    .select("id")
    .single();

  if (error) {
    return {
      status: "error",
      message: error.code === "23505" ? "Slug already exists." : error.message,
    };
  }

  revalidatePath("/admin/team");
  revalidatePath("/team");
  revalidatePath("/");
  redirect(`/admin/team/${data!.id}`);
}

export async function updateTeamMember(
  memberId: string,
  _prev: TeamFormState,
  formData: FormData
): Promise<TeamFormState> {
  await requireAdmin();
  const fields = getFields(formData);

  if (!fields.name || !fields.role) {
    return { status: "error", message: "Name and role are required." };
  }
  const slug = fields.slug || slugify(fields.name);

  const supabase = createClient();
  const { error } = await supabase
    .from("team_members")
    .update({ ...fields, slug })
    .eq("id", memberId);

  if (error) {
    return {
      status: "error",
      message: error.code === "23505" ? "Slug already exists." : error.message,
    };
  }

  revalidatePath("/admin/team");
  revalidatePath(`/admin/team/${memberId}`);
  revalidatePath("/team");
  revalidatePath("/");
  return { status: "success", message: "Team member saved." };
}

export async function deleteTeamMember(memberId: string) {
  await requireAdmin();
  const supabase = createClient();
  await supabase.from("team_members").delete().eq("id", memberId);
  revalidatePath("/admin/team");
  revalidatePath("/team");
  revalidatePath("/");
  redirect("/admin/team");
}
