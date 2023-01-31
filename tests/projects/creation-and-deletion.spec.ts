import test, { expect, Page } from '@playwright/test';
import { getTestUser, getURL } from '../util';
import { LoginRegisterPage } from '../util/pom/LoginRegisterPage';
import { Navbar } from '../util/pom/Navbar';
import {
  createRandomProjectName,
  NewProjectPage,
} from '../util/pom/NewProjectPage';
import { ProjectEditorPage } from '../util/pom/ProjectEditorPage';
import { ProjectsPage } from '../util/pom/ProjectsPage';

test.beforeEach(async ({ page }) => {
  await page.goto('/login');

  const loginPage = new LoginRegisterPage(page);

  const credentials = getTestUser();

  await loginPage.login(credentials.email, credentials.password);
  await page.waitForLoadState('networkidle');
  expect(page.url()).toBe(getURL('/projects'));
});

test('project creation and deletion', async ({ page }) => {
  const projectsPage = new ProjectsPage(page);
  const projectName = createRandomProjectName();

  await test.step('click new project button', async () => {
    await projectsPage.newProjectButton.click();
    await page.waitForURL(getURL('/projects/new'));
  });

  const newProjectPage = new NewProjectPage(page);
  await test.step('create new project', async () => {
    await newProjectPage.createProject(projectName);
    await page.waitForLoadState('networkidle');
  });

  await test.step('expect redirect to project page with correct title in navbar', async () => {
    await waitForProjectPage(page, projectName);

    const navbar = new Navbar(page);

    expect(await navbar.title.innerText()).toContain(projectName);
  });

  await test.step('can see project in projects page', async () => {
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');
    expect(
      await projectsPage.projectCards
        .getByTestId('project-title')
        .allInnerTexts()
    ).toContain(projectName);
  });

  await test.step('click on project in projects page to go to project page', async () => {
    await projectsPage.projectCards.getByText(projectName).click();

    await waitForProjectPage(page, projectName);

    const navbar = new Navbar(page);
    expect(await navbar.title.innerText()).toContain(projectName);
  });

  await test.step('can delete project', async () => {
    const projectEditorPage = new ProjectEditorPage(page);

    await projectEditorPage.settingsButton.click();
    await projectEditorPage.settingsModal.deleteProject();

    await page.waitForURL(getURL('/projects'));
    await page.waitForLoadState('networkidle');
    expect(
      await projectsPage.projectCards
        .getByTestId('project-title')
        .allInnerTexts()
    ).not.toContain(projectName);
  });
});

async function waitForProjectPage(page: Page, title: string) {
  const navbar = new Navbar(page);
  const regex =
    /\/projects\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/;

  await page.waitForURL(url => regex.test(url.href));
  await page.waitForLoadState('networkidle');

  await navbar.title.locator(`text=${title}`).waitFor();
}
