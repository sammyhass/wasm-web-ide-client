import { expect, test } from '@playwright/test';
import { getURL } from '../util';
import { loginWithTestUser } from '../util/pom/LoginRegisterPage';
import { Navbar } from '../util/pom/Navbar';

test('can logout', async ({ page }) => {
  await loginWithTestUser(page);

  expect(page.url()).toBe(getURL('/projects'));

  const nav = new Navbar(page);

  await nav.clickLogoutButton();

  await nav.loginButton.waitFor();

  const isLoggedIn = await nav.isLoggedIn();

  expect(isLoggedIn).toBe(false);
});
