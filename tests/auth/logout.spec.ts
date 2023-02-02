import { expect, test } from '@playwright/test';
import { getURL } from '../util';
import { Navbar } from '../util/pom/Navbar';

test('can logout', async ({ browser }) => {
  const page = await browser.newPage({
    storageState: 'authedStorageState.json',
  });

  await page.goto(getURL('/projects'));

  await page.waitForLoadState('networkidle');

  const nav = new Navbar(page);

  await nav.clickLogoutButton();

  await nav.loginButton.waitFor();

  const isLoggedIn = await nav.isLoggedIn();

  expect(isLoggedIn).toBe(false);
});
