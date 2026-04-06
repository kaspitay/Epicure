import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly recipeCards: Locator;
  readonly searchLink: Locator;
  readonly profileLink: Locator;
  readonly logo: Locator;

  constructor(page: Page) {
    super(page);
    this.recipeCards = page.locator('[data-testid="recipe-card"]');
    this.searchLink = page.getByRole('link', { name: /search/i });
    this.profileLink = page.getByRole('link', { name: /profile/i });
    this.logo = page.getByText('Epicure');
  }

  async goto() {
    await this.navigate('/');
  }

  async expectToBeOnHomePage() {
    await expect(this.page).toHaveURL('/');
  }

  async expectRecipesToBeVisible() {
    await expect(this.recipeCards.first()).toBeVisible({ timeout: 10000 });
  }

  async clickFirstRecipe() {
    await this.recipeCards.first().click();
  }

  async getRecipeCount() {
    return this.recipeCards.count();
  }
}
