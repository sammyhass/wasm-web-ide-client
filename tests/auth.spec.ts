import { expect, test } from '@playwright/test';
import {
  createRandomLoginInput,
  LoginRegisterPage,
} from './pom/LoginRegisterPage';
import { Navbar } from './pom/Navbar';
import { getTestUser, getURL } from './util';

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

test('can register', async ({ page }) => {
  const credentials = createRandomLoginInput();

  await page.goto('/login');
  const pom = new LoginRegisterPage(page);
  await pom.toggleMode.click();

  await pom.register(
    credentials.email,
    credentials.password,
    credentials.password
  );

  await page.waitForURL(getURL('/projects'));

  const nav = new Navbar(page);
  const isLoggedIn = await nav.isLoggedIn();

  expect(isLoggedIn).toBe(true);
});

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
