import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchPage extends BasePage {
  readonly searchInput: Locator;
  readonly filterButton: Locator;
  readonly sortSelect: Locator;
  readonly recipeResults: Locator;
  readonly loadMoreButton: Locator;
  readonly resultsCount: Locator;
  readonly tagButtons: Locator;
  readonly clearFiltersButton: Locator;
  readonly noResultsMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('input[type="text"]').first();
    this.filterButton = page.getByRole('button', { name: /filters/i });
    this.sortSelect = page.locator('select');
    this.recipeResults = page.locator('[data-testid="recipe-card"]');
    this.loadMoreButton = page.getByRole('button', { name: /load more/i });
    this.resultsCount = page.locator('text=/\\d+ results/');
    this.tagButtons = page.locator('button').filter({ hasText: /^(?!Filters|Load More|Clear)/ });
    this.clearFiltersButton = page.getByRole('button', { name: /clear all/i });
    this.noResultsMessage = page.getByText('No results found');
  }

  async goto() {
    await this.navigate('/search');
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    // Wait for debounce
    await this.page.waitForTimeout(400);
  }

  async clearSearch() {
    await this.searchInput.clear();
    await this.page.waitForTimeout(400);
  }

  async openFilters() {
    await this.filterButton.click();
  }

  async selectTag(tagName: string) {
    await this.page.getByRole('button', { name: tagName, exact: true }).click();
    await this.page.waitForTimeout(400);
  }

  async selectSort(option: 'newest' | 'oldest' | 'rating' | 'popular') {
    await this.sortSelect.selectOption(option);
    await this.page.waitForTimeout(400);
  }

  async loadMore() {
    await this.loadMoreButton.click();
  }

  async expectResultsVisible() {
    await expect(this.recipeResults.first()).toBeVisible({ timeout: 10000 });
  }

  async expectNoResults() {
    await expect(this.noResultsMessage).toBeVisible();
  }

  async getResultsCount() {
    return this.recipeResults.count();
  }

  async expectURLContains(param: string, value: string) {
    await expect(this.page).toHaveURL(new RegExp(`${param}=${value}`));
  }
}
