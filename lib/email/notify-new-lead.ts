import { Resend } from "resend";

const NOTIFY_TO = "hamzah@jin-legal.com";
const FROM = "Jin Legal <onboarding@resend.dev>";

export type LeadNotification = {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  subject?: string | null;
  message: string;
};

/**
 * Send a notification email when a new contact lead is submitted.
 * Returns true on success, false on failure. Never throws.
 *
 * If RESEND_API_KEY is not set, logs a warning and returns false.
 * The caller should treat this as fire-and-forget — do not block on it.
 */
export async function notifyNewLead(lead: LeadNotification): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "[notifyNewLead] RESEND_API_KEY not set — skipping email notification."
    );
    return false;
  }

  try {
    const resend = new Resend(apiKey);
    const subjectLine = lead.subject
      ? `New Lead: ${lead.subject}`
      : "New Lead: General Inquiry";

    const { error } = await resend.emails.send({
      from: FROM,
      to: NOTIFY_TO,
      replyTo: lead.email,
      subject: subjectLine,
      html: buildEmailHtml(lead),
      text: buildEmailText(lead),
    });

    if (error) {
      console.error("[notifyNewLead] Resend error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[notifyNewLead] unexpected error:", err);
    return false;
  }
}

function buildEmailHtml(lead: LeadNotification): string {
  const fields = [
    { label: "Name", value: lead.name },
    { label: "Email", value: lead.email },
    { label: "Phone", value: lead.phone || "—" },
    { label: "Company", value: lead.company || "—" },
    { label: "Subject", value: lead.subject || "General Inquiry" },
  ];
  const rows = fields
    .map(
      (f) => `
    <tr>
      <td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #6b7f78; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; width: 100px;">${f.label}</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #1a2420; font-size: 14px;">${escapeHtml(f.value)}</td>
    </tr>`
    )
    .join("");

  return `<!doctype html>
<html>
<body style="margin: 0; padding: 30px; font-family: -apple-system, sans-serif; background: #faf7f1;">
  <table style="max-width: 600px; margin: 0 auto; background: white; border-top: 3px solid #c9a84c;" cellpadding="0" cellspacing="0">
    <tr>
      <td style="padding: 32px;">
        <div style="font-size: 11px; letter-spacing: 3px; color: #c9a84c; text-transform: uppercase; font-weight: 700; margin-bottom: 8px;">New Contact Lead</div>
        <h1 style="font-family: Georgia, serif; font-size: 24px; font-weight: 400; color: #1a4035; margin: 0 0 24px;">${escapeHtml(lead.name)}</h1>

        <table cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse;">${rows}</table>

        <div style="margin-top: 28px; padding: 20px; background: #faf7f1; border-left: 3px solid #c9a84c;">
          <div style="font-size: 11px; letter-spacing: 2px; color: #c9a84c; text-transform: uppercase; font-weight: 700; margin-bottom: 12px;">Message</div>
          <p style="font-size: 14px; color: #1a2420; line-height: 1.7; margin: 0; white-space: pre-wrap;">${escapeHtml(lead.message)}</p>
        </div>

        <p style="margin-top: 28px; font-size: 12px; color: #6b7f78;">
          Reply to this email to respond directly to ${escapeHtml(lead.name)}.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildEmailText(lead: LeadNotification): string {
  return [
    "NEW CONTACT LEAD",
    "================",
    "",
    `Name:    ${lead.name}`,
    `Email:   ${lead.email}`,
    `Phone:   ${lead.phone || "—"}`,
    `Company: ${lead.company || "—"}`,
    `Subject: ${lead.subject || "General Inquiry"}`,
    "",
    "Message:",
    "--------",
    lead.message,
    "",
    `Reply to this email to respond directly to ${lead.name}.`,
  ].join("\n");
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
