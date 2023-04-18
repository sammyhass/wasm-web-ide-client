import { expect, test } from '@playwright/test';
import { getTestUser, getURL } from '../util';
import {
  LoginRegisterPage,
  createRandomLoginInput,
} from '../util/pom/LoginRegisterPage';
import { Navbar } from '../util/pom/Navbar';

test('can login', async ({ page }) => {
  const testUser = getTestUser();

  await page.goto('/login');
  const pom = new LoginRegisterPage(page);

  await pom.login(testUser.email, testUser.password);

  await page.waitForURL(getURL('/projects'));
  expect(page.url()).toBe(getURL('/projects'));

  const nav = new Navbar(page);
  await nav.logoutButton.waitFor();

  const isLoggedIn = await nav.isLoggedIn();
  expect(isLoggedIn).toBe(true);
});

test('cannot login with invalid credentials', async ({ page }) => {
  await page.goto('/login');
  const pom = new LoginRegisterPage(page);

  const badCredentials = createRandomLoginInput();

  await pom.login(badCredentials.email, badCredentials.password);
  await pom.error.waitFor();

  expect(page.url()).toBe(getURL('/login'));
  expect(await pom.error.isVisible()).toBe(true);
});
