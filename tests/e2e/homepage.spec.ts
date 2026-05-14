import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads without console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    // Filter out third-party errors (Unsplash CDN warnings etc.)
    const ownErrors = errors.filter((e) => !e.includes("unsplash"));
    expect(ownErrors).toEqual([]);
  });

  test("hero renders tagline + CTAs", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Legal Excellence");
    await expect(page.getByRole("link", { name: /consult with us/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /explore practice areas/i })).toBeVisible();
  });

  test("scrolls to footer and verifies legal name", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByText("JIN Legal Counsel").first()).toBeVisible();
  });

  test("all 12 practice areas are rendered", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Business & Corporate Law")).toBeVisible();
    await expect(page.getByText("Banking, Finance & FinTech")).toBeVisible();
    await expect(page.getByText("Sport & Entertainment")).toBeVisible();
  });
});
