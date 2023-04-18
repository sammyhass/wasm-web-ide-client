import { Locator, Page } from '@playwright/test';

/**
 * POM for the navbar.
 */
export class Navbar {
  readonly loginButton: Locator;
  readonly logoutButton: Locator;
  readonly projectsButton: Locator;
  readonly title: Locator;

  constructor(page: Page) {
    this.loginButton = page.getByTestId('login-button');
    this.logoutButton = page.getByTestId('logout-button');
    this.projectsButton = page.getByTestId('projects-button');
    this.title = page.getByTestId('navbar-title');
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

  async waitForLoggedIn() {
    await this.logoutButton.waitFor();
  }

  async waitForLoggedOut() {
    await this.loginButton.waitFor();
  }
}
