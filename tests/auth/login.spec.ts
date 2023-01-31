import { expect, test } from '@playwright/test';
import { getTestUser, getURL } from '../util';
import { LoginRegisterPage } from '../util/pom/LoginRegisterPage';
import { Navbar } from '../util/pom/Navbar';

test('can login', async ({ page }) => {
  const testUser = getTestUser();

  await page.goto('/login');
  const pom = new LoginRegisterPage(page);

  if (!testUser.email || !testUser.password) {
    throw new Error('Missing test user credentials');
  }

  await pom.login(testUser.email, testUser.password);

  await page.waitForLoadState('networkidle');
  expect(page.url()).toBe(getURL('/projects'));

  const nav = new Navbar(page);
  const isLoggedIn = await nav.isLoggedIn();

  expect(isLoggedIn).toBe(true);
});
