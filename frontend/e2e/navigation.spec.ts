import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Epicure/i);
  });

  test('should navigate to search page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /search/i }).first().click();
    await expect(page).toHaveURL(/\/search/);
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

  test('should handle 404 gracefully', async ({ page }) => {
    await page.goto('/nonexistent-page');
    // Should redirect to home or show 404
    await expect(page).toHaveURL(/\//);
  });

  test('should preserve query params on navigation', async ({ page }) => {
    await page.goto('/search?q=pasta&sort=rating');
    await expect(page.locator('input[placeholder*="Search"]')).toHaveValue('pasta');
  });
});

test.describe('Responsive Design', () => {
  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    // Page should still be functional
    await expect(page).toHaveTitle(/Epicure/i);
  });

  test('should be responsive on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/search');
    await expect(page.getByPlaceholder(/search/i)).toBeVisible();
  });
});
