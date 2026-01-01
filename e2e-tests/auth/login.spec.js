const { test, expect } = require("@playwright/test");

test.describe("Login Page", () => {

  test("Login succeeds with valid credentials", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[name="email"]', 'testuser@gmail.com');
    await page.fill('input[name="password"]', '123456');

    await page.click('button[type="submit"]');

    // Assert welcome message
    await expect(
      page.locator("h1")
    ).toHaveText("Welcome testuser@gmail.com ");
  });


  test("Login fails with invalid credentials", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[name="email"]', 'testuser@gmail.com');
    await page.fill('input[name="password"]', 'wrongpassword');

    await page.click('button[type="submit"]');

    // Assert error message
    await expect(
      page.locator("h3")
    ).toContainText("Invalid Email or password");

    // Assert Try again link
    await expect(
      page.locator('a', { hasText: "Try again" })
    ).toBeVisible();
  });

});
