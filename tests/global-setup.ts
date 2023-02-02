import { chromium, FullConfig } from '@playwright/test';
import { getTestURL } from './util';
import { loginWithTestUser } from './util/pom/LoginRegisterPage';

export default async function globalSetup(cfg: FullConfig) {
  const browser = await chromium.launch();

  const page = await browser.newPage({
    baseURL: getTestURL(),
  });

  await page.goto('/login');

  await loginWithTestUser(page);

  await page.context().storageState({ path: 'authedStorageState.json' });

  await browser.close();
}
