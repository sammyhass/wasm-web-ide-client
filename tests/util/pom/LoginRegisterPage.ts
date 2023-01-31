import { LoginInputT } from '@/lib/api/services/auth';
import { faker } from '@faker-js/faker';
import { Locator, Page } from '@playwright/test';
import { getTestUser, getURL } from '..';

export class LoginRegisterPage {
  readonly page: Page;

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly toggleMode: Locator;

  readonly error: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.confirmPasswordInput = page.getByTestId('confirm-password-input');
    this.submitButton = page.locator('form').locator('button[type="submit"]');
    this.toggleMode = page.getByTestId('toggle-mode');
    this.error = page.getByTestId('error');
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
  password: faker.internet.password(18),
});

// Login helper function used to setup tests
export const loginWithTestUser = async (page: Page) => {
  await page.goto('/login');

  const pom = new LoginRegisterPage(page);

  const testUser = getTestUser();

  await pom.login(testUser.email, testUser.password);

  await page.waitForURL(getURL('/projects'));
  await page.waitForLoadState('networkidle');
};
