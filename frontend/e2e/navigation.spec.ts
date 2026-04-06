import { test, expect } from '@playwright/test';

test.describe('Navigation - Public Pages', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Epicure/i);
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText('Welcome back')).toBeVisible();
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/signup');
    await expect(page).toHaveURL(/\/signup/);
  });

  test('should redirect protected routes to login', async ({ page }) => {
    // Search is protected, should redirect to login
    await page.goto('/search');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should handle unknown routes gracefully', async ({ page }) => {
    await page.goto('/nonexistent-page-xyz');
    // Should redirect to home or login
    await page.waitForLoadState('networkidle');
    const url = page.url();
    expect(url.includes('/login') || url.endsWith('/')).toBeTruthy();
  });
});

test.describe('Responsive Design', () => {
  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page).toHaveTitle(/Epicure/i);
  });

  test('should display login page on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/login');
    await expect(page.getByText('Welcome back')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
  });

  test('should display login page on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/login');
    await expect(page.getByText('Welcome back')).toBeVisible();
  });
});
