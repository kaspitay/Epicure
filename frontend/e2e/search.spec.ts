import { test, expect } from '@playwright/test';
import { SearchPage } from './pages/SearchPage';

test.describe('Search & Filtering', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.goto();
  });

  test('should display search page correctly', async ({ page }) => {
    await expect(page).toHaveURL(/\/search/);
    await expect(searchPage.searchInput).toBeVisible();
    await expect(searchPage.filterButton).toBeVisible();
    await expect(searchPage.sortSelect).toBeVisible();
  });

  test('should search recipes by text', async ({ page }) => {
    await searchPage.search('pasta');
    await searchPage.expectURLContains('q', 'pasta');
  });

  test('should clear search', async ({ page }) => {
    await searchPage.search('pasta');
    await searchPage.clearSearch();
    await expect(page).not.toHaveURL(/q=pasta/);
  });

  test('should open and close filters panel', async ({ page }) => {
    await searchPage.openFilters();
    // Filters panel should be visible
    await expect(page.getByText('Popular:')).toBeVisible();

    await searchPage.openFilters();
    // Filters panel should be hidden
    await expect(page.getByText('Popular:')).not.toBeVisible();
  });

  test('should filter by tags', async ({ page }) => {
    await searchPage.openFilters();
    // Wait for tags to load
    await page.waitForTimeout(500);

    // Click on a tag (if available)
    const tagButton = page.locator('button').filter({ hasText: /Quick|Easy|Vegetarian/i }).first();
    if (await tagButton.isVisible()) {
      await tagButton.click();
      await page.waitForTimeout(500);
      // Check URL contains tags parameter
      await expect(page).toHaveURL(/tags=/);
    }
  });

  test('should change sort order', async ({ page }) => {
    await searchPage.selectSort('oldest');
    await searchPage.expectURLContains('sort', 'oldest');

    await searchPage.selectSort('rating');
    await searchPage.expectURLContains('sort', 'rating');
  });

  test('should show active filters', async ({ page }) => {
    await searchPage.search('test');
    await expect(page.getByText('"test"')).toBeVisible();
  });

  test('should clear all filters', async ({ page }) => {
    await searchPage.search('test');
    await expect(page.getByText('Clear all')).toBeVisible();

    await page.getByRole('button', { name: /clear all/i }).click();
    await expect(page).toHaveURL('/search');
  });

  test('should switch between recipes and chefs', async ({ page }) => {
    // Default is recipes
    await expect(page.getByRole('button', { name: /recipes/i })).toHaveClass(/bg-\[#BE6F50\]/);

    // Switch to chefs
    await page.getByRole('button', { name: /chefs/i }).click();
    await expect(page.getByRole('button', { name: /chefs/i })).toHaveClass(/bg-\[#BE6F50\]/);

    // Search placeholder should change
    await expect(searchPage.searchInput).toHaveAttribute('placeholder', /search chefs/i);
  });
});
