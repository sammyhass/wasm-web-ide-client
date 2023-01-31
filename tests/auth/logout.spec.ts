import { expect, test } from '@playwright/test';
import { getTestUser, getURL } from '../util';
import { LoginRegisterPage } from '../util/pom/LoginRegisterPage';
import { Navbar } from '../util/pom/Navbar';

test('can logout', async ({ page }) => {
  const credentials = getTestUser();

  await page.goto('/login');

  const pom = new LoginRegisterPage(page);

  if (!credentials.email || !credentials.password) {
    throw new Error('Missing test user credentials');
  }

  await pom.login(credentials.email, credentials.password);

  await page.waitForLoadState('networkidle');

  expect(page.url()).toBe(getURL('/projects'));

  const nav = new Navbar(page);

  await nav.clickLogoutButton();

  await nav.loginButton.waitFor();

  const isLoggedIn = await nav.isLoggedIn();

  expect(isLoggedIn).toBe(false);
});
