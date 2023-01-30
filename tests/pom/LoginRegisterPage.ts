import { LoginInputT } from '@/lib/api/services/auth';
import { faker } from '@faker-js/faker';
import { Locator, Page } from '@playwright/test';

export class LoginRegisterPage {
  readonly page: Page;

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly toggleMode: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');

    this.confirmPasswordInput = page.getByTestId('confirm-password-input');
    this.submitButton = page.locator('form').locator('button[type="submit"]');

    this.toggleMode = page.getByTestId('toggle-mode');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async register(email: string, password: string, confirmPassword: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword);
    await this.submitButton.click();
  }
}

export const createRandomLoginInput = (): LoginInputT => ({
  email: faker.internet.email(),
  password: faker.internet.password(20),
});
