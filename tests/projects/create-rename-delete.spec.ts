import { expect, Page, test } from '@playwright/test';
import { getURL } from '../util';
import { Navbar } from '../util/pom/Navbar';
import {
  createRandomProjectName,
  NewProjectPage,
} from '../util/pom/NewProjectPage';
import {
  ProjectEditorPage,
  waitForProjectPage,
} from '../util/pom/ProjectEditorPage';
import { ProjectsPage } from '../util/pom/ProjectsPage';

let page: Page;
let newProjectName: string;
let projectsPagePom: ProjectsPage;

test.describe.configure({ mode: 'serial' });
test.beforeAll(async ({ browser }) => {
  page = await browser.newPage({
    storageState: 'authedStorageState.json',
  });

  await page.goto('/projects');

  newProjectName = createRandomProjectName();
  projectsPagePom = new ProjectsPage(page);
});

test('can create a project', async () => {
  await projectsPagePom.newProjectButton.click();

  await page.waitForURL(getURL('/projects/new'));
  expect(page.url()).toBe(getURL('/projects/new'));

  const newProjectPagePom = new NewProjectPage(page);

  await newProjectPagePom.createProject(newProjectName);

  await waitForProjectPage(page, newProjectName);

  const navbar = new Navbar(page);

  expect(await navbar.title.innerText()).toContain(newProjectName);
});

test('can rename the project', async () => {
  newProjectName = createRandomProjectName();
  const projectEditorPagePom = new ProjectEditorPage(page);

  await projectEditorPagePom.settingsButton.click();

  await projectEditorPagePom.settingsModal.renameProject(newProjectName);

  await page.waitForLoadState('networkidle');

  const navbar = new Navbar(page);

  await navbar.title.locator(`text=${newProjectName}`).waitFor();

  expect(await navbar.title.innerText()).toContain(newProjectName);
});

test('can see project exists on project page', async () => {
  await page.goto('/projects');

  await page.waitForLoadState('networkidle');

  expect(
    await projectsPagePom.projectCards
      .getByTestId('project-title')
      .allInnerTexts()
  ).toContain(newProjectName);
});

test('can delete the project', async () => {
  await projectsPagePom.projectCards
    .getByTestId('project-title')
    .getByText(newProjectName)
    .click();

  await waitForProjectPage(page, newProjectName);

  const projectEditorPagePom = new ProjectEditorPage(page);

  await projectEditorPagePom.settingsButton.click();

  await projectEditorPagePom.settingsModal.deleteProject();

  await page.waitForURL(getURL('/projects'));

  await page.waitForLoadState('networkidle');

  await projectsPagePom.projectCards
    .getByTestId('project-title')
    .getByText(newProjectName)
    .waitFor({
      state: 'hidden',
    });

  expect(
    await projectsPagePom.projectCards
      .getByTestId('project-title')
      .allInnerTexts()
  ).not.toContain(newProjectName);
});
