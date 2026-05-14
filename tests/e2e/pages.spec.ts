import { test, expect } from "@playwright/test";

test.describe("Static pages", () => {
  test("About page loads and renders firm story", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Modern Legal Partner");
    await expect(page.getByRole("heading", { name: "Integrity" })).toBeVisible();
    await expect(page.getByText(/JIN Legal Counsel/i).first()).toBeVisible();
  });

  test("Team page loads with all 7 partners visible", async ({ page }) => {
    await page.goto("/team");
    await expect(page.getByText("Muhammad Subuh Rezki")).toBeVisible();
    await expect(page.getByText("Ryan Tampubolon")).toBeVisible();
    await expect(page.getByText("Abi Rafdi")).toBeVisible();
    await expect(page.getByText("Achmad Firmansyah")).toBeVisible();
    await expect(page.getByText("Amir Hamzah")).toBeVisible();
    await expect(page.getByText("Aditya Muriza")).toBeVisible();
  });

  test("Team page Litigation filter works", async ({ page }) => {
    await page.goto("/team");
    await page.getByRole("button", { name: /^litigation$/i }).click();
    await expect(page.getByText("Ryan Tampubolon")).toBeVisible();
    await expect(page.getByText("Muhammad Subuh Rezki")).not.toBeVisible();
  });

  test("Practice Areas listing shows all 11 cards", async ({ page }) => {
    await page.goto("/practice-areas");
    await expect(page.getByText("Business & Corporate Law")).toBeVisible();
    await expect(page.getByText("Banking, Finance & FinTech")).toBeVisible();
    await expect(page.getByText("Insolvency, Restructuring & PKPU")).toBeVisible();
  });

  test("Practice area detail page renders and 404s correctly", async ({ page }) => {
    await page.goto("/practice-areas/banking-finance-fintech");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Banking, Finance & FinTech");
    await expect(page.getByText(/Our Approach/i)).toBeVisible();
    await expect(page.getByText("Achmad Firmansyah")).toBeVisible();

    const bogus = await page.goto("/practice-areas/this-does-not-exist");
    expect(bogus?.status()).toBe(404);
  });

  test("Nav highlights active route on About page", async ({ page }) => {
    await page.goto("/about");
    const aboutLink = page.getByRole("link", { name: /^about$/i });
    await expect(aboutLink).toHaveClass(/text-gold/);
  });
});
