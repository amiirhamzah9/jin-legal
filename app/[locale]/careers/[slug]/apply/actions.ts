"use server";

import { getCareerBySlug } from "@/lib/data/queries";
import { notifyApplication } from "@/lib/email/notify-application";

export type ApplicationFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const MAX_CV_BYTES = 10 * 1024 * 1024; // 10 MB

export async function submitApplication(
  slug: string,
  _prev: ApplicationFormState,
  formData: FormData
): Promise<ApplicationFormState> {
  const career = await getCareerBySlug(slug);
  if (!career) {
    return { status: "error", message: "Position not found or no longer active." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const coverLetter = String(formData.get("cover_letter") ?? "").trim() || null;
  const cvEntry = formData.get("cv");
  const cvFile = cvEntry instanceof File && cvEntry.size > 0 ? cvEntry : null;

  // Validation
  if (!name || !email) {
    return { status: "error", message: "Name and email are required." };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { status: "error", message: "Please provide a valid email address." };
  }
  if (!cvFile) {
    return { status: "error", message: "Please attach your CV/resume." };
  }
  if (cvFile.size > MAX_CV_BYTES) {
    return { status: "error", message: "CV is too large — max 10 MB." };
  }

  const cvBuffer = Buffer.from(await cvFile.arrayBuffer());

  // Send email notification
  void notifyApplication({
    positionTitle: career.title,
    applicantName: name,
    applicantEmail: email,
    applicantPhone: phone,
    coverLetter,
    cv: { filename: cvFile.name, content: cvBuffer },
  });

  return {
    status: "success",
    message: `Thank you, ${name}. Your application for ${career.title} has been received — we'll review and get back to you within 1–2 weeks.`,
  };
}
