import { Resend } from "resend";

const NOTIFY_TO = "center@jin-legal.com";
const FROM = "JIN Legal Counsel <onboarding@resend.dev>";

export type ApplicationNotification = {
  positionTitle: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string | null;
  coverLetter?: string | null;
  cv: { filename: string; content: Buffer };
};

/**
 * Send an email notification when a candidate applies for a job.
 * Returns true on success, false on failure. Never throws.
 */
export async function notifyApplication(app: ApplicationNotification): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[notifyApplication] RESEND_API_KEY not set — skipping email.");
    return false;
  }

  try {
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: FROM,
      to: NOTIFY_TO,
      replyTo: app.applicantEmail,
      subject: `Application: ${app.positionTitle} — ${app.applicantName}`,
      html: buildHtml(app),
      text: buildText(app),
      attachments: [{ filename: app.cv.filename, content: app.cv.content }],
    });

    if (error) {
      console.error("[notifyApplication] Resend error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[notifyApplication] unexpected error:", err);
    return false;
  }
}

function buildHtml(app: ApplicationNotification): string {
  const fields = [
    { label: "Position", value: app.positionTitle },
    { label: "Name", value: app.applicantName },
    { label: "Email", value: app.applicantEmail },
    { label: "Phone", value: app.applicantPhone || "—" },
    { label: "CV", value: app.cv.filename },
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
        <div style="font-size: 11px; letter-spacing: 3px; color: #c9a84c; text-transform: uppercase; font-weight: 700; margin-bottom: 8px;">New Job Application</div>
        <h1 style="font-family: Georgia, serif; font-size: 24px; font-weight: 400; color: #1a4035; margin: 0 0 24px;">${escapeHtml(app.applicantName)}</h1>
        <table cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse;">${rows}</table>
        ${
          app.coverLetter
            ? `
        <div style="margin-top: 28px; padding: 20px; background: #faf7f1; border-left: 3px solid #c9a84c;">
          <div style="font-size: 11px; letter-spacing: 2px; color: #c9a84c; text-transform: uppercase; font-weight: 700; margin-bottom: 12px;">Cover Letter</div>
          <p style="font-size: 14px; color: #1a2420; line-height: 1.7; margin: 0; white-space: pre-wrap;">${escapeHtml(app.coverLetter)}</p>
        </div>`
            : ""
        }
        <p style="margin-top: 28px; font-size: 12px; color: #6b7f78;">
          Reply to this email to respond directly to ${escapeHtml(app.applicantName)}. CV is attached.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildText(app: ApplicationNotification): string {
  return [
    "NEW JOB APPLICATION",
    "===================",
    "",
    `Position:  ${app.positionTitle}`,
    `Name:      ${app.applicantName}`,
    `Email:     ${app.applicantEmail}`,
    `Phone:     ${app.applicantPhone || "—"}`,
    `CV:        ${app.cv.filename}`,
    "",
    app.coverLetter ? "Cover Letter:\n--------\n" + app.coverLetter + "\n" : "",
    `Reply to this email to respond directly to ${app.applicantName}. CV is attached.`,
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
