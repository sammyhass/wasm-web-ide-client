import { expect, test } from '@playwright/test';
import { getURL } from '../util';
import {
  createRandomLoginInput,
  LoginRegisterPage,
} from '../util/pom/LoginRegisterPage';
import { Navbar } from '../util/pom/Navbar';

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
