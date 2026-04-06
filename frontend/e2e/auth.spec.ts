import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.describe('Authentication', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should display login page correctly', async () => {
    await loginPage.expectToBeOnLoginPage();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('should show error for empty fields', async () => {
    await loginPage.submitButton.click();
    await loginPage.expectErrorMessage('Please fill in all fields');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await loginPage.login('invalid@example.com', 'wrongpassword');
    // Wait for API response
    await page.waitForTimeout(2000);
    await loginPage.expectErrorMessage('does not exist');
  });

  test('should navigate to signup page', async ({ page }) => {
    await loginPage.signUpLink.click();
    await expect(page).toHaveURL(/\/signup/);
  });

  test('should have password visibility toggle', async ({ page }) => {
    await loginPage.passwordInput.fill('testpassword');

    // Password should be hidden by default
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');

    // Click toggle button
    await page.locator('button').filter({ has: page.locator('svg') }).last().click();

    // Password should now be visible
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');
  });
});
