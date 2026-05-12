import { test, expect } from "@playwright/test";

test.describe("Contact page", () => {
  test("renders form and info columns", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Legal Needs");
    await expect(page.getByLabel(/^name/i)).toBeVisible();
    await expect(page.getByLabel(/^email/i)).toBeVisible();
    await expect(page.getByLabel(/^message/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /send message/i })).toBeVisible();
    await expect(page.getByText(/info@jinlegal\.co\.id/i).first()).toBeVisible();
  });

  test("shows validation error for empty submission", async ({ page }) => {
    await page.goto("/contact");
    // Browser will block on required HTML5 fields — verify required attribute
    await expect(page.getByLabel(/^name/i)).toHaveAttribute("required");
    await expect(page.getByLabel(/^email/i)).toHaveAttribute("required");
    await expect(page.getByLabel(/^message/i)).toHaveAttribute("required");
  });

  test("pre-fills subject from query param", async ({ page }) => {
    await page.goto("/contact?subject=Senior%20Associate%20%E2%80%94%20Corporate%20Law");
    const subjectSelect = page.getByLabel(/subject/i);
    await expect(subjectSelect).toHaveValue("Senior Associate — Corporate Law");
  });
});
