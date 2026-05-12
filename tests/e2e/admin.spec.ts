import { test, expect } from "@playwright/test";

test.describe("Admin auth", () => {
  test("Unauthenticated user is redirected from /admin to /admin/login", async ({
    page,
  }) => {
    const response = await page.goto("/admin");
    // Should end up at the login page after middleware redirect
    await expect(page).toHaveURL(/\/admin\/login/);
    expect(response?.status()).toBeLessThan(500);
  });

  test("Login page renders the form", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("Login fails with bad credentials and stays on login page", async ({
    page,
  }) => {
    await page.goto("/admin/login");
    await page.getByLabel(/email/i).fill("not-an-admin@example.com");
    await page.getByLabel(/password/i).fill("wrong-password");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
