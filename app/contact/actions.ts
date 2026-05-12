"use server";

import { createClient } from "@/lib/supabase/server";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const company = String(formData.get("company") ?? "").trim() || null;
  const subject = String(formData.get("subject") ?? "").trim() || null;
  const message = String(formData.get("message") ?? "").trim();

  // Basic validation
  if (!name || !email || !message) {
    return {
      status: "error",
      message: "Name, email, and message are required.",
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { status: "error", message: "Please provide a valid email address." };
  }

  if (message.length < 10) {
    return {
      status: "error",
      message: "Message is too short — please provide at least 10 characters.",
    };
  }

  const supabase = createClient();
  const { error } = await supabase.from("contact_leads").insert({
    name,
    email,
    phone,
    company,
    subject,
    message,
  });

  if (error) {
    console.error("submitContactForm error:", error);
    return {
      status: "error",
      message: "Something went wrong submitting your message. Please try again.",
    };
  }

  return {
    status: "success",
    message: "Thank you — we'll be in touch within 1–2 business days.",
  };
}
