import { test, expect } from "@playwright/test";

test.describe("Insights pages", () => {
  test("Insights listing renders posts from Supabase", async ({ page }) => {
    await page.goto("/insights");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Legal Perspectives");
    await expect(page.getByText(/Indonesia/i).first()).toBeVisible();
  });

  test("Insights detail page renders markdown content", async ({ page }) => {
    await page.goto("/insights/indonesia-new-company-law");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Company Law");
    await expect(page.getByText(/Overview/i).first()).toBeVisible();
  });

  test("Bogus insight slug returns 404", async ({ page }) => {
    const response = await page.goto("/insights/this-does-not-exist");
    expect(response?.status()).toBe(404);
  });
});
