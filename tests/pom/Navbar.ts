import { Locator, Page } from '@playwright/test';

/**
 * POM for the navbar.
 */
export class Navbar {
  readonly loginButton: Locator;
  readonly logoutButton: Locator;
  readonly projectsButton: Locator;

  constructor(page: Page) {
    this.loginButton = page.getByTestId('login-button');
    this.logoutButton = page.getByTestId('logout-button');
    this.projectsButton = page.getByTestId('projects-button');
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }

  async clickLogoutButton() {
    await this.logoutButton.click();
  }

  async isLoggedIn() {
    return await this.logoutButton.isVisible();
  }
}
