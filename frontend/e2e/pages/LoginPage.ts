import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly signUpLink: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByPlaceholder('Enter your email');
    this.passwordInput = page.getByPlaceholder('Enter your password');
    this.submitButton = page.getByRole('button', { name: /sign in/i });
    this.errorMessage = page.locator('.text-red-400');
    this.signUpLink = page.getByRole('link', { name: /sign up/i });
  }

  async goto() {
    await this.navigate('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectErrorMessage(message: string) {
    await expect(this.errorMessage).toContainText(message);
  }

  async expectToBeOnLoginPage() {
    await expect(this.page).toHaveURL(/\/login/);
    await expect(this.page.getByText('Welcome back')).toBeVisible();
  }
}
