import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  async navigate(path: string) {
    await this.page.goto(path);
  }

  async waitForLoadState() {
    await this.page.waitForLoadState('networkidle');
  }

  async getTitle() {
    return this.page.title();
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `e2e/screenshots/${name}.png` });
  }
}
