import { expect, test } from '@playwright/test';
import { getURL } from '../util';
import { Navbar } from '../util/pom/Navbar';

test('can logout', async ({ browser }) => {
  const page = await browser.newPage({
    storageState: 'authedStorageState.json',
  });

  await page.goto(getURL('/projects'));

  const nav = new Navbar(page);
  await nav.waitForLoggedIn();

  await nav.clickLogoutButton();
  await nav.waitForLoggedOut();

  const isLoggedIn = await nav.isLoggedIn();
  expect(isLoggedIn).toBe(false);
});
