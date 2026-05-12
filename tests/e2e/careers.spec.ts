import { test, expect } from "@playwright/test";

test.describe("Careers page", () => {
  test("Careers page lists open positions", async ({ page }) => {
    await page.goto("/careers");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Build a Career");
    await expect(page.getByText(/Senior Associate/i).first()).toBeVisible();
  });

  test("Apply CTA links to /contact with subject param", async ({ page }) => {
    await page.goto("/careers");
    const applyLink = page.getByRole("link", { name: /apply/i }).first();
    const href = await applyLink.getAttribute("href");
    expect(href).toContain("/contact?subject=");
  });
});
